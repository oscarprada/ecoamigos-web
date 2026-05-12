import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 9999,
          backgroundColor: toast.type === 'error' ? '#c53d3d' : '#2cab87',
          color: '#ffffff',
          padding: '14px 18px',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
          fontWeight: 700,
          maxWidth: '360px',
        }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
