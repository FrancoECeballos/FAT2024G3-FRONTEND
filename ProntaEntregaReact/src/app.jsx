import React from 'react'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import MiCuenta from './pages/MiCuenta.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//importacion de los renders
import Main from './pages/Main'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/perfil/micuenta" element={<MiCuenta />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App