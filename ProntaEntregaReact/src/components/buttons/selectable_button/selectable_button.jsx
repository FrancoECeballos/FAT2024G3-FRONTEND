import React from "react";
import "./selectable_button.scss";
import { useNavigate } from 'react-router-dom';

const SelectableButton = ({ texto, link, selected, locationStore }) => {
  const navigate = useNavigate();
  
  const handleClick = (event) => {
    event.preventDefault();
    if (locationStore) {
      navigate(link, { state: locationStore });
    } else {
      navigate(link);
    }
  };

  return (
    <div className="SelectableButton">
      <a href={link} onClick={handleClick}>
        {selected ? <strong>{texto}</strong> : texto}
      </a>
    </div>
  );
};

export default SelectableButton;