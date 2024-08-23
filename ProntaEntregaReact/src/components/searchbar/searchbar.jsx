import React from "react";
import { Dropdown } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const SearchBar = ({ onSearchChange, onOrderChange, filters = [] }) => {
    const [selectedItem, setSelectedItem] = React.useState(null);

    const handleFilterChange = (filterType, filterLabel) => {
        console.log("Selected Filter: ", filterType, filterLabel);
        setSelectedItem(filterLabel);
        onOrderChange(filterType);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input 
                type="text" 
                name="search" 
                placeholder="Buscar..."
                style={{ height:"2.5rem", border: '0px', borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', width: '75%', marginRight: '0.8rem', padding: '0.5rem 1rem' }} 
                onChange={(e) => {
                    console.log("Search Query: ", e.target.value);
                    onSearchChange(e.target.value);
                }} 
            />
            <Dropdown>
                <Dropdown.Toggle 
                    id="dropdown-basic"
                    style={{ height:"2.5rem", border: '0px', color: 'black', borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', width: '100%', textAlign: 'center' }}>
                    {selectedItem || "Ordenar Por"}
                    <Icon icon="material-symbols:arrow-drop-down" style={{width:"1.5rem", height:"1.5rem"}}/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {filters.map(filter => (
                        <div>
                            <Dropdown.Item key={filter.type} onClick={() => { handleFilterChange(filter.type, filter.label); }}>
                                {filter.label}
                            </Dropdown.Item>
                            <div style={{border:"1px solid #D9D9D9"}}></div>
                        </div>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default SearchBar;
                       
