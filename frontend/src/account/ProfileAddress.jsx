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

const ProfileAddress = () => {
  // TODO: Implement API
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      primary: true,
      street: "SomeStreet",
      house: "69",
      post: "1337",
      town: "SomeTown",
    },
    {
      id: "2",
      primary: false,
      street: "SomeStreet",
      house: "69",
      post: "1337",
      town: "SomeTown",
    },
  ]);
  const [modalItem, setModalItem] = useState({
    id: "",
    street: "",
    house: "",
    post: "",
    town: "",
    primary: false,
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const editItem = (item) => {
    setModalItem(item);
    setShow(true);
  };
  const onChange = (e) => {
    let updatedItem = {};
    updatedItem[e.target.name] = e.target.value;
    // @ts-ignore
    setModalItem({ ...modalItem, ...updatedItem });
  };
  const handleSave = () => {
    setShow(false);
    const items = addresses;
    if (modalItem.id === "") {
      const item = modalItem;
      let lastID = items.length ? parseInt(items[items.length - 1].id) : 0;
      item.id = (lastID + 1).toString();
      items.push(item);
    } else {
      for (let i = 0; i < items.length; i++) {
        if (modalItem.id === items[i].id) {
          items[i] = modalItem;
          break;
        }
      }
    }
    setAddresses(items);
    resetModal();
  };
  const newItem = () => {
    resetModal();
    setShow(true);
  };
  const deleteItem = (item) => {
    const items = addresses;
    for (let i = 0; i < items.length; i++) {
      if (item.id === items[i].id) {
        items.splice(i, 1);
        break;
      }
    }
    setAddresses(items);
    resetModal();
  };
  const resetModal = () =>
    setModalItem({
      id: "",
      street: "",
      house: "",
      post: "",
      town: "",
      primary: false,
    });
  const setAsPrimary = () => {
    const items = addresses;
    for (let i = 0; i < items.length; i++) {
      if (modalItem.id === items[i].id) {
        items[i].primary = true;
      } else {
        items[i].primary = false;
      }
    }
    setAddresses(items);
    resetModal();
  };
  const PrimaryPopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Primary Address</Popover.Title>
      <Popover.Content>
        Do you want to set this Address as your primary one?
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
          Your Addresses
          <Button
            className="float-right"
            onClick={() => newItem()}
            variant="primary"
          >
            New Address
          </Button>
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {addresses.length ? (
              ""
            ) : (
              <Alert variant="danger">
                You don't have any address set! Before ordering something you
                need to add an address!
                <br />
                <br />
                <Button onClick={() => newItem()} variant="outline-danger">
                  Add Address now
                </Button>
              </Alert>
            )}
            {addresses.map((item) => {
              return (
                <ListGroup.Item key={item.id}>
                  {item.primary ? (
                    <AiFillStar />
                  ) : (
                    <OverlayTrigger
                      onToggle={(e) => {
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
                  {item.street} {item.house} - {item.post} {item.town}
                  <ButtonGroup className="float-right">
                    <Button
                      onClick={() => {
                        editItem(item);
                      }}
                      variant="outline-warning"
                      size="sm"
                    >
                      Edit
                    </Button>
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
          <Modal.Title>Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <FormControl
                value={modalItem.street}
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
                value={modalItem.house}
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
                value={modalItem.post}
                onKeyUp={onChange}
                onChange={onChange}
                name="post"
                readOnly={false}
                placeholder="Postcode"
                aria-label="Postcode"
              />
            </Col>
            <Col>
              <FormControl
                value={modalItem.town}
                onKeyUp={onChange}
                onChange={onChange}
                name="town"
                readOnly={false}
                placeholder="Town"
                aria-label="Town"
              />
            </Col>
          </Row>
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
export { ProfileAddress };
