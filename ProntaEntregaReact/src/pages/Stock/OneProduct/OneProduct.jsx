import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";

function OneProduct() {
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
    <div>
      <FullNavbar />
      <h1>Detalles del Producto</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : productDetails ? (
        <div>
          <p>Nombre: {productDetails.nombre}</p>
          <p>Descripción: {productDetails.descripcion}</p>
          <p>Categoría: {productDetails.id_categoria.nombre}</p>
          <p>Unidad de Medida: {productDetails.unidadmedida}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default OneProduct;