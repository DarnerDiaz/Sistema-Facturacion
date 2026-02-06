import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/facturas');
      setFacturas(response.data);
    } catch (error) {
      console.error('Error cargando facturas:', error);
      alert('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (id: string) => {
    try {
      const response = await api.get(`/facturas/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Error al descargar PDF');
    }
  };

  const cambiarEstado = async (id: string, estado: string) => {
    try {
      await api.patch(`/facturas/${id}/estado`, { estado });
      await loadFacturas();
      alert('Estado actualizado');
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Facturas</h1>
        <Link href="/facturas/crear" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          + Nueva Factura
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-center">Cargando...</p>
        ) : facturas.length === 0 ? (
          <p className="p-6 text-center text-gray-600">No hay facturas registradas</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Número</th>
                <th className="px-6 py-3 text-left font-medium">Cliente</th>
                <th className="px-6 py-3 text-left font-medium">Total</th>
                <th className="px-6 py-3 text-left font-medium">Estado</th>
                <th className="px-6 py-3 text-left font-medium">Fecha</th>
                <th className="px-6 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {facturas.map((factura: any) => (
                <tr key={factura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{factura.numero}</td>
                  <td className="px-6 py-4">{factura.cliente_nombre}</td>
                  <td className="px-6 py-4">${factura.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      factura.estado === 'PAGADA' ? 'bg-green-100 text-green-700' :
                      factura.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {factura.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(factura.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => descargarPDF(factura.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      PDF
                    </button>
                    <select
                      value={factura.estado}
                      onChange={(e) => cambiarEstado(factura.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="PAGADA">Pagada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
