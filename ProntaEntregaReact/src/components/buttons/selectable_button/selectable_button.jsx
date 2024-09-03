import React from "react";
import "./selectable_button.scss";

const SelectableButton = ({ texto, link, selected }) => {
  return (
    <div className="SelectableButton">
      <a href={link}>
        {selected ? <strong>{texto}</strong> : texto}
      </a>
    </div>
  );
};

export default SelectableButton;