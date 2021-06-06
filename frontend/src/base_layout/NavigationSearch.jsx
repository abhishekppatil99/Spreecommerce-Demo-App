import { BsSearch } from "react-icons/bs";
import { Nav } from "react-bootstrap";
import React from "react";
const NavigationSearch = (props) => {
  return (
    <Nav.Link
      onClick={() => {
        props.onClick();
      }}
    >
      <BsSearch /> Search
    </Nav.Link>
  );
};
export { NavigationSearch };
