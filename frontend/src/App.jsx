import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {/* Redirecciones automáticas si el usuario ya inició sesión */}
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />

      {/* Ruta protegida: Si no hay token en el contexto, lo expulsa al login */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
