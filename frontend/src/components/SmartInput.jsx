import { useState } from 'react';
import { fetchAPI } from '../services/api';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const SmartInput = ({ onRecargar }) => {
  const [texto, setTexto] = useState('');
  const [procesando, setProcesando] = useState(false);
  // Eliminamos el estado de 'feedback' y la importación de AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      setProcesando(true);

      // Llamada limpia: ya no necesitamos pasar el token manualmente, api.js lo hace
      const respuesta = await fetchAPI('/inventario/procesar', {
        method: 'POST',
        body: JSON.stringify({ texto })
      });

      // Alerta de Éxito: Desaparece sola en 3 segundos
      Swal.fire({
        title: '¡Operación Exitosa!',
        text: respuesta.mensaje,
        icon: 'success',
        timer: 3000, // 3 segundos
        timerProgressBar: true,
        showConfirmButton: false
      });
      toast.success(respuesta.mensaje, { id: toastId });
      setTexto('');
      onRecargar(); // Refresca la tabla automáticamente

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="mb-6 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center bg-white shadow-sm rounded-xl p-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition">
        <Sparkles className="w-6 h-6 text-blue-500 ml-3 mr-2 shrink-0" />
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: Cambia la cantidad del Logitech a 50..."
          className="flex-1 p-3 outline-none text-gray-700 bg-transparent min-w-0"
          disabled={procesando}
        />
        <button
          type="submit"
          disabled={procesando}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center transition disabled:bg-blue-400 shrink-0"
        >
          {procesando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span className="ml-2 hidden sm:inline font-medium">Procesar</span>
        </button>
      </form>
    </div>
  );
};
