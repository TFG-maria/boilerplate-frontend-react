// src/api.js

const USERS_API_URL = import.meta.env.VITE_USER_API_URL; // e.g. http://localhost:4000
const POSTS_API_URL = import.meta.env.VITE_POST_API_URL; // e.g. http://localhost:8080

export const login = async (email, password) => {
  const res = await fetch(`${USERS_API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pass: password })
  });

  if (!res.ok) {
    // Lanza error para que el frontend lo capture
    throw new Error(`Login failed (${res.status})`);
  }
  // Se espera un JSON: { user: "...", token: "..." }
  return res.json();
};

export const fetchPosts = async () => {
  const res = await fetch(`${POSTS_API_URL}/posts`);
  if (!res.ok) {
    throw new Error(`Fetch posts failed (${res.status})`);
  }
  return res.json();
};
