import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./auto_complete_select.scss";

function AutoCompleteSelect({ lists, selectedKey, onClick, addNewButton = false, onInputChange, width = '95%', defaultValue, showLabel = false, label }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredLists, setFilteredLists] = useState(lists);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
    if (defaultValue && lists.length > 0) {
      const defaultItem = lists.find(item => item.key === defaultValue);
      if (defaultItem) {
        setInputValue(defaultItem.label);
      }
    }
  }, [defaultValue, lists]);

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
      onInputChange(value);
    }
  };

  const handleInputFocus = () => {
    setIsListVisible(true);
  };

  const handleInputBlur = () => {
    setIsListVisible(false);
  };

  const onSelect = (index) => {
    if (index >= 0 && index < filteredLists.length) {
      const selectedItem = filteredLists[index];
      setInputValue(selectedItem.label);
      setIsListVisible(false);
      if (typeof onClick === 'function') {
        onClick(selectedItem);
      } else {
        console.error('onClick is not a function');
      }
    } else if (index === filteredLists.length && addNewButton) {
      setInputValue("Nuevo Producto");
      setIsListVisible(false);
      if (typeof onClick === 'function') {
        onClick('New');
      } else {
        console.error('onClick is not a function');
      }
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredLists.length > 0) {
      if (addNewButton && selectedIndex === filteredLists.length) {
        onClick('New');
        setInputValue("Nuevo Producto");
      } else if (selectedIndex >= 0 && selectedIndex < filteredLists.length) {
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
        <div className="select-button-container" style={{ position: 'absolute', zIndex: 1000, width: width }}>
          <ul>
            {showLabel && label && (
              <li className="select-button" style={{ color: 'grey', pointerEvents: 'none' }} disabled>
                <strong>{label}</strong>
              </li>
            )}
            {filteredLists.map((item, index) => (
              <li
                key={item.key}
                className={`select-button ${
                  selectedKey === item.key ? "selected" : ""
                } ${index === selectedIndex ? "highlighted" : ""}`}
                onMouseDown={() => onSelect(index)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {item.label}
              </li>
            ))}
            {addNewButton && (
              <li
                className={`select-button ${filteredLists.length === selectedIndex ? "highlighted" : ""}`}
                onMouseDown={() => onSelect(filteredLists.length)}
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