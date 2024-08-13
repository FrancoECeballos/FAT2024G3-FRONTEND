import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';
import SelectButton from '../../components/buttons/selectable_button/select_button.jsx';
import Cookies from 'js-cookie';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
    const [unidadMedida, setUnidadMedida] = useState([]);
    const token = Cookies.get('token');
    const headers = ["id", "nombre", "descripcion", "identificador"];
    const lists = [
        {
          title: "Peso",
          items: [{ text: "Kilogramos" }, { text: "Gramos" }]
        },
        {
          title: "Paquetes",
          items: [{ text: "Paquete de 10 kg" }, { text: "Paquete de 100 kg" }]
        }
      ];

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
            <FullNavbar selectedPage='Novedades'/>
            <UploadImage/>
            <SelectButton lists={lists}/>
        </div>
    );
};

export default Novedades;
