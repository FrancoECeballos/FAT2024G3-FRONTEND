import React from 'react';
import './cuenta.scss';

const Cuenta = () => {
    return (
    <div className='micuenta'>
      <h1>Pedrito Me Electrocutaste</h1>
      <form>
        <div>
          <label htmlFor="nombre">Nombre:</label>
        </div>
        <div>
          <label htmlFor="apellido">Apellido:</label>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
        </div>
        <div>
          <label htmlFor="telefono">Telefono:</label>
        </div>
        <div>
          <label htmlFor="direccion">Direccion:</label>
        </div>
        <div>
          <label htmlFor="genero">Genero:</label>
        </div>
        <button type="submit">Editar</button>
      </form>
    </div>
    );
};

export default Cuenta;
