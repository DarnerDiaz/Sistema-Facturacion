import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    sku: '',
    categoria: ''
  });

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/productos', {
        ...formData,
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad)
      });
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        sku: '',
        categoria: ''
      });
      setShowForm(false);
      await loadProductos();
      alert('Producto creado');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        await loadProductos();
        alert('Producto eliminado');
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Nuevo Producto</h2>
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
                type="text"
                placeholder="SKU"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <textarea
                placeholder="Descripción"
                required
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 md:col-span-2"
              />
              <input
                type="number"
                placeholder="Precio"
                step="0.01"
                required
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="number"
                placeholder="Cantidad"
                required
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Categoría"
                required
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Guardar Producto
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-center">Cargando...</p>
        ) : productos.length === 0 ? (
          <p className="p-6 text-center text-gray-600">No hay productos registrados</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nombre</th>
                <th className="px-6 py-3 text-left font-medium">SKU</th>
                <th className="px-6 py-3 text-left font-medium">Categoría</th>
                <th className="px-6 py-3 text-left font-medium">Precio</th>
                <th className="px-6 py-3 text-left font-medium">Stock</th>
                <th className="px-6 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productos.map((producto: any) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{producto.nombre}</td>
                  <td className="px-6 py-4">{producto.sku}</td>
                  <td className="px-6 py-4">{producto.categoria}</td>
                  <td className="px-6 py-4">${producto.precio.toFixed(2)}</td>
                  <td className="px-6 py-4">{producto.cantidad}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(producto.id)}
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
