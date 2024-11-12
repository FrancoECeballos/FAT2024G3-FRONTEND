import React from "react";
import { Table } from "react-bootstrap";
import SendButton from "../../buttons/send_button/send_button";
import { Icon } from '@iconify/react';
import './GenericTable.scss';

const getNestedProperty = (obj, path) => {
  if (path.includes('+')) {
    return path.split('+').map(part => part.trim()).map(part => part.split('.').reduce((acc, key) => acc && acc[key], obj)).join(' ');
  }
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const GenericTable = ({ headers, shownHeaders, data, showCreateNew, createNewFunction, minWid = '80rem', maxWid = '80rem', wid = '80rem' }) => {
  return (
    <Table striped bordered hover responsive className="custom-table mt-4" style={{ minWidth: minWid, maxWidth: maxWid, width: wid }}>
      <thead>
        <tr>
          {shownHeaders.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, cellIndex) => {
              const value = getNestedProperty(row, header);
              return (
                <td key={cellIndex}>
                  {header.includes('imagen') ? <img src={value} alt="Image" style={{ width: '3.125rem', height: '3.125rem' }} /> : value}
                </td>
              );
            })}
          </tr>
        ))}
        {showCreateNew && (
          <tr>
            <td colSpan={shownHeaders.length}>
              <SendButton children={<Icon icon="line-md:plus-circle" />} onClick={createNewFunction} text="Crear Nuevo  "></SendButton>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default GenericTable;