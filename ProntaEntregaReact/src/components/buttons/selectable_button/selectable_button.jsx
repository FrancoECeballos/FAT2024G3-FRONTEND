import React from "react";
import "./selectable_button.scss";

const SelectableButton = ({ texto, link }) => {
  return (
    <div className="SelectableButton">
      <a href={link}>{texto}</a>
    </div>
  );
};

export default SelectableButton;
