import React, { useEffect } from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { Viewer, Worker, DocumentLoadEvent } from "@react-pdf-viewer/core";
import axios from "axios";
import moment from "moment";
import { Encrypt, GetPublicKey } from "../../utils/Security";
import {
  toolbarPlugin,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { Alert, Success } from "../../utils/ModalUtil";

// CSS
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./css/BookCreate.css";
import Web3Util from "../../utils/Web3Util";

// register contract
const BookFactoryContract = require("../../contracts/BookFactory.json");

// PDF VIEWER CONFIG
const workerUrl = require("pdfjs-dist/build/pdf.worker.entry");

declare let window: any;
const BookCreate = () => {
  const fileProxyEndPoint = process.env.REACT_APP_FILEPROXY_ENDPOINT;

  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [privateKey, setPrivateKey] = useState("");
  const [title, setTitle] = useState("Abandoned Kingdom");
  const [author, setAuthor] = useState("Claudia Wilson");
  const [authorAccount, setAuthorAccount] = useState("");
  const [publisher, setPublisher] = useState("Master Media");
  const [releaseDate, setReleaseDate] = useState(moment().format("YYYY-MM-DD"));
  const [isbn, setISBN] = useState("B0813PLG15");
  const [description, setDescription] =
    useState(`Freya McNabb was running for her life. Her brother and father wanted her to marry an evil man. They wanted it so much that her father had her beat in public each time she said not. Finally, enough was enough and she made her escape. She found herself in a cottage which was going to change her life forever. She only had to want to believe that not all were like her father and her brother.
  Conner McClure had vowed he would never marry. He hadn't met a woman that made him want to marry. He and his party of hunters arrived at the hunting cottage, where they found a tiny woman who had been beaten and was unconscious on the floor.
  Conner nursed her wounds and found she moved his soul. She was going to be his wife he decided, but only if they could face all the perils that awaited ahead. Would their love be strong enough to withstand the tests that lay before them or would it be destroyed forever.`);
  const [cover, setCover] = useState("abandon-kingdom.png");
  const [meta, setMeta] = useState("");
  const [files, setFiles] = useState<{ file?: File; url: string }>({ url: "" });

  // pdf plugin config
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
      const web3 = Web3Util();
      const networkID = await web3.eth.net.getId();
      const { abi } = BookFactoryContract;
      let address = BookFactoryContract.networks[networkID].address;
      let contract = new web3.eth.Contract(abi, address);
      setContract(contract);

      const accounts = await web3.eth.getAccounts();

      setAccount(accounts[0]);
      setAuthorAccount(accounts[0]);
    };

    init();
  }, []);

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
    try {
      event.preventDefault();

      // validasi eksistensi variabel file
      if (files.file === undefined) return;

      // deklarasi variabel file
      const file: File = files.file;

      // membuat objek formdata
      var formData = new FormData();

      // membuat / mengisi data yang dibutuhkan dalam format json
      const jsonMetaData = {
        title: title,
        author: author,
        author_account: authorAccount,
        publisher: publisher,
        releaseDate: releaseDate,
        isbn: isbn,
        cover: cover,
      };

      // memasukkan nilai formdata
      formData.append("metadata", JSON.stringify(jsonMetaData));
      formData.append("document", file);

      // inisialisasi nilai hashFile
      let hashFile = "";

      // proses pengiriman data dan file ke aplikasi File-Proxy
      var uploadError = false;

      await axios
        .post(`${fileProxyEndPoint}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // memasukkan hash file setelah proses pengiriman data berhasil
          // jika tidak berhasil, akan ditampilkan ke log
          if (response.status === 200) hashFile = response.data;
          else uploadError = true;
        })
        .catch((error) => {
          Alert(error.message);
          uploadError = true;
        });

      if (uploadError) return;

      // proses enkripsi hashfile menggunakan konci publik pengguna
      let encryptedHash = await Encrypt(
        hashFile,
        GetPublicKey(privateKey, account)
      );

      // validasi jika proses enkripsi gagal
      if (!encryptedHash) Alert("encryption process failed.");

      // mengirim data ke Smart Contract / menyimpan data dalam blockchain
      const tx = await contract.methods
        .createBook(
          title,
          author,
          authorAccount,
          publisher,
          releaseDate,
          isbn,
          cover,
          description,
          encryptedHash
        )
        .send({ from: account, gas: "5500000" });

      console.info(tx);

      _resetForm();

      Success("Book Created").then((result) => {
        if (result.isConfirmed) window.location.href = "/mybooks";
      });

      // masuk ke halaman mybooks
    } catch (error) {
      console.log(error);
    }
  };

  const _resetForm = () => {
    setTitle("Abandoned Kingdom");
    setAuthor("Claudia Wilson");
    setAuthorAccount("");
    setPublisher("Master Media");
    setReleaseDate(moment().format("YYYY-MM-DD"));
    setISBN("B0813PLG15");
    setDescription(`Freya McNabb was running for her life. Her brother and father wanted her to marry an evil man. They wanted it so much that her father had her beat in public each time she said not. Finally, enough was enough and she made her escape. She found herself in a cottage which was going to change her life forever. She only had to want to believe that not all were like her father and her brother.
    Conner McClure had vowed he would never marry. He hadn't met a woman that made him want to marry. He and his party of hunters arrived at the hunting cottage, where they found a tiny woman who had been beaten and was unconscious on the floor.
    Conner nursed her wounds and found she moved his soul. She was going to be his wife he decided, but only if they could face all the perils that awaited ahead. Would their love be strong enough to withstand the tests that lay before them or would it be destroyed forever.`);
    setCover("abandon-kingdom.png");
    setMeta("");
    setFiles({ url: "" });
  };

  return (
    <div className=" mb-5">
      <h3>New Publication</h3>
      <hr />
      <div className="pb-3"></div>
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
            <Form.Group className="mb-3" controlId="BookForm.ControlAuthor">
              <Form.Label>Author Account</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={authorAccount}
                onChange={(e) => setAuthorAccount(e.target.value)}
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
            <Form.Group className="mb-3" controlId="BookForm.ControlAuthor">
              <Form.Label>Private Key</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                required
              />
            </Form.Group>
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
              {files.url ? (
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
    </div>
  );
};

export default BookCreate;
