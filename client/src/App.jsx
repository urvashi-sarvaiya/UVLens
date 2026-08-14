import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { Navbar } from './components/Navbar';
import { UploadPage } from './pages/UploadPage';
import { History } from './pages/History';
import { BillDetail } from './pages/BillDetail';
import { Dashboard } from './pages/Dashboard';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <div className="app-viewport">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/history" element={<History />} />
              <Route path="/bill/:id" element={<BillDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
