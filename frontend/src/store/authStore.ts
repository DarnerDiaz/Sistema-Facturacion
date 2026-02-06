import { create } from 'zustand';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
}

interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  setLogin: (usuario: Usuario, token: string) => void;
  setLogout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,
  isAuthenticated: false,
  
  setLogin: (usuario, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
    set({ usuario, token, isAuthenticated: true });
  },
  
  setLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    set({ usuario: null, token: null, isAuthenticated: false });
  },
  
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');
        if (token && usuario) {
          set({
            token,
            usuario: JSON.parse(usuario),
            isAuthenticated: true
          });
        }
      } catch (error) {
        console.error('Error cargando auth del storage:', error);
        set({ usuario: null, token: null, isAuthenticated: false });
      }
    }
  }
}));
