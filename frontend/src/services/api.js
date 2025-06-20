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

  // ✅ Ensure path starts with a single slash
  const finalPath = path.startsWith("/") ? path : `/${path}`;

  // ✅ Build full, clean URL
  const fullURL = `${BASE_URL}${finalPath}`;

  const res = await fetch(fullURL, options);

  // ✅ Handle non-JSON errors gracefully
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
