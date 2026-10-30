import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  // Accede al estado de autenticación desde el contexto
  const { isAuthenticated } = useContext(AuthContext);

  // Si el usuario no está autenticado,
  // redirige a la página de inicio de sesión
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
