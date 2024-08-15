import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const ProductDetails = ({ product }) => {
    console.log(product);
    return (
        <Container style={{marginTop: "1rem"}} fluid className="product-details-page d-flex align-items-center justify-content-center vh-100">
            <Row className="w-100">
                <Col md={6} className="d-flex justify-content-center">
                    <img 
                        src={product.imagen || 'https://via.placeholder.com/400x400'} 
                        alt={product.nombre} 
                        className="img-fluid" 
                        style={{ maxWidth: '100%', borderRadius: '1rem' }}
                    />
                </Col>
                <Col md={6} className="d-flex flex-column justify-content-center">
                    <h1>{product.nombre}</h1>
                    <h4 className="text-muted mb-4">{product.categoria}</h4>
                    <p>
                        <strong>Descripción:</strong> {product.descripcion}
                    </p>
                    <p>
                        <strong>Categoria:</strong> {product.id_categoria}
                    </p>
                    <p>
                        <strong>Unidad de medida:</strong> {product.cantidad_por_unidad} {product.unidadmedida}
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetails;
