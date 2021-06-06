import { useState } from "react";
import React from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  Modal,
  InputGroup,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { RiMailSendLine } from "react-icons/ri";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { validateEmail } from "../helper/validateEmail";
import { passwordStrength, pw_min_length } from "../helper/passwordStrength";
import "../css/Register.css";
import { API, baseURL } from "../api/API";

import Axios from "axios";

const Register = () => {
  const onChange = (e) => {
    if (e.target.name === "postal") {
      e.target.value = e.target.value.replace(/[^0-9]/, "");
    }
    if (user.hasOwnProperty(e.target.name)) {
      const n = {};
      n[e.target.name] = e.target.value;
      setUser({ ...user, ...n });
    }
    if (e.target.name === "email") {
      setEmailValid(validateEmail(user.email));
    }
    if (e.target.name === "password") {
      const password = e.target.value;
      const t = passwordStrength(password);
      setPwSecurity(t);
    }
    if (e.target.name === "password" || e.target.name === "passwordConfirm") {
      if (user.password !== "" && user.passwordConfirm !== "") {
        setPasswordEqual(user.password === user.passwordConfirm);
      }
    }
  };

  const [alert, setAlert] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const [emailValid, setEmailValid] = useState(null);
  const [pw_sec, setPwSecurity] = useState({
    characters: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special_character: false,
  });
  const [passwordEqual, setPasswordEqual] = useState(null);
  const [user, setUser] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    lastName: "",
    firstName: "",
    street: "",
    house: "",
    postal: "",
    town: "",
  });
  if (alert.length) {
    setTimeout(() => {
      setAlert([]);
    }, 3 * 1000);
  }
  let emailIsValid = null;
  let emailIsInvalid = null;
  if (emailValid != null) {
    emailIsValid = emailValid;
    emailIsInvalid = !emailValid;
  }
  const submitDisabled =
    user.lastName === "" ||
    user.firstName === "" ||
    user.street === "" ||
    user.house === "" ||
    user.postal === "" ||
    user.town === "" ||
    passwordEqual === false ||
    passwordEqual === null ||
    emailIsValid === false;
  const handleSubmit = (e) => {
    e.preventDefault();
    API.account.register(
      {
        email: user.email,
        password: user.password,
        passwordConfirm: user.passwordConfirm,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      (success, error) => {
        if (success) {
          setUser({
            email: "",
            password: "",
            passwordConfirm: "",
            lastName: "",
            firstName: "",
            street: "",
            house: "",
            postal: "",
            town: "",
          });
          setEmailValid(null);
          setPasswordEqual(null);
          setAlert([
            { type: "success", text: "Your account has been created." },
          ]);
          setTimeout(function () {
            setRedirect(true);
          }, 2000);
        } else {
          setAlert([
            {
              type: "danger",
              text: "There was an Error! Please verify your data.",
            },
          ]);
        }
      }
    );
  };
  var renderRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
  };
  return (
    <div className="container">
      {alert.map((item, ai) => (
        <div key={"alert-" + ai} className={"alert alert-" + item.type}>
          {item.text}
        </div>
      ))}
      <Modal.Dialog size="xl">
        <Modal.Header>
          <Modal.Title>Create new Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            style={{ padding: "0 10px" }}
            method="POST"
            action="/"
          >
            <small>Account Data</small>
            <InputGroup className="mb-3">
              <FormControl
                value={user.email}
                isValid={emailIsValid}
                isInvalid={emailIsInvalid}
                onKeyUp={onChange}
                onChange={onChange}
                name="email"
                readOnly={false}
                placeholder="E-Mail"
                aria-label="E-Mail"
              />
            </InputGroup>
            <Row>
              <Col>
                <FormControl
                  value={user.password}
                  isValid={passwordEqual}
                  isInvalid={passwordEqual === null ? null : !passwordEqual}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="password"
                  type="password"
                  readOnly={false}
                  placeholder="Password"
                  aria-label="Password"
                />
              </Col>
              <Col>
                <FormControl
                  value={user.passwordConfirm}
                  isValid={passwordEqual}
                  isInvalid={passwordEqual === false}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="passwordConfirm"
                  type="password"
                  readOnly={false}
                  placeholder="Password Confirm"
                  aria-label="Password Confirm"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <ul id="password_check">
                  <li
                    className={
                      pw_sec.characters ? "text-success" : "text-danger"
                    }
                  >
                    {pw_min_length} characters{" "}
                    {pw_sec.characters ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </li>
                  <li
                    className={
                      pw_sec.lowercase ? "text-success" : "text-danger"
                    }
                  >
                    lowercase{" "}
                    {pw_sec.lowercase ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </li>
                  <li
                    className={
                      pw_sec.uppercase ? "text-success" : "text-danger"
                    }
                  >
                    uppercase{" "}
                    {pw_sec.uppercase ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </li>
                  <li
                    className={pw_sec.number ? "text-success" : "text-danger"}
                  >
                    number{" "}
                    {pw_sec.number ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </li>
                  <li
                    className={
                      pw_sec.special_character ? "text-success" : "text-danger"
                    }
                  >
                    special_character{" "}
                    {pw_sec.special_character ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </li>
                </ul>
              </Col>
            </Row>
            <hr />
            <small>Personal Data</small>
            <Row className="mb-3">
              <Col>
                <FormControl
                  value={user.lastName}
                  isValid={user.lastName !== null && user.lastName !== ""}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="lastName"
                  readOnly={false}
                  placeholder="Last Name"
                  aria-label="Last Name"
                />
              </Col>
              <Col>
                <FormControl
                  value={user.firstName}
                  isValid={user.firstName !== null && user.firstName !== ""}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="firstName"
                  readOnly={false}
                  placeholder="First Name"
                  aria-label="First Name"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <FormControl
                  value={user.street}
                  isValid={user.street !== null && user.street !== ""}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="street"
                  readOnly={false}
                  placeholder="Street"
                  aria-label="Street"
                />
              </Col>
              <Col sm={{ span: "2" }}>
                <FormControl
                  value={user.house}
                  isValid={user.house !== null && user.house !== ""}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="house"
                  readOnly={false}
                  placeholder="House No."
                  aria-label="House No."
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={{ span: "3" }}>
                <FormControl
                  value={user.postal}
                  isValid={user.postal !== null && user.postal !== ""}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="postal"
                  readOnly={false}
                  placeholder="Postcode"
                  aria-label="Postcode"
                />
              </Col>
              <Col>
                <FormControl
                  value={user.town}
                  isValid={user.town !== null && user.town !== ""}
                  onKeyUp={onChange}
                  onChange={onChange}
                  name="town"
                  readOnly={false}
                  placeholder="Town"
                  aria-label="Town"
                />
              </Col>
            </Row>
            {renderRedirect()}
            <Button disabled={submitDisabled} variant="primary" type="submit">
              <RiMailSendLine /> Create Account
            </Button>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};
export { Register };
