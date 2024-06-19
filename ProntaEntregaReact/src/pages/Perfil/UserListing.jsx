import React from 'react';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/GenericCard.jsx';


function UserListing (){
    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar />
                <GenericCard titulo="Titulo" descrip1="des 1" descrip2="des 2"/>
            </div>
        </div>
    );
}

export default UserListing;