import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

export default function Dashboard() {
  const { isAuthenticated, usuario } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProductos: 0,
    totalFacturas: 0,
    totalVentas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    if (!useAuthStore.getState().isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const [clientes, productos, facturas] = await Promise.all([
        api.get('/clientes'),
        api.get('/productos'),
        api.get('/facturas')
      ]);

      const totalVentas = facturas.data.reduce((sum: number, f: any) => sum + f.total, 0);

      setStats({
        totalClientes: clientes.data.length,
        totalProductos: productos.data.length,
        totalFacturas: facturas.data.length,
        totalVentas
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido, {usuario?.nombre}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" title="Clientes" value={stats.totalClientes} />
        <StatCard icon="📦" title="Productos" value={stats.totalProductos} />
        <StatCard icon="📄" title="Facturas" value={stats.totalFacturas} />
        <StatCard icon="💰" title="Total Vendido" value={`$${stats.totalVentas.toLocaleString('es-CO')}`} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAccessCard href="/clientes" icon="👥" title="Gestionar Clientes" />
          <QuickAccessCard href="/productos" icon="📦" title="Gestionar Productos" />
          <QuickAccessCard href="/facturas" icon="📄" title="Ver Facturas" />
          <QuickAccessCard href="/facturas/crear" icon="✨" title="Crear Factura" />
          <QuickAccessCard href="/reportes" icon="📊" title="Ver Reportes" />
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, title, value }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickAccessCard({ href, icon, title }: any) {
  return (
    <a href={href} className="block bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-6 hover:shadow-lg transition">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="font-medium text-gray-900">{title}</p>
    </a>
  );
}
