import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

export default function Reportes() {
  const [ventasMes, setVentasMes] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    try {
      setLoading(true);
      const [ventas, productos, clientes, stock] = await Promise.all([
        api.get('/reportes/ventas/por-mes'),
        api.get('/reportes/productos/top-vendidos'),
        api.get('/reportes/clientes/top-compradores'),
        api.get('/reportes/inventario/bajo-stock')
      ]);
      setVentasMes(ventas.data);
      setTopProductos(productos.data);
      setTopClientes(clientes.data);
      setBajoStock(stock.data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      alert('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Reportes y Análisis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Mes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Ventas por Mes</h2>
          <div className="space-y-4">
            {ventasMes.slice(0, 6).map((item: any, idx) => (
              <div key={idx} className="border-b pb-3">
                <p className="font-medium">{new Date(item.mes).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}</p>
                <p className="text-gray-600">Facturas: {item.total_facturas}</p>
                <p className="text-lg font-bold text-green-600">${parseFloat(item.total_vendido).toLocaleString('es-CO')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Productos Top Vendidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Top Productos Vendidos</h2>
          <div className="space-y-4">
            {topProductos.slice(0, 5).map((item: any, idx) => (
              <div key={idx} className="border-b pb-3">
                <p className="font-medium">{item.nombre}</p>
                <p className="text-gray-600">SKU: {item.sku}</p>
                <div className="flex justify-between">
                  <p>Vendidas: <span className="font-bold">{item.cantidad_vendida}</span></p>
                  <p className="text-green-600 font-bold">${parseFloat(item.total_vendido).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Top Clientes</h2>
          <div className="space-y-4">
            {topClientes.slice(0, 5).map((item: any, idx) => (
              <div key={idx} className="border-b pb-3">
                <p className="font-medium">{item.nombre}</p>
                <p className="text-gray-600">{item.email}</p>
                <div className="flex justify-between">
                  <p>Facturas: <span className="font-bold">{item.total_facturas}</span></p>
                  <p className="text-green-600 font-bold">${parseFloat(item.total_gastado).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventario Bajo Stock */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">⚠️ Productos con Bajo Stock</h2>
          <div className="space-y-4">
            {bajoStock.length === 0 ? (
              <p className="text-green-600">✅ Todos los productos tienen stock disponible</p>
            ) : (
              bajoStock.map((item: any, idx) => (
                <div key={idx} className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-gray-600">SKU: {item.sku}</p>
                  <div className="flex justify-between">
                    <p>Stock: <span className="font-bold text-red-600">{item.cantidad}</span></p>
                    <p className="text-gray-600">${item.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
