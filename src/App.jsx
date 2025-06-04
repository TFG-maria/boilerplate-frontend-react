import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Link, Route, Routes, useLocation, useNavigate,} from "react-router-dom";
import {fetchPosts, login} from "./api";

// ------------------
// Componente principal App (to-do en este archivo)
// ------------------
function App() {
    // Estado para el nombre de usuario; null si no hay sesión
    const [name, setName] = useState(null);
    // Referencia para el timer de autologout
    const logoutTimer = useRef(null);

    // Al montar la App, comprobamos si hay sesión en sessionStorage
    useEffect(() => {
        const storedName = sessionStorage.getItem("user.name");
        const storedToken = sessionStorage.getItem("token");
        if (storedName && storedToken) {
            const payload = parseJwt(storedToken);
            const nowInSeconds = Math.floor(Date.now() / 1000);
            if (payload && payload.exp > nowInSeconds) {
                // El token sigue válido: restauramos estado
                setName(storedName);
                // Programamos el autologout
                const msUntilExpiry = (payload.exp - nowInSeconds) * 1000;
                scheduleLogout(msUntilExpiry);
            } else {
                // Token expirado: limpiamos sessionStorage
                sessionStorage.removeItem("user.name");
                sessionStorage.removeItem("token");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Programa el autologout para cuando expire el token
    const scheduleLogout = (delayMs) => {
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
        }
        logoutTimer.current = setTimeout(() => {
            handleLogout();
        }, delayMs);
    };

    // Logout manual o al expirar el token
    const handleLogout = () => {
        sessionStorage.removeItem("user.name");
        sessionStorage.removeItem("token");
        setName(null);
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
            logoutTimer.current = null;
        }
    };

    // Callback que se pasa a LoginPage;
    // guarda user.name+token y programa el autologout
    const handleLoginSuccess = (userName, userToken) => {
        const payload = parseJwt(userToken);
        if (!payload) {
            console.error("Token inválido");
            return;
        }
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const msUntilExpiry = (payload.exp - nowInSeconds) * 1000;

        sessionStorage.setItem("user.name", userName);
        sessionStorage.setItem("token", userToken);
        setName(userName);
        scheduleLogout(msUntilExpiry);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <span className="font-bold text-lg">MyApp</span>
                        <div className="space-x-4">
                            <Link to="/" className="text-blue-500 hover:underline">
                                Home
                            </Link>
                            {name ? (
                                <>
                                    <span className="text-gray-700">Hola, {name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 hover:underline"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="text-blue-500 hover:underline">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route
                        path="/login"
                        element={<LoginPage onLoginSuccess={handleLoginSuccess}/>}
                    />
                </Routes>
            </div>
        </Router>
    );
}

// ------------------
// Utilidad para decodificar el payload de un JWT
// ------------------
function parseJwt(token) {
    try {
        const base64Payload = token.split(".")[1];
        const payloadStr = atob(
            base64Payload.replace(/_/g, "/").replace(/-/g, "+")
        );
        return JSON.parse(payloadStr);
    } catch {
        return null;
    }
}

// ------------------
// Componente LandingPage (Home), con imagen por defecto
// ------------------
function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");
    const location = useLocation();

    // Si llegamos con state.message (desde LoginPage), mostramos banner temporal
    useEffect(() => {
        if (location.state && location.state.message) {
            setLoginMessage(location.state.message);
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // Al montar, llamamos a fetchPosts() y adaptamos la respuesta
    useEffect(() => {
        fetchPosts()
            .then((rawData) => {
                const adapted = rawData.map((post) => ({
                    id: post.id,
                    title: post.titulo,
                    description: post.contenido,
                    image: "/assets/placeholder.png",
                }));
                setPosts(adapted);
            })
            .catch(() => {
                setPosts([
                    {
                        id: 1,
                        title: "Paisaje",
                        description: "Vista al atardecer",
                        image: "/assets/placeholder.png",
                    },
                    {
                        id: 2,
                        title: "Montañas",
                        description: "Naturaleza pura",
                        image: "/assets/placeholder.png",
                    },
                    {
                        id: 3,
                        title: "Ciudad",
                        description: "Luces nocturnas",
                        image: "/assets/placeholder.pngy",
                    },
                ]);
            });
    }, []);

    return (
        <div className="container mx-auto py-10 px-4">
            {showMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
                    {loginMessage}
                </div>
            )}
            <h1 className="text-4xl font-bold text-center mb-10">
                Posts destacados
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white shadow rounded overflow-hidden"
                    >
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{post.title}</h2>
                            <p className="text-gray-600 text-sm">{post.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ------------------
// Componente LoginPage
// ------------------
function LoginPage({onLoginSuccess}) {
    const [emailInput, setEmailInput] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Llamamos a login(email, password) → devuelve { message, user: { name, … }, token }
            const result = await login(emailInput, password);
            onLoginSuccess(result.user.name, result.token);
            // Redirigimos a Home pasando mensaje en state
            navigate("/", {state: {message: "Login successful"}});
        } catch {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default App;
