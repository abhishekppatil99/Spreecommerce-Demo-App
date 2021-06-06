import { FaSignInAlt, FaUser, FaUserLock, FaUserPlus } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import React, { useState } from "react";
import { baseURL } from "../api/API";
import {
  NavDropdown,
  InputGroup,
  FormControl,
  Form,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
const NavigationUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(
      baseURL + "/auth/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    ).then((res) => {
      window.location.reload();
    });
  };

  return (
    <NavDropdown
      title={
        <>
          <FaUser /> Account
        </>
      }
      id="navigation-dropdown-user-icon"
      className="dropdown-menu-right"
    >
      <Form
        style={{ padding: "0 10px" }}
        method="POST"
        action="/"
        onSubmit={handleSubmit}
      >
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="login-id-username">
              <FaUser />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="email"
            placeholder="Email"
            aria-label="Username"
            aria-describedby="login-id-username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="login-id-password">
              <RiLockPasswordFill />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="password"
            placeholder="Password"
            aria-label="Username"
            aria-describedby="login-id-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <Button style={{ minWidth: "300px" }} variant="primary" type="submit">
          <FaSignInAlt /> Login
        </Button>
      </Form>
      <NavDropdown.Item as={Link} to="/account/register">
        <FaUserPlus /> Create Account
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/account/lostpassword">
        <FaUserLock /> Lost Passowrd
      </NavDropdown.Item>
    </NavDropdown>
  );
};
export { NavigationUser };
