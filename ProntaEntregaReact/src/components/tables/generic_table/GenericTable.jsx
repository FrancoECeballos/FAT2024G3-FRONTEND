import React from "react";

import { Table } from "react-bootstrap";
import SendButton from "../../buttons/send_button/send_button";
import { Icon } from '@iconify/react';


const GenericTable = ({ headers, data, showCreateNew, createNewFunction }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <td key={cellIndex}>{row[header.toLowerCase()]}</td>
            ))}
          </tr>
        ))}
        {showCreateNew && (
          <tr>
            <td colSpan={headers.length}>
              <SendButton children={<Icon icon="line-md:plus-circle" />} onClick={createNewFunction} text="Crear Nuevo  "></SendButton>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default GenericTable;