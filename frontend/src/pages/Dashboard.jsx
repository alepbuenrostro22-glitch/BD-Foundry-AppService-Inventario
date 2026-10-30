import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchAPI } from '../services/api';
import { SmartInput } from '../components/SmartInput';

// 1. Le quitamos la palabra "export" a esta línea
const Dashboard = () => {
  // 2. Ya no necesitamos extraer el token aquí, api.js lo maneja solo
  const { logout } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarInventario = async () => {
    try {
      setCargando(true);
      // 3. Llamada ultra limpia: api.js inyecta el token automáticamente
      const data = await fetchAPI('/inventario');
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto mb-6 bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventario Inteligente</h1>
        <button
          onClick={logout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Componente de Inserción con IA */}
      <SmartInput onRecargar={cargarInventario} />

      {/* Tabla de Datos */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-500">Cargando datos desde Azure...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Producto</th>
                <th className="p-4 font-medium">Marca</th>
                <th className="p-4 font-medium">Cantidad</th>
                <th className="p-4 font-medium">Precio Unit.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    El inventario está vacío.
                  </td>
                </tr>
              ) : (
                productos.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-sm">{item.sku}</td>
                    <td className="p-4">{item.producto}</td>
                    <td className="p-4">{item.marca}</td>
                    <td className="p-4 font-semibold">{item.cantidad}</td>
                    <td className="p-4">${Number(item.precio_unitario).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 4. Exportación por defecto
export default Dashboard;
