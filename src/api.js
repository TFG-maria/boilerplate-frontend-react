const USERS_API_URL = import.meta.env.VITE_USER_API_URL;
const POSTS_API_URL = import.meta.env.VITE_POST_API_URL;

export const login = async (email, password) => {
  const res = await fetch(`${USERS_API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pass: password })
  });

  if (!res.ok) {
    throw new Error(`Login failed (${res.status})`);
  }

  return res.json();
};

export const fetchPosts = async (token) => {
  const res = await fetch(`${POSTS_API_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch posts failed (${res.status})`);
  }
  return res.json();
};
