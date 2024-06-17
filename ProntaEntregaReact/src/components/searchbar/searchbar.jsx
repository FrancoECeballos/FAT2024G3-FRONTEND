import React from "react";
import { Dropdown } from 'react-bootstrap';

function SearchBar() {
    return (
        <div style={{display:'flex', justifyContent: 'center'}}>
        <input type="text" name="search" style={{border:'0px',borderRadius: '10rem', backgroundColor: '#E7E7E7', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', width: '80%', marginRight: '2rem'}}>
        </input>
        <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" style={{border:'0px',color: 'black' ,borderRadius: '10rem', backgroundColor: '#E7E7E7', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}}>
                Ordenar Por
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
    );
}

export default SearchBar;