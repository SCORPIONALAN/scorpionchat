import { create } from 'zustand';

// Función para detectar el tema del sistema
const getSystemTheme = () =>
  window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';

export const useThemeStore = create((set) => ({
    // Primer buscamos si hay temas en el local Storage, en caso de que no nos vamos a preferencias del navegador y si tampoco, entonces sera blanco por defecto
  theme: localStorage.getItem('chat-theme') || getSystemTheme() || 'light', // Se inicializa con el tema del sistema
  setTheme: (newTheme) => {
    localStorage.setItem('chat-theme', newTheme);
    set({theme: newTheme});
  },
}));
