import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const Profile = (props) => {
  return (
    <Container>
      <h2>Profile</h2>
      <Row>
        <Col sm="3">
          <Card>
            <Card.Header>Account</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                as={Link}
                to="/account/profile/edit_account"
              >
                Edit Account
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/account/profile/addresses">
                Adresses
              </ListGroup.Item>
              <ListGroup.Item
                action
                as={Link}
                to="/account/profile/payment_methods"
              >
                Payment Methods
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <br />
          <Card>
            <Card.Header>Orders</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/account/profile/orders">
                Orders
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <br />
        </Col>
        <Col>{props.children}</Col>
      </Row>
    </Container>
  );
};
export { Profile };
