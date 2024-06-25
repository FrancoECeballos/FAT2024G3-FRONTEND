import React from "react";
import "./selectable_button.scss";

const SelectableButton = ({ texto, link }) => {
  return (
    <div className="SelectableButton">
    <li>
      <a href={link}>{texto}</a>
    </li>
    </div>
  );
};

export default SelectableButton;
