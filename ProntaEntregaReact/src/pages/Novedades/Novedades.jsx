import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        fetchData('/producto/1/')
            .then(data => {
                setProducto(data);
                console.log(data);
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <FullNavbar />
            {producto && (
                <GenericCard
                    titulo={producto[0].nombre}
                    foto={`${producto[0].imagen}`} // Asumiendo que 'imagen' es el campo con la ruta de la imagen
                    descrip1={producto[0].descripcion} // Ajusta según los campos disponibles en tu producto
                    descrip2={producto[0].imagen}
                />
            )}
        </div>
    );
};

export default Novedades;
