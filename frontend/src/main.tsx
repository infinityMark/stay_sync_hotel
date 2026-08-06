import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import NavBarInit from './layouts/ClientLayout';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NavBarInit />
    </StrictMode>
);
