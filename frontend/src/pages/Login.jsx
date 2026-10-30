import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Login = () => {
  const [credenciales, setCredenciales] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credenciales)
      });

      login(data.token);
      toast.success('¡Bienvenido al sistema!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inventario Inteligente</h2>
        <input
          type="text"
          placeholder="Usuario"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredenciales({...credenciales, username: e.target.value})}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredenciales({...credenciales, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
          Ingresar
        </button>
      </form>
    </div>
  );
};
