import React, { useEffect, useState } from 'react';
import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";
import ProductCard from "../../../components/cards/product_card/ProductCard";
import SendButton from "../../../components/buttons/send_button/send_button";
import Loading from "../../../components/loading/loading.jsx";
import BackButton from '../../../components/buttons/back_button/back_button';
import GenericTable from "../../../components/tables/generic_table/GenericTable";

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
                const detallesResult = await fetchData(`/GetDetallesProductoObra/${productoId}/${stockId}/`, token);
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
      <BackButton url={`/obra/${stockId}/categoria/${categoriaID}/`}/>
      <div className="product-page">
        <div className="center-content">
          <ProductCard product={product} style={{marginTop: '3rem', marginBottom: '3rem'}}/>
          <SearchBar 
            onSearchChange={handleSearchChange} 
            onOrderChange={handleOrderChange} 
            filters={[
                { type: 'id_producto.nombre', label: 'Nombre del Producto' },
                { type: 'fecha_creacion', label: 'Fecha de Creación' },
                { type: 'id_usuario.nombre + id_usuario.apellido', label: 'Nombre del Usuario' },
                { type: 'cantidad', label: 'Cantidad' },
            ]}
            style={{ width: '100%' }}
          />
          {sortedData.length === 0 ? (
            <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay registros de este producto.</p>
          ) : (
            <GenericTable
              headers={[
                'id_detallestockproducto',
                'cantidad + id_producto.unidadmedida',
                'fecha_creacion',
                'id_usuario.nombre + id_usuario.apellido'
              ]}
              shownHeaders={[
                '#',
                'Cantidad',
                'Fecha de carga',
                'Usuario responsable de la carga'
              ]}
              data={sortedData}
              showCreateNew={false}
            />
          )}
        </div>
      </div>
      <div style={{marginLeft: '11rem', marginTop: '4rem'}}>
        <SendButton
          text="Descargar informe"
          wide='15'
          onClick={() => window.location.href = `http://127.0.0.1:8000/informe-stock-pdf/${productoId}/${stockId}/${token}`}
        />
      </div>
    </div>
  );
}

export default OneProduct;