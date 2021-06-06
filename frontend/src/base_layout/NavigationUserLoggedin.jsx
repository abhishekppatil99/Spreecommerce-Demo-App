import { FaPowerOff, FaUser } from "react-icons/fa";
import React from "react";
import { baseURL } from "../api/API";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
const NavigationUserLoggedin = ({ user }) => {
  return (
    <NavDropdown
      title={
        <>
          <FaUser /> {user.firstName} {user.lastName}
        </>
      }
      id="navigation-dropdown-user-icon"
      className="dropdown-menu-right"
    >
      <NavDropdown.Item
        as={Link}
        to="/account/logout"
        onClick={(e) => {
          e.preventDefault();
          Axios.get(baseURL + "/auth/logout", {
            withCredentials: true,
          }).then((res) => {
            window.location.reload();
          });
        }}
      >
        <FaPowerOff /> Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
};
export { NavigationUserLoggedin };
