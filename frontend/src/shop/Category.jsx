import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  Button,
  Accordion,
  ButtonGroup,
  ButtonToolbar,
  Pagination,
} from "react-bootstrap";
import { ProductPreview } from "./ProductPreview";
// eslint-disable-next-line no-unused-vars
import { AiOutlinePlus } from "react-icons/ai";
import "../css/Category.css";
// eslint-disable-next-line no-unused-vars
import { Product } from "./Product";
import { baseURL } from "../api/API";
import Axios from "axios";

const Category = () => {
  const filters = [
    {
      name: "Size",
      categories: ["All", "XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Color",
      categories: ["All", "White", "Black", "Blue", "Green", "Red"],
    },
    {
      name: "Price",
      categories: ["0-25", "25-50", "50-75", "75-100", "All"],
    },
  ];
  // @ts-ignore
  const { cat } = useParams();
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilter, setIsFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [pager, setPager] = useState(cat);
  const [totalPages, setTotalPages] = useState(1);
  const [active, setActive] = useState(1);
  const [pageVisitNum, setPageVisitNum] = useState(0);
  const [cachedProducts, setCachedProducts] = useState({});
  var items = [];
  const SPREECOMMERCE_BASE_URL = "https://demo.spreecommerce.org";

  /* 
  cachedProducts = {
    "cache_2_3_10": {...},
    "cache_2_4_10": {...},
    "cache_2_3_50": {...},
    "usage": {
      "cache_2_3_10": 3,
      "cache_2_4_10": 1,
      "cache_2_3_50": 2,
    }
  }
  */

  useEffect(
    () => {
      setIsLoading(true);
      var curr_products = {};
      var key_str = "cache_" + cat + "_" + active + "_" + minPrice + "_";

      if (cachedProducts[key_str]) {
        const checkCache = () => {
          console.log("Page found in cache!");
          curr_products = cachedProducts[key_str];
          cachedProducts["usage"] = {
            ...cachedProducts["usage"],
            [key_str]: pageVisitNum,
          };
          setPageVisitNum(pageVisitNum + 1);
          setProducts(curr_products.data);
          setImages(curr_products.included);
          setTotalPages(curr_products.meta.total_pages);
        };
        checkCache();

        console.log("-----CACHED PRODUCTS-----");
        console.log(cachedProducts);
        setIsLoading(false);
      } else {
        console.log("Page not found in cache!");
        Axios.post(baseURL + `/storefront/products/category/${cat}/${active}`, {
          minPrice: minPrice,
          maxPrice: maxPrice,
        })
          .then((res) => {
            cachedProducts[key_str] = res.data;
            cachedProducts["usage"] = {
              ...cachedProducts["usage"],
              [key_str]: pageVisitNum,
            };
            console.log("Adding page");
            curr_products = cachedProducts[key_str];

            setPageVisitNum(pageVisitNum + 1);
            setCachedProducts(cachedProducts);
            setProducts(curr_products.data);
            setImages(curr_products.included);
            setTotalPages(curr_products.meta.total_pages);
          })
          .then(() => {
            console.log("-----CACHED PRODUCTS-----");
            console.log(cachedProducts);
            setIsLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, minPrice, pager]
  );

  useEffect(() => {
    setActive(1);
    setMinPrice("");
    setMaxPrice("");
    setPager(cat);
  }, [cat]);

  const filterProducts = (name, category) => {
    console.log(name, category);
    if (name === "Price") {
      if (category === "All") {
        setActive(1);
        setMinPrice("");
        setMaxPrice("");
      } else {
        var temp_string = category.split("-");
        setActive(1);
        setMinPrice(temp_string[0]);
        setMaxPrice(temp_string[1]);
      }
    }
  };

  const paginationBasic = (
    <div>
      <Pagination className="pag" size="lg">
        {items}
      </Pagination>
    </div>
  );

  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => {
          setIsLoading(true);
          setActive(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (!isLoading) {
    if (products.length) {
      return (
        <>
          <h1 className="cat-name">Products</h1>
          <div className="flexbox">
            <div className="filters">
              <Accordion>
                {filters.map((filter, index) => {
                  return (
                    <Card key={index}>
                      <Card.Header>
                        <Accordion.Toggle
                          className="filter-head"
                          as={Button}
                          variant="link"
                          eventKey={index.toString()}
                        >
                          {filter.name}
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={index.toString()}>
                        <Card.Body>
                          <ButtonGroup>
                            <Row>
                              {filter.categories.map((category) => {
                                return (
                                  <Col key={category}>
                                    <button
                                      className="filter-button"
                                      onClick={() =>
                                        filterProducts(filter.name, category)
                                      }
                                    >
                                      {category}
                                    </button>
                                  </Col>
                                );
                              })}
                            </Row>
                          </ButtonGroup>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  );
                })}
              </Accordion>
            </div>

            <div className="products">
              <Row>
                {products.map((product) => {
                  const default_variant_id =
                    product.relationships.default_variant.data.id;
                  var image_url = SPREECOMMERCE_BASE_URL;
                  for (let i = 0; i < images.length; i++) {
                    let element = images[i];
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
                    <Col lg="3" sm="2" key={"product-" + product.id}>
                      <ProductPreview {...currentProduct} />
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>

          {paginationBasic}
        </>
      );
    } else {
      return (
        <>
          <h1 className="cat-name">Products</h1>
          <div className="flexbox">
            <div className="filters">
              <Accordion>
                {filters.map((filter, index) => {
                  return (
                    <Card key={index}>
                      <Card.Header>
                        <Accordion.Toggle
                          className="filter-head"
                          as={Button}
                          variant="link"
                          eventKey={index.toString()}
                        >
                          {filter.name}
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={index.toString()}>
                        <Card.Body>
                          <ButtonGroup>
                            <Row>
                              {filter.categories.map((category) => {
                                return (
                                  <Col key={category}>
                                    <Button
                                      className="filter-button"
                                      onClick={() =>
                                        filterProducts(filter.name, category)
                                      }
                                    >
                                      {category}
                                    </Button>
                                  </Col>
                                );
                              })}
                            </Row>
                          </ButtonGroup>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  );
                })}
              </Accordion>
            </div>
            <div className="loader-container">
              <h1>Sorry, No products found..</h1>
            </div>
          </div>

          {paginationBasic}
        </>
      );
    }
  } else {
    return (
      <>
        <h1 className="cat-name">Products</h1>
        <div className="flexbox">
          <div className="filters">
            <Accordion>
              {filters.map((filter, index) => {
                return (
                  <Card key={index}>
                    <Card.Header>
                      <Accordion.Toggle
                        className="filter-head"
                        as={Button}
                        variant="link"
                        eventKey={index.toString()}
                      >
                        {filter.name}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={index.toString()}>
                      <Card.Body>
                        <ButtonGroup>
                          <Row>
                            {filter.categories.map((category) => {
                              return (
                                <Col key={category}>
                                  <Button
                                    className="filter-button"
                                    onClick={() =>
                                      filterProducts(filter.name, category)
                                    }
                                  >
                                    {category}
                                  </Button>
                                </Col>
                              );
                            })}
                          </Row>
                        </ButtonGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                );
              })}
            </Accordion>
          </div>
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </div>
      </>
    );
  }
};
export { Category };
