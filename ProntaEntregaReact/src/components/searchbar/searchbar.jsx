import React from "react";
import { Dropdown } from 'react-bootstrap';

const SearchBar = ({ onSearchChange, onOrderChange }) => {
    const [selectedItem, setSelectedItem] = React.useState(null);
    return (
        <div style={{display:'flex', justifyContent: 'center'}}>
            <input type="text" name="search" style={{border:'0px',borderRadius: '10rem', backgroundColor: '#E7E7E7', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', width: '80%', marginRight: '2rem'}} onChange={(e) => onSearchChange(e.target.value)}>
            </input>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" style={{border:'0px',color: 'black' ,borderRadius: '10rem', backgroundColor: '#E7E7E7', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}}>
                    {selectedItem || "Ordenar Por"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {setSelectedItem("Nombre Alfabético"); onOrderChange('nombre');}}>Nombre Alfabético</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSelectedItem("Apellido Alfabético"); onOrderChange('apellido');}}>Apellido Alfabético</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSelectedItem("Email Alfabético"); onOrderChange('email');}}>Email Alfabético</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSelectedItem("Rango"); onOrderChange('id_tipousuario');}}>Rango</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSelectedItem("DNI"); onOrderChange('documento');}}>DNI</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSelectedItem("Teléfono"); onOrderChange('telefono');}}>Teléfono</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSelectedItem("Tipo de DNI"); onOrderChange('id_tipodocumento');}}>Tipo de DNI</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default SearchBar;