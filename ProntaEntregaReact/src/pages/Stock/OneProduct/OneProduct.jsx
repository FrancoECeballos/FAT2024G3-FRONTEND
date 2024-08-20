import React, { useEffect, useState } from 'react';
import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";
import ProductCard from "../../../components/cards/product_card/ProductCard";
import SendButton from "../../../components/buttons/send_button/send_button";

import { Table } from "react-bootstrap";
import './OneProduct.scss';

import { useParams } from "react-router-dom";
import fetchData from "../../../functions/fetchData";
import Cookies from 'js-cookie';

function OneProduct() {
  const [detallesProduct, setDetallesProduct] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { productoId, stockId } = useParams();
  const token = Cookies.get('token');

  useEffect(() => {
    console.log(stockId);
    try {
      fetchData(`/producto/${parseInt(productoId, 10)}`, token).then((result) => {
        setProduct(result[0]);
        try {
          fetchData(`GetDetallesProductoObra/${productoId}/${stockId}/`, token).then((result) => {
            console.log(result);
            setDetallesProduct(result);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error fetching product details:", error);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  }, [productoId, stockId, token]);

  return (
    <div>
      <FullNavbar />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-page">
          <ProductCard product={product} />
          <Table striped bordered hover responsive className="custom-table mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Cantidad</th>
                <th>Fecha de carga</th>
                <th>Usuario responsable de la carga</th>
              </tr>
            </thead>
            <tbody>
              {detallesProduct.map((detalleProduct, index) => (
                <tr key={index}>
                  <td>{detalleProduct.id_detallestockproducto}</td>
                  <td>{detalleProduct.cantidad} {detalleProduct.id_producto.unidadmedida}</td>
                  <td>{detalleProduct.fecha_creacion}</td>
                  <td>{detalleProduct.id_usuario.nombre} {detalleProduct.id_usuario.apellido}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <SendButton
            onClick={() => window.location.href = `http://127.0.0.1:8000/informe-stock-pdf/${productoId}/${stockId}/`}
          />
        </div>
      )}
    </div>
  );
}

export default OneProduct;