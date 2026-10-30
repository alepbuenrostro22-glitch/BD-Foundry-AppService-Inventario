import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Se ejecuta automáticamente al abrir o recargar la página (F5)
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token_inventario');
    if (tokenGuardado) {
      setToken(tokenGuardado); // Restaura la sesión desde la memoria del navegador
    }
    setCargando(false);
  }, []);

  // Función que llama el Login.jsx
  const login = (nuevoToken) => {
    localStorage.setItem('token_inventario', nuevoToken); // Guarda permanentemente
    setToken(nuevoToken); // Actualiza el estado de React
  };

  // Función para tu botón de "Cerrar Sesión" en el Dashboard
  const logout = () => {
    localStorage.removeItem('token_inventario'); // Borra la memoria
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
};
