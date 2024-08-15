import React from "react";

import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";
import ProductCard from "../../../components/cards/product_card/ProductCard";
import { useParams } from "react-router-dom";
import fetchData from "../../../functions/fetchData";
import Cookies from 'js-cookie';

function OneProduct() {
  const [product, setProduct] = React.useState(null);
  const { productoId } = useParams();
  const token = Cookies.get('token');

  React.useEffect(() => {
    console.log(productoId);
    fetchProduct();
    console.log(product);
  }, []);

  const fetchProduct = async () => {
    try {
      fetchData(`/producto/${productoId}`, token).then((result) => {
        setProduct(result);
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <div>
      <FullNavbar />
      <ProductCard product={product} />
      <h1>OneProduct</h1>
    </div>
  );
}

export default OneProduct;