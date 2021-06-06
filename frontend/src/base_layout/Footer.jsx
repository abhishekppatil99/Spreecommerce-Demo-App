import { Link } from "react-router-dom";
import React from "react";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col">
            <span className="header">men</span>
            <Link to="/shop/category/2">All</Link>
            <Link to="/shop/category/5">sweatshirts</Link>
            <Link to="/shop/category/6">tops</Link>
            <Link to="/shop/category/7">pants</Link>
          </div>
          <div className="col">
            <span className="header">women</span>
            <Link to="/shop/category/3">All</Link>
            <Link to="/shop/category/9">shirts</Link>
            <Link to="/shop/category/8">sweaters</Link>
            <Link to="/shop/category/10">dresses</Link>
            <Link to="/shop/category/13">{"tops & t-shirts"}</Link>
            <Link to="/shop/category/12">skirts</Link>
            <Link to="/shop/category/11">{"jackets & coats"}</Link>
          </div>
          <div className="col">
            {" "}
            <span className="header">sportswear</span>
            <Link to="/shop/category/2">All</Link>
            <Link to="/shop/category/5">sweatshirts</Link>
            <Link to="/shop/category/6">tops</Link>
            <Link to="/shop/category/7">pants</Link>
          </div>
          <div className="col">
            <span className="header">Shopping cart</span>
            <Link to="/shop/cart">cart</Link>
          </div>
          <div className="col">
            <span className="header">legal</span>
            <Link to="/tos">terms of service</Link>
            <Link to="/about">about</Link>
            <Link to="/privacy">data privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export { Footer };
