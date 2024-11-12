import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ProductCard = ({ product, style }) => {
    return (
        <Container className="product-card" fluid style={style}>
            <Row className="justify-content-center">
                <Col md={4} className="d-flex justify-content-center">
                    <img 
                        src={product.imagen || 'https://via.placeholder.com/200x200'} 
                        alt={product.nombre} 
                        className="img-fluid" 
                        style={{ maxWidth: '200px', borderRadius: '1rem' }}
                    />
                </Col>
                <Col md={8} className="d-flex flex-column justify-content-center">
                    <h2>{product.nombre}</h2>
                    <h5 className="text-muted mb-2">{product.categoria}</h5>
                    <p>
                        <strong>Descripción:</strong> {product.descripcion}
                    </p>
                    <p>
                        <strong>Categoria:</strong> {product.id_categoria.nombre}
                    </p>
                    <p>
                        <strong>Unidad de medida:</strong> {product.cantidad_por_unidad} {product.unidadmedida}
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductCard;