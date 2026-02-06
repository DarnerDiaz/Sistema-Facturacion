import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function CrearFactura() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientesRes, productosRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/productos')
      ]);
      setClientes(clientesRes.data);
      setProductos(productosRes.data);
    } catch (error) {
      alert('Error al cargar datos');
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { productoId: '', nombre: '', cantidad: 1, precio: 0, total: 0 }
    ]);
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'productoId') {
      const producto = productos.find(p => p.id === value);
      newItems[idx] = {
        productoId: value,
        nombre: producto?.nombre,
        cantidad: newItems[idx].cantidad,
        precio: producto?.precio || 0,
        total: (newItems[idx].cantidad * (producto?.precio || 0))
      };
    } else if (field === 'cantidad') {
      newItems[idx].cantidad = parseInt(value) || 0;
      newItems[idx].total = newItems[idx].cantidad * newItems[idx].precio;
    }
    setItems(newItems);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCliente) {
      alert('Selecciona un cliente');
      return;
    }
    
    if (items.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    try {
      setLoading(true);
      await api.post('/facturas', {
        clienteId: selectedCliente,
        items: items.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        notas
      });
      alert('Factura creada exitosamente');
      router.push('/facturas');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear factura');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, iva, total } = calcularTotales();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Crear Nueva Factura</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleccionar Cliente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Cliente</h2>
          <select
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente: any) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} ({cliente.email})
              </option>
            ))}
          </select>
        </div>

        {/* Items de la Factura */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Productos</h2>
          
          {items.length === 0 ? (
            <p className="text-gray-600 mb-4">No hay productos agregados</p>
          ) : (
            <div className="space-y-4 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-end border-b pb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Producto</label>
                    <select
                      value={item.productoId}
                      onChange={(e) => updateItem(idx, 'productoId', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Selecciona</option>
                      {productos.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} (${p.precio.toFixed(2)}) - Stock: {p.cantidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="block text-sm font-medium mb-2">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => updateItem(idx, 'cantidad', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium mb-2">Precio</label>
                    <input type="text" value={`$${item.precio.toFixed(2)}`} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
                  </div>
                  <div className="w-28">
                    <label className="block text-sm font-medium mb-2">Total</label>
                    <input type="text" value={`$${item.total.toFixed(2)}`} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Agregar Producto
          </button>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-lg font-bold mb-4">Notas (Opcional)</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows={3}
            placeholder="Notas adicionales para la factura..."
          />
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          <div className="space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>IVA 19%:</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>TOTAL:</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Creando factura...' : 'Crear Factura'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-400 text-white py-3 rounded font-bold hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
