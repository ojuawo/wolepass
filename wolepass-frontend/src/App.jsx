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
import Noticeboard from './pages/Noticeboard/Noticeboard';
import Tickets from './pages/Tickets/Tickets';
import Register from './pages/Register/Register';
import Terms from './pages/Legal/Terms';
import Privacy from './pages/Legal/Privacy';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing / Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* Standalone Public Routes (no nav shell) */}
          <Route path="/login" element={<Login />} />
          <Route path="/gate" element={<GateTerminal />} />

          {/* Protected Routes utilizing SaaS Shell Layout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/noticeboard" element={<Noticeboard />} />
            <Route path="/tickets" element={<Tickets />} />
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
