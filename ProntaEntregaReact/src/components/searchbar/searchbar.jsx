import React from "react";
import { Dropdown } from 'react-bootstrap';

function SearchBar() {
    return (
        <div style={{display:'flex', marginLeft: '3rem'}}>
        <input type="text" placeholder="Search.." name="search" style={{width: '60rem', marginRight: '2rem'}}/>
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
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