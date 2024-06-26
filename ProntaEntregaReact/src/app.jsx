import React from 'react'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import MiCuenta from './pages/Perfil/MiCuenta.jsx';
import Stock from './pages/Stock/Stock.jsx';
import SeguridadYPrivacidad from './pages/Perfil/SeguridadYPrivacidad.jsx';
import UserListing from './pages/Perfil/UserListing.jsx';
import Categories from './pages/Stock/Categories/Categories.jsx';
import Pedidos from './pages/Pedidos/Pedidos.jsx';
import Ofertas from './pages/Ofertas/Ofertas.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

//importacion de los renders
import Main from './pages/Main/Main.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/perfil/micuenta" element={<MiCuenta />} />
        <Route path="/perfil/seguridad" element={<SeguridadYPrivacidad />} />
        <Route path="/selectuser" element={<UserListing />}/>
        <Route path="/stock" element={<Stock />} />
        <Route path="/casa/:casaId/categoria/:categoriaId" element={<Categories />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/oferta" element={<Ofertas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
