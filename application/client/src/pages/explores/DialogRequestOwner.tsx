import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { Success, Alert } from "../../utils/ModalUtil";
import { GetPublicKey } from "../../utils/Security";

const SubscribeDialog = (props: any) => {
  const [show, setShow] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    //publickey from secretkey
    if (privateKey === "") {
      Alert("private key is required");
      return;
    }

    try {
      // mendapatkan kunci publik dari kunci privat pengguna
      const publicKey = GetPublicKey(privateKey);

      // membuat permintaan hak kepemilikan pada kontrak
      const tx = await props.contract.methods
        .requestOwner(publicKey)
        .send({ from: props.account });

      console.info(tx);

      Success("The book is Requested").then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/myrequests";
        }
      });

      setShow(false);

      // window.location.href = "/myrequests";
    } catch (error: any) {
      console.info(error);
      return;
    }

    // window.location.reload();
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
