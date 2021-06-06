import { useParams } from "react-router-dom";
import {
  Col,
  Row,
  Jumbotron,
  Container,
  ProgressBar,
  Card,
} from "react-bootstrap";
import React from "react";
import { ProductPreview } from "../shop/ProductPreview";
import { Profile } from "./Profile";

const ProfileOrder = () => {
  // @ts-ignore
  let { id } = useParams();
  let myid = 0;
  const products = [
    {
      image: "https://source.unsplash.com/random/650x870?men",
      id: myid++,
      price: "39.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?gaming",
      id: myid++,
      price: "1339.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?men",
      id: myid++,
      price: "39.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?gaming",
      id: myid++,
      price: "1339.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?men",
      id: myid++,
      price: "39.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?gaming",
      id: myid++,
      price: "1339.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?men",
      id: myid++,
      price: "39.99",
      name: "Card title",
    },
    {
      image: "https://source.unsplash.com/random/650x870?gaming",
      id: myid++,
      price: "1339.99",
      name: "Card title",
    },
  ];
  const delivery = {
    size: 80,
    text: "delivery",
  };
  function date(offset) {
    var d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  }
  // TODO: implement API
  return (
    <Profile>
      <Card>
        <Card.Body>
          <Card.Title>Order #{id}</Card.Title>
          <Card.Text></Card.Text>
          <Jumbotron>
            <Container>
              <h1>Delivery</h1>
              <ProgressBar now={delivery.size} label={delivery.text} />
              Planned arival: {date(5).toLocaleDateString()}
              <ul>
                <li>{date(-5).toLocaleDateString()} Shipped</li>
                <li>{date(-5).toLocaleDateString()} Left Shipment centre</li>
                <li>
                  {date(-4).toLocaleDateString()} Left Major Shipment centre
                </li>
                <li>{date(-1).toLocaleDateString()} arrived hometown</li>
                <li>{date(0).toLocaleDateString()} in delivery</li>
              </ul>
            </Container>
          </Jumbotron>
          <Row>
            {products.map((product, prodid) => (
              <Col sm="2" key={prodid}>
                <ProductPreview {...product} />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Profile>
  );
};
export { ProfileOrder };
