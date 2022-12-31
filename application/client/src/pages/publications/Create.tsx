import React, { useEffect } from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { Viewer, Worker, DocumentLoadEvent } from "@react-pdf-viewer/core";
import {
  toolbarPlugin,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { create, CID } from "ipfs-http-client";
import Web3 from "web3";

// CSS
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./css/Create.css";

// contract
const FactoryContract = require("../../contracts/PublicationFactory.json");

// PDF VIEWER CONFIG
const workerUrl = require("pdfjs-dist/build/pdf.worker.entry");

//IPFS CONFIG
const projectId = "2HLQVCRYTp1mvSFjZhErcumtT4C";
const projectSecret = "185b74165b211e96cfc7b54554ac0360";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
// const dedicatedIPFSURL = "https://wzije.infura-ipfs.io/ipfs";
const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});

// referensi formulir
// https://indonesia.go.id/kategori/kepabeanan/431/cara-mengurus-hak-cipta?lang=1
const PublicationCreate = () => {
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toString());
  const [isbn, setISBN] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [meta, setMeta] = useState(null);
  const [files, setFiles] = useState<{
    file?: File;
    url: string;
    cid?: CID;
  }>({
    url: "",
  });

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

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
      const networkID = await web3.eth.net.getId();
      const { abi } = FactoryContract;
      let address = FactoryContract.networks[networkID].address;
      let contract = new web3.eth.Contract(abi, address);
      setContract(contract);

      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    };

    init();
  }, []);

  // HANDLER;
  const handleDocumentLoad = (o: DocumentLoadEvent) => {
    o.doc.getMetadata().then((metadata: any) => {
      setMeta(metadata.info);
      console.info(meta);
    });
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const _files: FileList = e.currentTarget.files as FileList;

    if (!_files || _files.length === 0) {
      return alert("No files selected");
    }

    setFiles({
      file: _files[0],
      url: URL.createObjectURL(_files[0]),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (files.file === undefined) return;

    const file: File = files.file;

    // upload files
    const result = await ipfs.add(file);

    const tx = await contract.methods
      .createPublication(
        title,
        author,
        publisher,
        releaseDate,
        isbn,
        cover,
        description,
        result.path
      )
      .send({ from: account });

    // files.cid = result.cid;
    // files.url = `${dedicatedIPFSURL}/${result.path}`;
    // setFiles(files);

    form.reset();

    console.info(tx, file, result, "result");
    window.location.href = "/explores";
  };

  return (
    <div className=" mb-5">
      <h3>New Publication</h3>
      <hr />
      <div className="pb-3"></div>
      {ipfs ? (
        <div className="row">
          <div className="col-md-5">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 file-upload">
                <Form.Label
                  style={{ cursor: "pointer", padding: "10px", margin: "0" }}
                >
                  Select Document (PDF) <Icon icon={faCloudUpload} />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadChange}
                    required
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3" controlId="BookForm.ControlTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="BookForm.ControlAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="BookForm.ControlTitle">
                <Form.Label>Penerbit</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="BookForm.ControlAuthor">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={isbn}
                  onChange={(e) => setISBN(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="BookForm.ControlReleaseDate"
              >
                <Form.Label>Release Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder=""
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="BookForm.ControlCover">
                <Form.Label>Cover</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="bookForm.ControlDescription"
              >
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <hr />
              <Button
                type="submit"
                className="rounded mb-5 text-center"
                style={{
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "14pt",
                  padding: "10px 30px",
                }}
              >
                Publish
              </Button>
            </Form>
          </div>
          <div className="col-md-6 offset-1">
            <Worker workerUrl={workerUrl}>
              <div
                className="shadow"
                style={{ height: "600px", background: "#f4f4f4" }}
              >
                {ipfs && files.url ? (
                  <>
                    <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                    <Viewer
                      fileUrl={files ? files.url : ""}
                      theme="dark"
                      plugins={[toolbarPluginInstance]}
                      onDocumentLoad={handleDocumentLoad}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      alignItems: "center",
                      border: "1px dashed rgba(0, 0, 0, .3)",
                      display: "flex",
                      fontSize: "2rem",
                      height: "100%",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    Preview Document
                  </div>
                )}
              </div>
            </Worker>
          </div>
        </div>
      ) : (
        <>IPFS CONFIG NOT FOUND</>
      )}
    </div>
  );
};

export default PublicationCreate;
