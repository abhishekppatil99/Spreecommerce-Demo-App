import React, { useState } from "react";
import { Row, Col, FormControl, Button, Card } from "react-bootstrap";
import { Profile } from "./Profile";
import { FaSave } from "react-icons/fa";
import { validateEmail } from "../helper/validateEmail";
import { passwordStrength, pw_min_length } from "../helper/passwordStrength";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

const ProfileEditAccount = () => {
  // TODO: Implement API
  const [email, setEmail] = useState({
    email: "",
    email_confirm: "",
    email_valid: null,
    email_confirm_valid: null,
    btn_disabled: true,
  });
  const onChangeEmail = (e) => {
    const d = {};
    d[e.target.name] = e.target.value;
    d[e.target.name + "_valid"] = validateEmail(e.target.value);
    d["btn_disabled"] = !(
      email.email !== "" &&
      email.email === email.email_confirm &&
      email.email_valid
    );
    setEmail({ ...email, ...d });
  };
  const updateEmail = () => {
    setEmail({
      email: "",
      email_confirm: "",
      email_valid: null,
      email_confirm_valid: null,
      btn_disabled: true,
    });
  };

  const [password, setPassword] = useState({
    password: "",
    password_confirm: "",
    password_valid: null,
    password_confirm_valid: null,
    btn_disabled: true,
  });
  const onChangePassword = (e) => {
    const d = {};
    d[e.target.name] = e.target.value;
    const strength = passwordStrength(e.target.value);
    d[e.target.name + "_valid"] =
      strength.characters &&
      strength.lowercase &&
      strength.uppercase &&
      strength.number &&
      strength.special_character;
    d["btn_disabled"] = !(
      password.password !== "" &&
      password.password === password.password_confirm &&
      password.password_valid
    );
    setPassword({ ...password, ...d });
  };
  const updatePassword = () => {
    setPassword({
      password: "",
      password_confirm: "",
      password_valid: null,
      password_confirm_valid: null,
      btn_disabled: true,
    });
  };
  const pw_sec = passwordStrength(password.password);

  return (
    <Profile>
      <Card>
        <Card.Header>change E-Mail</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <FormControl
                isValid={email.email_valid === true}
                isInvalid={email.email_valid === false}
                value={email.email}
                onKeyUp={onChangeEmail}
                onChange={onChangeEmail}
                name="email"
                readOnly={false}
                placeholder="new E-Mail"
                aria-label="new E-Mail"
              />
            </Col>
            <Col>
              <FormControl
                isValid={email.email_confirm_valid === true}
                isInvalid={email.email_confirm_valid === false}
                value={email.email_confirm}
                onKeyUp={onChangeEmail}
                onChange={onChangeEmail}
                name="email_confirm"
                readOnly={false}
                placeholder="E-Mail confirm"
                aria-label="E-Mail confirm"
              />
            </Col>
            <Col sm="2">
              <Button
                disabled={email.btn_disabled}
                onClick={() => {
                  updateEmail();
                }}
                block
              >
                <FaSave /> Save
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Header>change Password</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <FormControl
                isValid={password.password_valid === true}
                isInvalid={password.password_valid === false}
                value={password.password}
                onKeyUp={onChangePassword}
                onChange={onChangePassword}
                name="password"
                type="password"
                readOnly={false}
                placeholder="new Password"
                aria-label="new Password"
              />
            </Col>
            <Col>
              <FormControl
                isValid={password.password_confirm_valid === true}
                isInvalid={password.password_confirm_valid === false}
                value={password.password_confirm}
                onKeyUp={onChangePassword}
                onChange={onChangePassword}
                name="password_confirm"
                type="password"
                readOnly={false}
                placeholder="Password confirm"
                aria-label="Password confirm"
              />
            </Col>
            <Col sm="2">
              <Button
                disabled={password.btn_disabled}
                onClick={() => {
                  updatePassword();
                }}
                block
              >
                <FaSave /> Save
              </Button>
            </Col>
          </Row>
          <ul id="password_check">
            <li className={pw_sec.characters ? "text-success" : "text-danger"}>
              {pw_min_length} characters{" "}
              {pw_sec.characters ? (
                <ImCheckboxChecked />
              ) : (
                <ImCheckboxUnchecked />
              )}
            </li>
            <li className={pw_sec.lowercase ? "text-success" : "text-danger"}>
              lowercase{" "}
              {pw_sec.lowercase ? (
                <ImCheckboxChecked />
              ) : (
                <ImCheckboxUnchecked />
              )}
            </li>
            <li className={pw_sec.uppercase ? "text-success" : "text-danger"}>
              uppercase{" "}
              {pw_sec.uppercase ? (
                <ImCheckboxChecked />
              ) : (
                <ImCheckboxUnchecked />
              )}
            </li>
            <li className={pw_sec.number ? "text-success" : "text-danger"}>
              number{" "}
              {pw_sec.number ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
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
        </Card.Body>
      </Card>
    </Profile>
  );
};
export { ProfileEditAccount };
