import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./auto_complete_select.scss";

function AutoCompleteSelect({ lists, selectedKey, onClick }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredLists, setFilteredLists] = useState(lists);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredLists]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const newFilteredLists = lists.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredLists(newFilteredLists);
  };

  const handleInputFocus = () => {
    setIsListVisible(true);
  };

  const handleInputBlur = () => {
    setIsListVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredLists.length > 0) {
      const selectedItem = filteredLists[selectedIndex];
      onClick(selectedItem.key);
      setInputValue(selectedItem.label);
      setIsListVisible(false);
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
                onMouseEnter={() => setSelectedIndex(index)} // Update selectedIndex on mouse enter
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AutoCompleteSelect;