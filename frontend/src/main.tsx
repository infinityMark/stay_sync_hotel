import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/client/home';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Home />
    </StrictMode>
);
