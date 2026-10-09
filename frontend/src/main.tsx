import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Home from './pages/client/home';
import Login from './pages/client/login';
import Register from './pages/client/register';
import VerifyEmailPage from './pages/client/forget-password';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
