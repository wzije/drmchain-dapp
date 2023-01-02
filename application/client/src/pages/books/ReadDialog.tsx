import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  toolbarPlugin,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import Alert from "../../utils/AlertUtil";
const EthCrypto = require("eth-crypto");
const workerUrl = require("pdfjs-dist/build/pdf.worker.entry");
const dedicatedIPFSURL = "https://wzije.infura-ipfs.io/ipfs";

const MyPublicationReadDialog = (props: any) => {
  const [show, setShow] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [document, setDocument] = useState("");

  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    SwitchTheme: () => <></>,
    Print: () => <></>,
    Open: () => <></>,
    ShowSearchPopover: () => <></>,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleVerify = async () => {
    if (secretKey === "") {
      console.log("secret key is empty");
      return;
    }

    //memanggil data dari BC
    const result = await props.contract.methods
      .getDocumentCopy()
      .call({ from: props.account });

    const encryptedObject = EthCrypto.cipher.parse(result.documentCopy);

    const decrypted = await EthCrypto.decryptWithPrivateKey(
      secretKey,
      encryptedObject
    );

    const decryptedPayload = JSON.parse(decrypted);

    // check signature
    const senderAddress = EthCrypto.recover(
      decryptedPayload.signature,
      decryptedPayload.hashDocument
    );

    if (senderAddress === props.owner) {
      console.log(
        "Got message from " + senderAddress + ": " + decryptedPayload.document
      );

      setDocument(decryptedPayload.document);
    } else {
      Alert("salah");
    }
    //get document
  };

  const displayDocument = () => {
    if (document !== undefined && document !== "") {
      return (
        <Worker workerUrl={workerUrl}>
          <div
            className="shadow"
            style={{ height: "600px", background: "#f4f4f4" }}
          >
            <>
              <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
              <Viewer
                fileUrl={`${dedicatedIPFSURL}/${document}`}
                theme="dark"
                plugins={[toolbarPluginInstance]}
              />
            </>
          </div>
        </Worker>
      );
    }
    return;
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

      <Modal
        size="lg"
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
            <Button
              variant="success"
              className="btn btn-sm"
              onClick={handleVerify}
            >
              Verify & Read
            </Button>
          </Form>
          <div className="document-viewer">{displayDocument()}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyPublicationReadDialog;
