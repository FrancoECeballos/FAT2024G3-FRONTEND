import React from "react";
import { Dropdown } from 'react-bootstrap';

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
                style={{ border: '0px', borderRadius: '10rem', backgroundColor: '#E7E7E7', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', width: '80%', marginRight: '2rem' }} 
                onChange={(e) => {
                    console.log("Search Query: ", e.target.value);
                    onSearchChange(e.target.value);
                }} 
            />
            <Dropdown>
                <Dropdown.Toggle 
                    id="dropdown-basic" 
                    style={{ border: '0px', color: 'black', borderRadius: '10rem', backgroundColor: '#E7E7E7', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
                    {selectedItem || "Ordenar Por"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {filters.map(filter => (
                        <Dropdown.Item key={filter.type} onClick={() => { handleFilterChange(filter.type, filter.label); }}>
                            {filter.label}
                        </Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    };
    
    export default SearchBar;
                       
