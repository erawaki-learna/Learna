import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { D1Provider } from "./contexts/D1Context";
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <D1Provider>
        <App />
      </D1Provider>
    </AuthProvider>
  </StrictMode>,
);
