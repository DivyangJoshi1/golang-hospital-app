// src/services/api.js
const API_BASE = "http://localhost:8080/api";

export const apiRequest = async (path, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
  };

  if (body) options.body = JSON.stringify(body);

  // ✅ Only add trailing slash for non-ID endpoints
  let finalPath = path;
  const isNumericId = /\/\d+$/.test(path); // checks if path ends with /number

  if (!path.endsWith("/") && !isNumericId) {
    finalPath += "/";
  }

  const res = await fetch(`${API_BASE}${finalPath}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};
