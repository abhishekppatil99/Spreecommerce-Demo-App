import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { number_format } from "../static_api/number_format";

const ProfileOrderCategoryItem = (props) => {
  return (
    <>
      <Card>
        <Card.Header>{props.name} Orders</Card.Header>
        <Card.Body>
          <Row>
            {props.orders.map((order, index) => {
              let cost = 0;
              let products = 0;
              for (let i = 0; i < order.products.length; i++) {
                products += order.products[i].amount;
                cost += order.products[i].price;
              }
              return (
                <Col key={index} sm="4">
                  <Card>
                    <Card.Body>
                      <Card.Title>{order.date}</Card.Title>
                      <Card.Text>
                        Number of Items: {products}
                        <br />
                        Total Cost: {number_format(cost)}
                      </Card.Text>
                      <Link
                        to={"/account/profile/order/" + index}
                        className="btn btn-sm btn-primary"
                      >
                        Items
                      </Link>
                      {order.actions.map((action, li) => {
                        return (
                          <Link
                            key={"l" + li}
                            to={action.href}
                            className={
                              "text-uppercase btn btn-sm btn-" + action.color
                            }
                          >
                            {action.name}
                          </Link>
                        );
                      })}
                    </Card.Body>
                  </Card>
                  <br />
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
      <br />
    </>
  );
};
export { ProfileOrderCategoryItem };
