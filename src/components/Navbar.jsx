import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ name, onLogout }) {
    return (
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
                                onClick={onLogout}
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
    );
}
