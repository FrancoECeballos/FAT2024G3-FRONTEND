import React from 'react';
import { useState, useEffect } from 'react'
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import PedidoCard from '../../components/cards/pedido_card/PedidoCard.jsx';

function Form (){
  return (
    <div style={{backgroundColor: '#ECECEC'}}>
      <FullNavbar selectedPage='Pedidos'/>
      <PedidoCard />
    </div>
  );
};
export default Form;