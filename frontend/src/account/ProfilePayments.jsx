import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  ListGroup,
  Modal,
  Row,
  Col,
  FormControl,
  Alert,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { Profile } from "./Profile";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ProfilePayments = () => {
  // TODO: Implement API
  const [method, setMethods] = useState([
    {
      id: "1",
      primary: true,
      name: "PayPal",
      ending: "***@re*****ny.de",
    },
    {
      id: "2",
      primary: false,
      name: "PayPal",
      ending: "****@re*****ny.de",
    },
  ]);
  const [modalItem, setModalItem] = useState({
    id: "",
    primary: false,
    swift: "",
    owner: "",
    iban: "",
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const onChange = (e) => {
    let updatedItem = {};
    updatedItem[e.target.name] = e.target.value;
    // @ts-ignore
    setModalItem({ ...modalItem, ...updatedItem });
  };
  const handleSave = () => {
    setShow(false);
    const items = method;
    let lastID = items.length ? parseInt(items[items.length - 1].id) : 0;
    const id = (lastID + 1).toString();
    // item.name = "Bank";
    console.log(modalItem);
    items.push({
      id: id,
      primary: false,
      name: "Bank",
      ending: modalItem.iban,
    });
    setMethods(items);
    resetModal();
  };
  const newItem = () => {
    resetModal();
    setShow(true);
  };
  const deleteItem = (item) => {
    const items = method;
    for (let i = 0; i < items.length; i++) {
      if (item.id === items[i].id) {
        items.splice(i, 1);
        break;
      }
    }
    setMethods(items);
    resetModal();
  };
  const resetModal = () =>
    setModalItem({
      id: "",
      primary: false,
      swift: "",
      owner: "",
      iban: "",
    });
  const setAsPrimary = () => {
    const items = method;
    for (let i = 0; i < items.length; i++) {
      if (modalItem.id === items[i].id) {
        items[i].primary = true;
      } else {
        items[i].primary = false;
      }
    }
    setMethods(items);
    resetModal();
  };
  const PrimaryPopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Primary Payment Method</Popover.Title>
      <Popover.Content>
        Do you want to set this Method as your primary one?
        <br />
        <Button onClick={setAsPrimary} variant="primary">
          Set as Primary
        </Button>
      </Popover.Content>
    </Popover>
  );
  return (
    <Profile>
      <Card>
        <Card.Header>
          Your Payment Methods
          <Button
            className="float-right"
            onClick={() => newItem()}
            variant="primary"
          >
            Add Bank Account
          </Button>
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {method.length ? (
              ""
            ) : (
              <Alert variant="danger">
                You don't have any payment methods set! Before ordering
                something you need to add a method!
                <br />
                <br />
                <Button onClick={() => newItem()} variant="outline-danger">
                  Add Payment Method now
                </Button>
              </Alert>
            )}
            {method.map((item) => {
              return (
                <ListGroup.Item key={item.id}>
                  {item.primary ? (
                    <AiFillStar />
                  ) : (
                    <OverlayTrigger
                      onToggle={(e) => {
                        // @ts-ignore
                        if (e) setModalItem(item);
                        else resetModal();
                      }}
                      trigger="click"
                      placement="right"
                      overlay={PrimaryPopover}
                    >
                      <AiOutlineStar />
                    </OverlayTrigger>
                  )}{" "}
                  {item.name} {item.ending}
                  <ButtonGroup className="float-right">
                    <Button
                      onClick={() => {
                        deleteItem(item);
                      }}
                      variant="outline-danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bank Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Button block><SiPaypal /> auth via Paypal</Button> */}
          {/* <hr /> */}
          {/* <h6>New Bankaccount</h6> */}
          <Row className="mb-3">
            <Col>
              <FormControl
                onKeyUp={onChange}
                onChange={onChange}
                name="swift"
                readOnly={false}
                placeholder="Swift-Code"
                aria-label="Swift-Code"
              />
            </Col>
            <Col sm={{ span: "6" }}>
              <FormControl
                onKeyUp={onChange}
                onChange={onChange}
                name="name"
                readOnly={false}
                placeholder="account owner"
                aria-label="account owner"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <FormControl
                onKeyUp={onChange}
                onChange={onChange}
                name="iban"
                readOnly={false}
                placeholder="IBAN"
                aria-label="IBAN"
              />
            </Col>
          </Row>
          <small className="help-block">
            For PayPal: go to checkout, select paypal and choose your new
            account.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Profile>
  );
};
export { ProfilePayments };
