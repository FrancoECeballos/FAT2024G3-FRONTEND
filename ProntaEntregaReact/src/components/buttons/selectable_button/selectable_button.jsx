import React from "react";
import "./selectable_button.scss";

const SelectableButton = ({ texto, link }) => {
  return (
    <li className="SelectableButton">
      <a href={link}>{texto}</a>
    </li>
  );
};

export default SelectableButton;
