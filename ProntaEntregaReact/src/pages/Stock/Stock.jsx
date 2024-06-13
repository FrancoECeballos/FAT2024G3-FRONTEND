import React from 'react';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';

import './Stock.scss';

function Stock (){
    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar />
                <h1>Stock</h1>
            </div>
        </div>
    );
}

export default Stock;