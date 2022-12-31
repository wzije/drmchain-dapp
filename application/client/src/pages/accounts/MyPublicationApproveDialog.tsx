import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
const EthCrypto = require("eth-crypto");

const MyPublicationApproveDialog = (props: any) => {
  const [show, setShow] = useState(false);
  const [secretKey, setSecretKey] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    const document = props.document;

    // hash document
    const hashDocument = EthCrypto.hash.keccak256(
      document + props.owner.slice(2) + props.subscriberAddress.slice(2)
    );

    //create signature
    const signature = EthCrypto.sign(secretKey, hashDocument);

    const payload = {
      document: document,
      hashDocument: hashDocument,
      signature,
    };

    const payloadString = JSON.stringify(payload);

    //encrypt
    const encrypted = await EthCrypto.encryptWithPublicKey(
      props.subscriberKey,
      payloadString
    );

    //encrypt to string
    const encryptedString = EthCrypto.cipher.stringify(encrypted);

    console.info(encryptedString);

    const tx = await props.contract.methods
      .approveSubscription(props.subscriberAddress, encryptedString)
      .send({ from: props.owner });

    console.info(tx);
    // window.location.reload();
  };

  return (
    <>
      <Button className="btn btn-sm btn-warning" onClick={handleShow}>
        Distribute
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Approve Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formInputSecretKey">
              <Form.Label>Your Secret Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your secret key"
                onChange={(e) => {
                  setSecretKey(e.target.value);
                }}
              />
            </Form.Group>
            <hr />
            <hr className="hr-text" data-content="Subscriber Attribute" />
            <Form.Group className="mb-3" controlId="formInputSecretKey">
              <Form.Label>Account</Form.Label>
              <Form.Control
                type="text"
                placeholder="Account Address"
                defaultValue={props.subscriberAddress}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formInputSecretKey">
              <Form.Label>Public Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Public Key"
                defaultValue={props.subscriberKey}
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

export default MyPublicationApproveDialog;
