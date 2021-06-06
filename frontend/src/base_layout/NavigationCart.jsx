import { GiShoppingCart } from "react-icons/gi";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API, baseURL } from "../api/API";

const NavigationCart = () => {
  // TODO: Implement Cart
  // eslint-disable-next-line no-unused-vars
  const [cart_items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get(baseURL + "/cart/", { withCredentials: true })
      .then((data) => {
        console.log(data.data);
        console.log("Items added to cart!");
        setItems(data.data.cart.entries);
      })
      .catch((err) => {
        console.log(err);
        console.log("An error occured, please try again.");
      });
  });

  var total_cost = 0;

  const strToNum = (str) => {
    var tempStr = str.split("$");
    var num = parseFloat(tempStr[1]);
    return num;
  };

  return (
    <NavDropdown
      title={
        <>
          <GiShoppingCart /> ({cart_items.length} products)
        </>
      }
      id="navigation-dropdown-user-icon"
      className="dropdown-menu-right"
    >
      {cart_items.map((item, index) => {
        const price = strToNum(item.product.productOptions.price);
        return (
          <Link key={index} to="/shop/product/:itemID" className="mini-cart">
            <img src={item.product.productOptions.image} alt="" />
            <div className="text">
              <h6>{item.product.productOptions.name}</h6>
              <span className="price d-right">
                ${price * item.product.productOptions.quantity}
                {/* {number_format(
                  item.product.productOptions.price *
                    item.product.productOptions.quantity
                )} */}
              </span>
              {/* <Button className="btn-sm">x</Button> */}
            </div>
          </Link>
        );
      })}
      <NavDropdown.Item as={Link} to="/shop/cart">
        <GiShoppingCart /> To Cart
      </NavDropdown.Item>
    </NavDropdown>
  );
};
export { NavigationCart };
