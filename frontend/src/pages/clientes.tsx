import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cedula: '',
    direccion: '',
    ciudad: ''
  });
  const router = useRouter();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      alert('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clientes', formData);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        cedula: '',
        direccion: '',
        ciudad: ''
      });
      setShowForm(false);
      await loadClientes();
      alert('Cliente creado');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear cliente');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        await loadClientes();
        alert('Cliente eliminado');
      } catch (error) {
        alert('Error al eliminar cliente');
      }
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Cliente'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Nuevo Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Cédula"
                required
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Dirección"
                required
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 md:col-span-2"
              />
              <input
                type="text"
                placeholder="Ciudad"
                required
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-center">Cargando...</p>
        ) : clientes.length === 0 ? (
          <p className="p-6 text-center text-gray-600">No hay clientes registrados</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nombre</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Teléfono</th>
                <th className="px-6 py-3 text-left font-medium">Cédula</th>
                <th className="px-6 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clientes.map((cliente: any) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cliente.nombre}</td>
                  <td className="px-6 py-4">{cliente.email}</td>
                  <td className="px-6 py-4">{cliente.telefono}</td>
                  <td className="px-6 py-4">{cliente.cedula}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Eliminar
                    </button>
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
