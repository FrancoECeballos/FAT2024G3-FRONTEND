import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericTable from '../../components/tables/generic_table/generic_table.jsx';
import Cookies from 'js-cookie';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
    const [unidadMedida, setUnidadMedida] = useState([]);
    const token = Cookies.get('token');
    const headers = ["id", "nombre", "descripcion", "identificador"];

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`unidad_medida/`, token).then((result) => {
            setUnidadMedida(result);
        });
    });

    return (
        <div>
            <FullNavbar/>
            <GenericTable headers={headers} data={unidadMedida}
            />
        </div>
    );
};

export default Novedades;
