import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// Utilidad para decodificar el payload de un JWT
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

export default function App() {
    const [name, setName] = useState(null);
    const logoutTimer = useRef(null);

    // Chequear sesión en sessionStorage al montar
    useEffect(() => {
        const storedName = sessionStorage.getItem("user.name");
        const storedToken = sessionStorage.getItem("token");
        if (storedName && storedToken) {
            const payload = parseJwt(storedToken);
            const nowInSeconds = Math.floor(Date.now() / 1000);
            if (payload && payload.exp > nowInSeconds) {
                setName(storedName);
                const msUntilExpiry = (payload.exp - nowInSeconds) * 1000;
                scheduleLogout(msUntilExpiry);
            } else {
                sessionStorage.removeItem("user.name");
                sessionStorage.removeItem("token");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Programa el autologout
    const scheduleLogout = (delayMs) => {
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        logoutTimer.current = setTimeout(() => {
            handleLogout();
        }, delayMs);
    };

    // Logout manual o por vencimiento de token
    const handleLogout = () => {
        sessionStorage.removeItem("user.name");
        sessionStorage.removeItem("token");
        setName(null);
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
            logoutTimer.current = null;
        }
    };

    // Callback para Login: guardar name+token y programar autologout
    const handleLoginSuccess = (userName, userToken) => {
        const payload = parseJwt(userToken);
        if (!payload) return;
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
                <Navbar name={name} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route
                        path="/login"
                        element={<Login onLoginSuccess={handleLoginSuccess} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}
