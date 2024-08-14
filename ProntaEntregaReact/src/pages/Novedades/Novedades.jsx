import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';
import SelectButton from '../../components/buttons/selectable_button/select_button.jsx';
import AutoCompleteSelect from '../../components/buttons/selectable_button/auto_complete_select.jsx';
import Cookies from 'js-cookie';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
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

      const exampleLists = [
        { key: "apple", label: "Apple" },
        { key: "banana", label: "Banana" },
        { key: "cherry", label: "Cherry" },
        { key: "carrot", label: "Carrot" },
        { key: "broccoli", label: "Broccoli" },
        { key: "spinach", label: "Spinach" },
      ];

      const [selectedKey, setSelectedKey] = useState(null);

      const handleSelect = (key) => {
        setSelectedKey(key);
      };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    });

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <UploadImage/>
            <SelectButton lists={lists}/>
            <AutoCompleteSelect
                lists={exampleLists}
                selectedKey={selectedKey}
                onClick={handleSelect}
            />
        </div>
    );
};

export default Novedades;
