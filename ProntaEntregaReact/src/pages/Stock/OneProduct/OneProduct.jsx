import React, { useEffect, useState } from 'react';

import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar";
import ProductCard from "../../../components/cards/product_card/ProductCard";
import { useParams } from "react-router-dom";
import fetchData from "../../../functions/fetchData";
import Cookies from 'js-cookie';

function OneProduct() {
  const [product, setProduct] = useState({});
  const { productoId } = useParams();
  const token = Cookies.get('token');

  useEffect(() => {
    try {
      fetchData(`/producto/${parseInt(productoId, 10)}`, token).then((result) => {
        setProduct(result[0]);
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, []);

  return (
    <div>
      <FullNavbar />
      <ProductCard product={product}/>
    </div>
  );
}

export default OneProduct;