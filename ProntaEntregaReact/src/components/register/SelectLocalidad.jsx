import React from "react";
import { Form } from "react-bootstrap";
import AutoCompleteSelect from "../selects/auto_complete_select/auto_complete_select"

const SelectLocalidad = (style, name, type, onBlur, onChange, placeholder) => {
    const Localidades = [
        {key:"1", label:"Achiras, Rio Cuarto"}, 
        {key:"2", label:"Adelia María, Rio Cuarto"}]
    
    return(
        <AutoCompleteSelect lists={Localidades}>
            
        </AutoCompleteSelect>
    );
} 
export default SelectLocalidad;