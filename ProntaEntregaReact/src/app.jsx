import React from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChangePassword from "./pages/password/ChangePassword.jsx";
import ForgotAccount from "./pages/password/ForgotAccount.jsx";

import MiCuenta from "./pages/Perfil/MiCuenta.jsx";
import Stock from "./pages/Stock/Stock.jsx";
import SeguridadYPrivacidad from "./pages/Perfil/SeguridadYPrivacidad.jsx";
import UserListing from "./pages/Perfil/UserListing.jsx";
import Categories from "./pages/Stock/Categories/Categories.jsx";
import Products from "./pages/Stock/Products/Products.jsx";
import Pedidos from "./pages/Pedidos/Pedidos.jsx";
import InformePedidos from "./pages/Informes/InformePedidos.jsx";
import Ofertas from "./pages/Ofertas/Ofertas.jsx";
import InformeOfertas from "./pages/Informes/InformeOfertas.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main.jsx";
import Obras from "./pages/Obras/Obras.jsx";
import ObrasAutos from "./pages/Autos/ObrasAutos.jsx";
import Autos from "./pages/Autos/Autos.jsx";
import Entregas from "./pages/Entregas/Entregas.jsx";
import Landing from "./pages/Landing/Landing.jsx";
import OneProduct from "./pages/Stock/OneProduct/OneProduct.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotAccount />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/perfil/micuenta" element={<MiCuenta />} />
        <Route path="/perfil/seguridad" element={<SeguridadYPrivacidad />} />
        <Route path="/userlisting" element={<UserListing />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/obra/:stockId/categoria" element={<Categories />} />
        <Route
          path="/obra/:stockId/categoria/:categoriaID"
          element={<Products />}
        />
        <Route
          path="/obra/:stockId/categoria/:categoriaID/producto/:productoId"
          element={<OneProduct />}
        />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/informe_pedidos" element={<InformePedidos />} />
        <Route path="/oferta" element={<Ofertas />} />
        <Route path="/informe_ofertas" element={<InformeOfertas />} />
        <Route path="/obras" element={<Obras />} />
        <Route path="/entregas" element={<Entregas />} />
        <Route path="/vehiculos" element={<ObrasAutos />} />
        <Route path="/vehiculos/:obraId" element={<Autos />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
