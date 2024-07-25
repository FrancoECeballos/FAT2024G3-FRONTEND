import React from 'react';
import { useState, useEffect } from 'react'
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import CrearPedido from '../../components/forms/pedido_form/PedidoForm.jsx';

function Form (){
  return (
    <div style={{backgroundColor: '#ECECEC'}}>
      <FullNavbar/>
      <CrearPedido />
    </div>
  );
};
export default Form;