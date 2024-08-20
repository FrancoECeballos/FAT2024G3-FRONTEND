import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./auto_complete_select.scss";

function AutoCompleteSelect({ lists, selectedKey, onClick, addNewButton = false, onInputChange }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredLists, setFilteredLists] = useState(lists);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredLists, inputValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const newFilteredLists = lists.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredLists(newFilteredLists);
    setIsListVisible(true);
    setSelectedIndex(-1);

    if (onInputChange) {
      onInputChange(null);
    }
  };

  const handleInputFocus = () => {
    setIsListVisible(true);
  };

  const handleInputBlur = () => {
    setIsListVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredLists.length > 0) {
      if (addNewButton && selectedIndex === filteredLists.length) {
        onClick(inputValue);
        setInputValue("Nuevo Producto");
      } else {
        const selectedItem = filteredLists[selectedIndex];
        onClick(selectedItem.key);
        setInputValue(selectedItem.label);
      }
      setIsListVisible(false);
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % (filteredLists.length + (addNewButton ? 1 : 0)));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + (filteredLists.length + (addNewButton ? 1 : 0))) % (filteredLists.length + (addNewButton ? 1 : 0)));
    }
  };

  return (
    <div className="auto-complete-select">
      <Form.Control
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="Seleccione una Opcion"
        className="select-input"
      />
      {isListVisible && (
        <div className="select-button-container">
          <ul>
            {filteredLists.map((item, index) => (
              <li
                key={item.key}
                className={`select-button ${
                  selectedKey === item.key ? "selected" : ""
                } ${index === selectedIndex ? "highlighted" : ""}`}
                onMouseDown={() => {
                  onClick(item.key);
                  setInputValue(item.label);
                  setIsListVisible(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {item.label}
              </li>
            ))}
            {addNewButton && (
              <li
                className={`select-button ${filteredLists.length === selectedIndex ? "highlighted" : ""}`}
                onMouseDown={() => {
                  onClick('New');
                  setInputValue("Nuevo Producto");
                  setIsListVisible(false);
                }}
                onMouseEnter={() => setSelectedIndex(filteredLists.length)}
              >
                <strong>Agregar un nuevo Producto </strong>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AutoCompleteSelect;