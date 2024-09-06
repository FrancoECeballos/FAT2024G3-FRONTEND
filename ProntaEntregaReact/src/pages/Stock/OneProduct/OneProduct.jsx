import React, { useEffect, useState } from 'react';
import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";
import ProductCard from "../../../components/cards/product_card/ProductCard";
import SendButton from "../../../components/buttons/send_button/send_button";
import Loading from "../../../components/loading/loading.jsx";

import { Table } from "react-bootstrap";
import './OneProduct.scss';

import { useParams } from "react-router-dom";
import fetchData from "../../../functions/fetchData";
import Cookies from 'js-cookie';

import { useNavigate } from 'react-router-dom';

function OneProduct() {
  const navigate = useNavigate();
  const [detallesProduct, setDetallesProduct] = useState([]);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { productoId, stockId } = useParams();
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
        navigate('/login');
        return;
    }
    
    const fetchProductData = async () => {
        try {
            const productResult = await fetchData(`/producto/${parseInt(productoId, 10)}`, token);
            setProduct(productResult[0]);

            try {
                const detallesResult = await fetchData(`GetDetallesProductoObra/${productoId}/${stockId}/`, token);
                setDetallesProduct(detallesResult);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchProductData();
  }, [productoId, stockId, token]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <FullNavbar selectedPage={'Stock'}/>
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
              {detallesProduct.map((detalleProduct, index) => {
                return (
                  console.log(detalleProduct),
                  <tr key={index}>
                    <td>{detalleProduct.id_detallestockproducto}</td>
                    <td>{detalleProduct.cantidad} {detalleProduct.id_producto.unidadmedida}</td>
                    <td>{detalleProduct.fecha_creacion}</td>
                    <td>{detalleProduct.id_usuario?.nombre} {detalleProduct.id_usuario?.apellido}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <SendButton
            onClick={() => window.location.href = `http://127.0.0.1:8000/informe-stock-pdf/${productoId}/${stockId}/${token}`}
          />
        </div>
    </div>
  );
}

export default OneProduct;