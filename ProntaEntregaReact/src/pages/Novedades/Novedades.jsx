import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

function Novedades() {
    return (
        <div>
            <FullNavbar />
            <p>No hay novedades.</p>
        </div>
    );
}

export default Novedades;