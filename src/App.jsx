import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between">
            <span className="font-bold text-lg">MyApp</span>
            <div className="space-x-4">
              <Link to="/" className="text-blue-500 hover:underline">Home</Link>
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function LandingPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulamos petición a backend
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => {
        // Datos falsos en caso de error
        setPosts([
          { id: 1, title: "Paisaje", description: "Vista al atardecer", image: "https://source.unsplash.com/random/300x200?sunset" },
          { id: 2, title: "Montañas", description: "Naturaleza pura", image: "https://source.unsplash.com/random/300x200?mountain" },
          { id: 3, title: "Ciudad", description: "Luces nocturnas", image: "https://source.unsplash.com/random/300x200?city" }
        ]);
      });
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Posts destacados</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow rounded overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      alert("Login response: " + JSON.stringify(data));
    } catch (error) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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