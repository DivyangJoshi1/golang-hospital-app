// src/services/api.js

// ✅ Ensure no trailing slash in BASE_URL
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const apiRequest = async (path, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  // ✅ Only add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // ✅ Normalize path: remove leading/trailing slashes to avoid accidental //
  const cleanPath = path.replace(/^\/+|\/+$/g, "");

  // ✅ Final URL
  const fullURL = `${BASE_URL}/${cleanPath}`;

  const res = await fetch(fullURL, options);

  // ✅ Graceful fallback for non-JSON error responses
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Unexpected response: ${res.statusText}`);
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};
