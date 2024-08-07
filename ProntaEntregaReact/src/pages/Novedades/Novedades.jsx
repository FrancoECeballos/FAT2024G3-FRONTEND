import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericTable from '../../components/tables/generic_table/generic_table.jsx';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
    return (
        <div>
            <FullNavbar/>
            <GenericTable
            />
        </div>
    );
};

export default Novedades;
