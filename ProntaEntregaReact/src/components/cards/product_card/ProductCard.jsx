import React, {useState, useEffect} from 'react';
import { Card, Button } from 'react-bootstrap';

import { useParams } from "react-router-dom";


const ProductCard = ({ product, onEditClick, onDeleteClick }) => {

    const { obraId, categoriaId, productoId } = useParams(); // Obtener los IDs desde los parámetros de la URL
    const [productDetails, setProductDetails] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      console.log("Product ID from URL params:", productoId); // Depuración: Verificar el ID del producto
  
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8000/producto/${productoId}/`);
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          const data = await response.json();
          if (data.length > 0) {
            setProductDetails(data[0]); // Asumimos que el primer elemento del array es el producto deseado
          } else {
            setError("No se encontraron detalles del producto.");
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
          setError(error.message);
        }
      };
  
      if (productoId) {
        fetchProductDetails();
      } else {
        setError("No se encontró el ID del producto en la URL.");
      }
    }, [productoId]); // Dependencia en el ID del producto


    return (
        <Card className="mb-4 shadow-sm" style={{ width: '18rem', borderRadius: '1rem', backgroundColor: '#f9f9f9' }}>
            <Card.Img variant="top" src={productDetails.imagen || 'https://via.placeholder.com/150'} alt={product.nombre} style={{ borderRadius: '1rem 1rem 0 0', height: '200px', objectFit: 'cover' }} />
            <Card.Body>
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{product.categoria}</Card.Subtitle>
                <Card.Text>
                    <strong>Descripción:</strong> {product.descripcion}<br />
                    <strong>Cantidad:</strong> {product.total} {product.unidadmedida}<br />
                    <strong>Precio:</strong> ${product.precio}<br />
                    <strong>Stock:</strong> {product.stock}<br />
                    <strong>Fecha de Ingreso:</strong> {product.fechaIngreso}
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={() => onEditClick(product.id)}>Editar</Button>
                    <Button variant="danger" onClick={() => onDeleteClick(product.id)}>Eliminar</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
