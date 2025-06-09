import React, { useState, useEffect } from "react";
import { fetchPosts } from "../api";

export default function Landing() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setLoginMessage("You should log in to see posts");
            setShowMessage(true);
            setLoading(false);
            return;
        }

        fetchPosts(token)
            .then((rawData) => {
                const adapted = rawData.map((post) => ({
                    id: post.id,
                    title: post.titulo,
                    description: post.contenido,
                    image: "/assets/placeholder.png",
                }));
                setPosts(adapted);
                setLoading(false);
            })
            .catch(() => {
                setLoginMessage("Failed to load posts");
                setShowMessage(true);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            {showMessage ? (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded">
                    {loginMessage}
                </div>
            ) : (
                <>
                    <h1 className="text-4xl font-bold text-center mb-10">
                        Posts destacados
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white shadow rounded overflow-hidden">
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
                </>
            )}
        </div>
    );
}
