// eslint-disable-next-line no-unused-vars
import { useParams, Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../css/ProductPreview.css";
import { baseURL } from "../api/API";
import Axios from "axios";

export const ProductPreview = (props) => {
  //console.log(props);

  const { product_id, name, price, image } = props;

  // const [product, setProduct] = useState({
  //   data: { id: "", name: "Loading...", price: "Loading...", images: [] },
  // });
  // let counter = 0;
  // useEffect(() => {
  //   Axios.get(baseURL + `/storefront/products/default/${props.id}`).then(
  //     (res) => {
  //       setProduct(res.data);
  //     }
  //   );
  // }, [counter]);
  // counter++;
  return (
    <Link to={"/shop/product/" + product_id}>
      <Card border="light" className="text-white product-card text-left">
        <Card.Img src={image} alt="Card image" />
        <Card.ImgOverlay>
          <div className="price-box">
            <Card.Text>{price}</Card.Text>
          </div>
          <div className="overlay-grad">
            <Card.Title>{name}</Card.Title>
          </div>
        </Card.ImgOverlay>
      </Card>
    </Link>
  );
};
