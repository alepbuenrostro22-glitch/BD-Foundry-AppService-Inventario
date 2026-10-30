const BASE_URL = "http://localhost:3000/api"; // Asegúrate de que este sea el puerto de tu backend

export const fetchAPI = async (endpoint, options = {}) => {
  // 1. Va a la bóveda del navegador por el token que guardó el Login
  const token = localStorage.getItem("token_inventario");

  const headers = {
    "Content-Type": "application/json",
    // 2. Si lo encuentra, lo pega automáticamente
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. Extractor inteligente de errores
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token_inventario");
    }

    let errorMessage = "Error en la API";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = await response.text();
    }

    throw new Error(errorMessage);
  }

  return response.json();
};
