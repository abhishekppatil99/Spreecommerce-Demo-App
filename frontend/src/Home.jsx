import { Col, Row, Carousel, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "./css/Home.css";
import { ProductPreview } from "./shop/ProductPreview";
import { CategoryPreview } from "./shop/CategoryPreview";
import { Link } from "react-router-dom";
import { API } from "./api/API";
import Axios from "axios";
import { baseURL } from "./api/API";
import { getRandomIntInclusive } from "./helper/randomIntInRange";

const Home = () => {
  const [carousel, setCarousel] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const [bestsellers, setBestSellers] = useState([]);
  const [bestsellersImages, setBestSellersImages] = useState([]);
  const SPREECOMMERCE_BASE_URL = "https://demo.spreecommerce.org";
  let counter = 0;

  useEffect(() => {
    console.log("asd");
    API.layout.carousel(setCarousel);
    // API.layout.featured(setFeatured);
    API.layout.showcase(setShowcase);
    return () => {};
  }, [counter]);
  counter++;

  useEffect(() => {
    console.log("Inside home useEffect");
    Axios.get(baseURL + "/storefront/products/bestsellers").then((res) => {
      console.log("Bestsellers fetched!");
      setBestSellers(res.data.data);
      setBestSellersImages(res.data.included);
    });
  }, []);

  return (
    <>
      <Carousel fade>
        {carousel.map((item, index) => {
          return (
            <Carousel.Item key={index} className="carousel-box">
              <img
                className="d-block w-100"
                src={item.image}
                alt="First slide"
                height="50px"
              />
              {/* <Carousel.Caption>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Carousel.Caption> */}
            </Carousel.Item>
          );
        })}
      </Carousel>
      {showcase.map((item, index) => {
        return (
          <Link to={item.url} key={index} className="text-white showcase-card">
            <div style={{ backgroundImage: `url(${item.image})` }}></div>
            <span>{item.name}</span>
          </Link>
        );
      })}
      <Container>
        <div className="box">
          <h1>BESTSELLERS</h1>
          <Row>
            {bestsellers.map((product, index) => {
              const default_variant_id =
                product.relationships.default_variant.data.id;
              var image_url = SPREECOMMERCE_BASE_URL;
              for (let i = 0; i < bestsellersImages.length; i++) {
                let element = bestsellersImages[i];
                if (default_variant_id == element.attributes.viewable_id) {
                  image_url += element.attributes.styles[10].url;
                  break;
                }
              }
              var currentProduct = {
                product_id: product.id,
                name: product.attributes.name,
                price: product.attributes.display_price,
                image: image_url,
              };
              return (
                <Col key={index} lg="3" xs="6">
                  <ProductPreview {...currentProduct} />
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};
export { Home };
