import React, { useState } from "react";
import { FormControl, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const SearchForm = (props) => {
  // TODO: Implement search functions with API
  const [search_term, updateSearch] = useState("");
  const onChange = (e) => {
    updateSearch(e.target.value);
  };
  return (
    <Modal show={props.show} onHide={props.handleHide} size="xl">
      <Modal.Body>
        <Form>
          <FormControl
            ref={React.createRef()}
            onLoad={(e) => {
              if (props.show) {
                e.focus();
              }
            }}
            autoFocus={props.show}
            onKeyUp={onChange}
            onChange={onChange}
            type="text"
            readOnly={false}
            placeholder="Search..."
            aria-label="Search..."
          />
          <Link to={`/shop/search/${search_term}`}>
            <button
              style={{
                backgroundColor: "black",
                borderColor: "black",
                marginTop: "20px",
                width: "150px",
                borderRadius: "40px",
                color: "white",
                height: "40px",
                alignSelf: "center",
                marginLeft: "45%",
              }}
              type="submit"
              onClick={props.handleHide}
            >
              Search
            </button>
          </Link>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export { SearchForm };
