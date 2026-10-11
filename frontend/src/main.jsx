import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><App/><Toaster theme="dark" position="bottom-right"/></AuthProvider></BrowserRouter></React.StrictMode>);
