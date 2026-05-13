import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GateTerminal from './pages/GateTerminal/GateTerminal';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './components/Layout/MainLayout';
import PublicLayout from './components/Layout/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import GeneratePass from './pages/GeneratePass/GeneratePass';
import Landing from './pages/Landing/Landing';
import Register from './pages/Register/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing / Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Standalone Public Routes (no nav shell) */}
          <Route path="/login" element={<Login />} />
          <Route path="/gate" element={<GateTerminal />} />

          {/* Protected Routes utilizing SaaS Shell Layout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/generate" element={<GeneratePass />} />
          </Route>

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
