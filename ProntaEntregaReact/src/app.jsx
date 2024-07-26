import React from 'react'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import MiCuenta from './pages/Perfil/MiCuenta.jsx';
import Stock from './pages/Stock/Stock.jsx';
import SeguridadYPrivacidad from './pages/Perfil/SeguridadYPrivacidad.jsx';
import UserListing from './pages/Perfil/UserListing.jsx';
import Categories from './pages/Stock/Categories/Categories.jsx';
import Products from './pages/Stock/Products/Products.jsx';
import Pedidos from './pages/Pedidos/Pedidos.jsx';
import Ofertas from './pages/Ofertas/Ofertas.jsx';

import CrearPedido from './pages/Pedidos/CrearPedido.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

//importacion de los renders
import Main from './pages/Main/Main.jsx'
import DatosPersonales from './pages/Perfil/DatosPersonales.jsx';
import Casas from './pages/Casas/Casas.jsx';
import Novedades from './pages/Novedades/Novedades.jsx';
import Autos from './pages/Autos/Autos.jsx';

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
        <Route path="/perfil/datos_personales" element={<DatosPersonales />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/casa/:stockId/categoria" element={<Categories />} />
        <Route path="/casa/:stockId/categoria/:categoriaID" element={<Products />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/oferta" element={<Ofertas />} />
        <Route path="/casas" element={<Casas />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/autos" element={<Autos />} />
        <Route path="/crear_pedido" element={<CrearPedido />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
