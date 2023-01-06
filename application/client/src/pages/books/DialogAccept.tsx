import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Encrypt, Decrypt } from "../../utils/Security";

const AcceptDialog = (props: any) => {
  const [show, setShow] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    // decrypt hashDocument
    let hashFile = await Decrypt(props.requestData.documentHash, privateKey);

    // encrypt with customer public key and
    let newHashDocument = await Encrypt(hashFile, props.requestData.publicKey);

    // console.info({ hashFile, newHashDocument }, "new hash");

    const tx = await props.contract.methods
      .acceptRequest(newHashDocument)
      .send({ from: props.owner });

    console.info(tx);
    window.location.reload();
  };

  return (
    <>
      <Button className="btn btn-sm btn-warning p-2" onClick={handleShow}>
        Accept Request
      </Button>

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Accept Request Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formInputSecretKey">
              <Form.Label>Your Private Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your secret key"
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                }}
              />
            </Form.Group>
            <hr />
            <hr className="hr-text" data-content="Customer Attribute" />
            <Form.Group className="mb-3" controlId="formInputSecretKey">
              <Form.Label>Customer Account</Form.Label>
              <Form.Control
                type="text"
                placeholder="Account Address"
                defaultValue={props.requestData.account}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formInputSecretKey">
              <Form.Label>Customer Public Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Public Key"
                defaultValue={props.requestData.publicKey}
                disabled
              />
            </Form.Group>
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

export default AcceptDialog;
