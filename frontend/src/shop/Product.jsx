import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel, Card, Button, Container } from "react-bootstrap";
import { API, baseURL } from "../api/API";
import Axios from "axios";
import "../css/Product.css";
const Product = () => {
  // @ts-ignore
  let { product } = useParams();
  const [color, setColor] = useState("");
  const [images, setImages] = useState([]);
  const [size, setSize] = useState("");
  const [isItemAddedSucess, setIsItemAddedSuccess] = useState(false);
  const [isItemAddedFail, setIsItemAddedFail] = useState(false);
  const [ind, setInd] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setInd(selectedIndex);
  };

  const [prod, setProduct] = useState({
    id: "Loading...",
    name: "Loading",
    images: [],
    price: "Loading...",
    description: "Loading...",
    colors: [],
    sizes: [],
    variants: {},
  });

  useEffect(() => {
    Axios.get(`${baseURL}/storefront/products/default/${product}`).then(
      (res) => {
        console.log(res);
        return setProduct(res.data.data);
      }
    );
  }, []);

  useEffect(() => {
    changeColor(prod.colors[0]);
    setColor(prod.colors[0]);
    setSize(prod.sizes[0]);
  }, [prod]);

  const [quantity, setQuantity] = useState(1);
  // const item = {
  //   id: prod.id,
  //   name: prod.name,
  //   images: prod.images,
  //   price: prod.price,
  //   description: prod.description,
  // };

  const addToCart = (e) => {
    e.preventDefault();
    Axios.post(
      `${baseURL}/cart/push`,
      {
        product: {
          productId: prod.id,
          productOptions: {
            color: color,
            size: size,
            quantity: quantity,
            price: prod.price,
            name: prod.name,
            image: images[0].url,
          },
        },
      },
      { withCredentials: true }
    )
      .then((res) => {
        console.log(res);
        setIsItemAddedSuccess(true);
        setTimeout(() => {
          setIsItemAddedSuccess(false);
        }, 5000);
        //setProduct(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setIsItemAddedFail(true);
        setTimeout(() => {
          setIsItemAddedFail(false);
        }, 5000);
      });
  };

  const changeColor = (color) => {
    setInd(0);
    setColor(color);
    console.log("New color is " + color);
    const currImages = prod.images.filter((img) =>
      prod.variants[color].image_ids.includes(img.id)
    );
    setImages(currImages);
    /* console.log("___________CURRIMAGES_____________");
    console.log(currImages);
    console.log("___________prod.var_____________");
    console.log(prod); */
  };

  const confirmCartAdditon = () => {
    if (isItemAddedSucess) {
      return (
        <h5 style={{ marginTop: "20px", color: "green" }}>
          Item successfully added to cart!
        </h5>
      );
    } else if (isItemAddedFail) {
      return (
        <h5 style={{ marginTop: "20px", color: "red" }}>
          Could not add item to cart, please try again
        </h5>
      );
    }

    return <></>;
  };
  return (
    <>
      <Container>
        <div className="product-details">
          <Carousel activeIndex={ind} onSelect={handleSelect}>
            {images.map((image, index) => {
              return (
                <Carousel.Item interval={3000} key={index}>
                  <img
                    className="d-block w-100"
                    src={image.url}
                    alt="First slide"
                  />
                  <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
              );
            })}
          </Carousel>
          <Card className="cardy">
            <Card.Body>
              <Card.Title>{prod.name}</Card.Title>
              <Card.Text>{prod.price}</Card.Text>
              <Card.Text>{prod.description}</Card.Text>
              <div className="color-wrapper">
                {prod.colors.map((hue) => {
                  return (
                    <Button
                      style={
                        hue == color
                          ? { backgroundColor: hue, borderColor: "black" }
                          : {
                              backgroundColor: hue,
                              borderColor: "lightgray",
                            }
                      }
                      onClick={() => {
                        changeColor(hue);
                      }}
                    ></Button>
                  );
                })}
              </div>
              <div className="size-wrapper">
                {prod.sizes.map((dim) => {
                  return (
                    <Button
                      className="counter-btn"
                      style={
                        dim == size
                          ? { backgroundColor: "blue" }
                          : { backgroundColor: "black" }
                      }
                      onClick={() => {
                        setSize(dim);
                        console.log("New size is " + dim);
                      }}
                    >
                      {dim}
                    </Button>
                  );
                })}
              </div>
              <div className="counter">
                <Button
                  className="counter-btn"
                  onClick={() =>
                    setQuantity((prevQuant) => {
                      if (prevQuant <= 1) {
                        return 1;
                      } else {
                        return prevQuant - 1;
                      }
                    })
                  }
                >
                  -
                </Button>
                <h3>{quantity}</h3>
                <Button
                  className="counter-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
                <h3></h3>
              </div>
              <div>
                <Button type="submit" onClick={addToCart}>
                  Add To cart
                </Button>
                {confirmCartAdditon()}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
};
export { Product };
