// eslint-disable-next-line no-unused-vars
import { Link, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import React from "react";
import "../css/CategoryPreview.css";

export const CategoryPreview = ({ id, name, image }) => {
  return (
    <Link to={"/shop/product/" + id}>
      <Card border="light" className="text-white category-card">
        <Card.Img src={image} alt="Card image" />
        <Card.ImgOverlay>
          <div className="overlay-box">
            <Card.Title>{name}</Card.Title>
          </div>
        </Card.ImgOverlay>
      </Card>
    </Link>
  );
};
