import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { Alert } from "../../utils/AlertUtil";
const EthCrypto = require("eth-crypto");

const SubscribeDialog = (props: any) => {
  const [show, setShow] = useState(false);
  const [secretKey, setPrivateKey] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    //publickey from secretkey
    if (secretKey === "") {
      Alert("private key is required");
      return;
    }

    const publicKey = EthCrypto.publicKeyByPrivateKey(secretKey);

    console.info(publicKey, "publickey request");

    const tx = await props.contract.methods
      .requestOwner(publicKey)
      .send({ from: props.account });

    console.info(tx);

    window.location.reload();
  };

  return (
    <>
      <Button className="btn btn-sm btn-warning rounded-0" onClick={handleShow}>
        Request Owner
      </Button>

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formInputPrivateKey">
              <Form.Label>Your Private Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your private key"
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                }}
              />
            </Form.Group>
            <hr />
            <hr className="hr-text" data-content="Publication Info" />
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Owner</td>
                  <td>{props.owner}</td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td>{props.title}</td>
                </tr>
                <tr>
                  <td>Author</td>
                  <td>{props.author}</td>
                </tr>
                <tr>
                  <td>Publisher</td>
                  <td>{props.publisher}</td>
                </tr>
                <tr>
                  <td>Release Date</td>
                  <td>{props.releaseDate}</td>
                </tr>
                <tr>
                  <td>ISBN</td>
                  <td>{props.isbn}</td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Process
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubscribeDialog;
