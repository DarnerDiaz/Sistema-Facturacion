import Head from 'next/head';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>Sistema de Facturación</title>
        <meta name="description" content="Sistema moderno de facturación" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-2xl font-bold text-indigo-600">💼 InvoiceApp</div>
              <div className="space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900">Iniciar Sesión</Link>
                <Link href="/registro" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Registrarse</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Sistema de Facturación Moderno
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gestiona tus clientes, productos y facturas de forma sencilla y eficiente
            </p>

            <div className="grid md:grid-cols-3 gap-8 my-16">
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Facturas Profesionales</h3>
                <p className="text-gray-600">Crea y descarga facturas en PDF con todos los detalles</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Gestión de Clientes</h3>
                <p className="text-gray-600">Administra toda la información de tus clientes</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2">Reportes Detallados</h3>
                <p className="text-gray-600">Visualiza tus ventas y análisis de negocio</p>
              </div>
            </div>

            <Link href="/registro" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700">
              Comenzar Ahora
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
