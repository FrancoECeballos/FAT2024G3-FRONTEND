import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ProductCard = ({ product, onEditClick, onDeleteClick }) => {
    return (
        <Card className="mb-4 shadow-sm" style={{ width: '18rem', borderRadius: '1rem', backgroundColor: '#f9f9f9' }}>
            <Card.Img variant="top" src={product.imagen || 'https://via.placeholder.com/150'} alt={product.nombre} style={{ borderRadius: '1rem 1rem 0 0', height: '200px', objectFit: 'cover' }} />
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
