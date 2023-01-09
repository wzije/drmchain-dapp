import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Alert } from "../../utils/ModalUtil";
import { Decrypt } from "../../utils/Security";
import axios from "axios";
const fileProxyEndPoint = "http://127.0.0.1:8080";

const ReadDialog = (props: any) => {
  const [show, setShow] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleVerify = async () => {
    if (privateKey === "") {
      Alert("Private key required");
      return;
    }

    //memanggil data dari BC
    const hashDocument = await props.contract.methods
      .getDocument()
      .call({ from: props.owner });

    if (!hashDocument) {
      Alert("Load document failed.");
      return;
    }

    const hashFile = await Decrypt(hashDocument, privateKey);

    await axios({
      method: "post",
      url: `${fileProxyEndPoint}/get`,
      data: { hash: hashFile.hash },
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        var file = new Blob([response.data], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        props.onSetDocumentFile(fileURL);
        handleClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Button
        className="btn btn-sm btn-success"
        style={{ padding: "5px 30px" }}
        onClick={handleShow}
      >
        Read Book
      </Button>
      <Form>
        <Modal
          size="xl"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reading Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formInputprivateKey">
              <Form.Label>Your Private Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your secret key"
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" className="btn" onClick={handleVerify}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </>
  );
};

export default ReadDialog;
