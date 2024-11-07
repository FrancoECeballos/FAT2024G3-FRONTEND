import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import BackButton from '../../../components/buttons/back_button/back_button.jsx';
import ProductCard from '../../../components/cards/product_card/ProductCard.jsx';
import Loading from '../../../components/loading/loading.jsx';
import SearchBar from '../../../components/searchbar/searchbar.jsx';

const OneProduct = () => {
  const { productoId, stockId, categoriaID } = useParams();
  const token = Cookies.get('token');
  const [product, setProduct] = useState(null);
  const [detallesProduct, setDetallesProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productResult = await fetchData(`GetProducto/${productoId}/`, token);
        setProduct(productResult);

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
    return (
      detalleProduct.id_detallestockproducto.toString().includes(searchQuery) ||
      detalleProduct.cantidad.toString().includes(searchQuery) ||
      detalleProduct.fecha_creacion.toLowerCase().includes(searchQuery) ||
      (detalleProduct.id_usuario?.nombre + ' ' + detalleProduct.id_usuario?.apellido).toLowerCase().includes(searchQuery)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!order) return 0;
    const [key, direction] = order.split(' ');
    const aValue = key.split('.').reduce((acc, key) => acc && acc[key], a);
    const bValue = key.split('.').reduce((acc, key) => acc && acc[key], b);
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
        <div style={{ textAlign: 'center' }}>
          <SearchBar 
            onSearchChange={handleSearchChange} 
            onOrderChange={handleOrderChange} 
            filters={[
              { type: 'id_detallestockproducto asc', label: 'ID' },
              { type: 'cantidad asc', label: 'Cantidad' },
              { type: 'fecha_creacion asc', label: 'Fecha de Creación' },
              { type: 'id_usuario.nombre + id_usuario.apellido asc', label: 'Usuario' },
            ]}
            style={{ width: '80rem', marginBottom: '1rem' }}
          />
          <Table style={{ margin: '0 auto', width: '95%', marginBottom:'2rem' }} striped bordered hover responsive className="custom-table mt-4">
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
        </div>
      </div>
    </div>
  );
};

export default OneProduct;