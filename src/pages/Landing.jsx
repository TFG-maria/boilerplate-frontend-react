import React, { useState, useEffect } from "react";
import { fetchPosts } from "../api";

export default function Landing() {
    const [posts, setPosts] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    // useLocation se puede inyectar desde App.jsx, aquí asumimos que
    // App.jsx pasará loginMessage y showMessage como props si hace falta.
    // Para simplicidad, en este ejemplo mostramos únicamente posts.

    useEffect(() => {
        fetchPosts()
            .then((rawData) => {
                // rawData: [{ id, titulo, contenido, likes, dislikes }, ...]
                const adapted = rawData.map((post) => ({
                    id: post.id,
                    title: post.titulo,
                    description: post.contenido,
                    image: "/assets/placeholder.png", // ruta en public/assets
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
                        image: "/assets/placeholder.png",
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
