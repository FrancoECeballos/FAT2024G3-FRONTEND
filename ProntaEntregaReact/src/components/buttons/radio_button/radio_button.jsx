import React from "react";
import { Form } from "react-bootstrap";

function GenericRadioButton({ titulo, selected, onSelect }) {
  return (
    <Form>
      <Form.Check
        inline
        label={titulo}
        name="group1"
        type="radio"
        id="inline-radio-1"
        checked={selected}
        onChange={onSelect}
      />
    </Form>
  );
}

export default GenericRadioButton;
