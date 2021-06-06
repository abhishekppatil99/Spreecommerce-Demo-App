import { useState } from "react";
import { Button, Modal, InputGroup, Form, FormControl } from "react-bootstrap";
import { RiMailSendLine, RiMailLine } from "react-icons/ri";
import React from "react";
import { validateEmail } from "../helper/validateEmail";

const LostPassword = () => {
  const [email, setEmail] = useState("");
  const [valid, setValidation] = useState(null);
  const [alert, setAlert] = useState([]);
  let isValid = null;
  let isInvalid = null;
  if (valid != null) {
    isValid = valid;
    isInvalid = !valid;
  }
  // TODO: Implement API Endpoint
  if (alert.length) {
    setTimeout(() => {
      setAlert([]);
    }, 3 * 1000);
  }
  const onChange = (e) => {
    setEmail(e.target.value);
    setValidation(validateEmail(e.target.value));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setAlert([{ type: "success", text: "The E-Mail has been sent." }]);
      setEmail("");
      setValidation(null);
    }
  };
  return (
    <div className="container">
      {alert.map((alert, ai) => (
        <div key={"alert-" + ai} className={"alert alert-" + alert.type}>
          {alert.text}
        </div>
      ))}
      <Modal.Dialog size="xl">
        <Modal.Header>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} method="POST" action="/">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="login-id-username">
                  <RiMailLine />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                isValid={isValid}
                isInvalid={isInvalid}
                onKeyPress={onChange}
                onChange={onChange}
                value={email}
                readOnly={false}
                placeholder="E-Mail"
                aria-label="E-Mail"
                aria-describedby="login-id-username"
              />
            </InputGroup>
            <Button
              disabled={isInvalid || isInvalid == null}
              variant="primary"
              type="submit"
            >
              <RiMailSendLine /> Reset Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};
export { LostPassword };
