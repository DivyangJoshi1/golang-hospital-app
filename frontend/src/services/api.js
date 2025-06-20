const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const apiRequest = async (path, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const fullURL = `${BASE_URL}/${cleanPath}`;

  const res = await fetch(fullURL, options);

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Unexpected response: ${res.statusText}`);
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};
