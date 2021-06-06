import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import logo from "../logo.svg";
import navigationItems from "../static_api/navigation";
import { NavigationSearch } from "./NavigationSearch";
import { NavigationCart } from "./NavigationCart";
import { NavigationUser } from "./NavigationUser";
import { SearchForm } from "./SearchForm";
import { NavigationUserLoggedin } from "./NavigationUserLoggedin";
import "../css/Navigation.css";

const Navigation = ({ loggedin, user }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Navbar sticky="top" bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="" /> React-Spreestrap
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" id="mainnav">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {navigationItems.map((item, index) => {
              return (
                <NavDropdown
                  key={"navitem-" + index}
                  title={item.name}
                  id={"navigation-dropdown-" + item.name}
                >
                  <div className="links">
                    <span>Categories</span>
                    {item.items.map((link, li) => (
                      <NavDropdown.Item
                        key={"navitemdropdown-" + li}
                        as={Link}
                        to={link.url}
                      >
                        {link.name}
                      </NavDropdown.Item>
                    ))}
                  </div>
                  <Link to={item.spotlight.url}>
                    <div
                      className="navigationDropdownImage"
                      style={{
                        backgroundImage: "url(" + item.spotlight.image + ")",
                      }}
                    >
                      <span>{item.spotlight.text}</span>
                    </div>
                  </Link>
                </NavDropdown>
              );
            })}
          </Nav>
          <Nav id="navicons">
            {/* TODO: Fix Mobile Visibility (Maybe with text additional to the icons?) */}
            <NavigationSearch onClick={() => setShow(true)} />
            {loggedin ? (
              <>
                <NavigationCart />
                <NavigationUserLoggedin user={user} />
              </>
            ) : (
              <NavigationUser />
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <SearchForm show={show} handleHide={() => setShow(false)} />
    </>
  );
};
export { Navigation };
