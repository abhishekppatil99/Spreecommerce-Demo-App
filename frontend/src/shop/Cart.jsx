import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  FormControl,
  Button,
  ListGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { BsFillTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { API, baseURL } from "../api/API";
import axios from "axios";
import "../css/Cart.css";
import { number_format } from "../static_api/number_format";

const Cart = (props) => {
  const [cart_items, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState([]);

  const strToNum = (str) => {
    var tempStr = str.split("$");
    var num = parseFloat(tempStr[1]);
    return num;
  };

  useEffect(() => {
    axios
      .get(baseURL + "/cart/", { withCredentials: true })
      .then((data) => {
        console.log(data.data);
        console.log("Items added to cart!");
        setCartItems(data.data.cart.entries);
      })
      .catch((err) => {
        console.log(err);
        console.log("An error occured, please try again.");
      });
  }, []);

  // TODO: Implement API

  let total_cost = 0;
  let total_items = 0;

  const removeItemFromCart = (product, index) => {
    axios
      .post(
        baseURL + "/cart/remove",
        { product, removeAll: true },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Item deleted!");
        quantities.splice(index, 1);
        //setQuantities(quantities);
        setCartItems(res.data.cart.entries);
      });
  };

  const checkoutCart = () => {
    axios
      .post(
        baseURL + "/cart/checkout",
        { cartEntries: quantities },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Cart updated!");
        console.log(res);
      });
  };

  return (
    <Container>
      <h2>Cart</h2>
      <Row>
        <Col sm="8">
          <ListGroup>
            {cart_items != null &&
              cart_items.map((item, index) => {
                const price = strToNum(item.product.productOptions.price);
                quantities.push(item.product.productOptions.quantity);
                /* setQuantities((prevQuant) => [
                  ...prevQuant,
                  item.product.productOptions.quantity,
                ]) */
                total_items += item.product.productOptions.quantity;
                total_cost += quantities[index] * price;
                return (
                  <ListGroup.Item
                    key={
                      item.product.productOptions.name +
                      item.product.productOptions.color +
                      item.product.productOptions.size
                    }
                    className="cart-item"
                  >
                    <img src={item.product.productOptions.image} alt="" />
                    <div className="text">
                      <Link to={"/shop/product/" + item.product.productId}>
                        {item.product.productOptions.name}
                      </Link>
                      <span className="price d-right">
                        $ {number_format(price * quantities[index])}
                      </span>
                      <br />
                      <div style={{ display: "flex" }}>
                        <h5>Color: </h5>
                        <h5
                          style={{
                            color:
                              item.product.productOptions.color == "white"
                                ? "lightslategray"
                                : `${item.product.productOptions.color}`,
                            marginLeft: "5px",
                          }}
                        >
                          {item.product.productOptions.color.toUpperCase()}
                        </h5>
                      </div>

                      <h5 style={{ margin: "10px" }}>
                        Size: {item.product.productOptions.size.toUpperCase()}
                      </h5>
                      <div style={{ display: "flex", width: "520px" }}>
                        <Button
                          style={{
                            margin: "10px",
                            width: "fit-content",
                            height: "fit-content",
                            backgroundColor: "black",
                            borderColor: "black",
                          }}
                          onClick={() =>
                            setQuantities((prevQuant) => {
                              if (prevQuant[index] <= 1) {
                                return [...prevQuant, (prevQuant[index] = 1)];
                              } else {
                                return [
                                  ...prevQuant,
                                  (prevQuant[index] = prevQuant[index] - 1),
                                ];
                              }
                            })
                          }
                        >
                          -
                        </Button>
                        <h3 style={{ margin: "10px" }}>{quantities[index]}</h3>
                        <Button
                          style={{
                            margin: "10px",
                            width: "fit-content",
                            height: "fit-content",
                            backgroundColor: "black",
                            borderColor: "black",
                          }}
                          onClick={() =>
                            setQuantities((prevQuant) => [
                              ...prevQuant,
                              (prevQuant[index] = prevQuant[index] + 1),
                            ])
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="danger"
                          style={{
                            alignSelf: "flex-end",
                            marginLeft: "auto",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                          }}
                          onClick={() => {
                            removeItemFromCart(item.product, index);
                          }}
                        >
                          <BsFillTrashFill style={{ alignSelf: "center" }} />
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
          <br />
        </Col>
        <Col sm="4">
          <Card>
            <Card.Body>
              <Card.Body>
                <h4>
                  Cart total ({total_items} articles): <br />${" "}
                  {number_format(total_cost)}
                </h4>
                <Button
                  variant="success"
                  onClick={() => {
                    checkoutCart();
                  }}
                >
                  Checkout
                </Button>
              </Card.Body>
            </Card.Body>
          </Card>
          <br />
        </Col>
      </Row>
    </Container>
  );
};
export { Cart };
