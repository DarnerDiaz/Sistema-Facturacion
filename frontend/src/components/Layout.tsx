import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, usuario, setLogout, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar datos del storage al montar el componente
  useEffect(() => {
    loadFromStorage();
    setIsHydrated(true);
  }, [loadFromStorage]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (isHydrated && !isAuthenticated && router.isReady) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router.isReady, router]);

  const handleLogout = () => {
    setLogout();
    router.push('/login');
  };

  // Evitar renderizar mientras se hidrata
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/clientes', label: 'Clientes', icon: '👥' },
    { href: '/productos', label: 'Productos', icon: '📦' },
    { href: '/facturas', label: 'Facturas', icon: '📄' },
    { href: '/reportes', label: 'Reportes', icon: '📈' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold">💼 InvoiceApp</h1>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded transition ${
                router.pathname === item.href
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <p className="text-sm text-indigo-200 mb-4">Conectado como:</p>
          <p className="font-medium mb-4">{usuario?.nombre}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow sticky top-0 z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600"
            >
              ☰
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {getPageTitle(router.pathname)}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{usuario?.nombre}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Salir
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="w-64 bg-indigo-900 text-white h-full p-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mb-6 text-2xl"
            >
              ✕
            </button>
            <nav className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-indigo-800"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

// Función helper para obtener el título de la página
function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/clientes': 'Clientes',
    '/productos': 'Productos',
    '/facturas': 'Facturas',
    '/facturas/crear': 'Crear Factura',
    '/reportes': 'Reportes'
  };

  return titles[pathname] || pathname.split('/')[1]?.toUpperCase() || 'DASHBOARD';
}
