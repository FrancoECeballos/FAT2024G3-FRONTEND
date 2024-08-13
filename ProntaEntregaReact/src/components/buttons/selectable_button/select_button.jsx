import React from "react";
import Form from "react-bootstrap/Form";
import "./select_button.scss";

function SelectButton({ lists, selectedListIndex, selectedItemIndex, onClick }) {
  return (
    <Form.Select className="select-button-container">
      <option disabled hidden selected>Seleccione una Opcion</option>
      {lists.map((list, listIndex) => (
        <optgroup key={listIndex} label={list.title} className="list">
            {list.items.map((item, itemIndex) => (
            <option
                key={itemIndex}
                className={`select-button ${selectedListIndex === listIndex && selectedItemIndex === itemIndex ? "selected" : ""}`}
                onClick={() => onClick(listIndex, itemIndex)}
            >
                {item.text}
            </option>
            ))}
        </optgroup>
      ))}
    </Form.Select>
  );
}

export default SelectButton;