import React, { useEffect, useState } from 'react';
import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";
import ProductCard from "../../../components/cards/product_card/ProductCard";
import SendButton from "../../../components/buttons/send_button/send_button";
import Loading from "../../../components/loading/loading.jsx";
import BackButton from '../../../components/buttons/back_button/back_button';

import { Table } from "react-bootstrap";
import './OneProduct.scss';

import { useParams } from "react-router-dom";
import fetchData from "../../../functions/fetchData";
import Cookies from 'js-cookie';

import { useNavigate } from 'react-router-dom';

import SearchBar from '../../../components/searchbar/searchbar.jsx';


function OneProduct() {
  const navigate = useNavigate();
  const [detallesProduct, setDetallesProduct] = useState([]);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('');

  const { productoId, stockId, categoriaID } = useParams();
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

  const handleSearchChange = (query) => {
    setSearchQuery(query);
};

const handleOrderChange = (order) => {
    setOrder(order);
};

const filteredData = detallesProduct.filter(detalleProduct => {
  const fullName = `${detalleProduct.id_usuario?.nombre} ${detalleProduct.id_usuario?.apellido}`;
  return (
    detalleProduct.id_producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detalleProduct.fecha_creacion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detalleProduct.id_obra.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detalleProduct.cantidad.toString().includes(searchQuery)
  );
});

const sortedData = [...filteredData].sort((a, b) => {
    if (!order) return 0;
    const [key, direction] = order.split(' ');
    const aValue = key.includes('+') ? key.split('+').map(part => part.trim()).map(part => part.split('.').reduce((acc, key) => acc && acc[key], a)).join(' ') : key.split('.').reduce((acc, key) => acc && acc[key], a);
    const bValue = key.includes('+') ? key.split('+').map(part => part.trim()).map(part => part.split('.').reduce((acc, key) => acc && acc[key], b)).join(' ') : key.split('.').reduce((acc, key) => acc && acc[key], b);
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
});

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <FullNavbar selectedPage={'Stock'}/>
        <div className="product-page">
          <BackButton url={`/obra/${stockId}/categoria/${categoriaID}/`}/>
          <ProductCard product={product} />
          <SearchBar 
                    onSearchChange={handleSearchChange} 
                    onOrderChange={handleOrderChange} 
                    filters={[
                        { type: 'fecha_creacion', label: 'Fecha de Creación' },
                        { type: 'id_usuario.nombre', label: 'Nombre del Usuario' },
                        { type: 'id_obra.nombre', label: 'Nombre de la Obra' },
                        { type: 'cantidad', label: 'Cantidad' },
                    ]}
                    style={{ width: '80rem' }}
          />
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
              {sortedData.map((detalleProduct, index) => {
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
            text="Descargar informe"
            onClick={() => window.location.href = `http://127.0.0.1:8000/informe-stock-pdf/${productoId}/${stockId}/${token}`}
          />
        </div>
    </div>
  );
}

export default OneProduct;