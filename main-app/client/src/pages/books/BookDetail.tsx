import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import AcceptDialog from "./DialogAccept";
import ReadDialog from "./DialogReadConfirm";
import { Alert } from "../../utils/ModalUtil";
import PDFViewer from "./PDFVIewer";
import Web3Util from "../../utils/Web3Util";
import LogPrinter from "../loggers/LogPrinter";

const bookContract = require("../../contracts/Book.json");

const BookDetail = () => {
  let { address } = useParams();
  const [contract, setContract] = useState<any>();
  const [owner, setOwner] = useState<any>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [request, setRequest] = useState<{
    account: String;
    publicKey: string;
    documentHash: string;
  }>({ account: "", publicKey: "", documentHash: "" });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toString());
  const [isbn, setISBN] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [documentFile, setDocumentFile] = useState("");

  useEffect(() => {
    const init = async (address: any) => {
      try {
        const web3 = Web3Util();
        const { abi } = bookContract;
        const contract = new web3.eth.Contract(abi, address);
        const accounts = await web3.eth.getAccounts();
        const owner = await contract.methods.owner().call();

        if (owner !== accounts[0]) {
          Alert("the book is't yours");
          window.location.href = "/mybooks";
        }

        const title = await contract.methods.title().call();
        const author = await contract.methods.author().call();
        const publisher = await contract.methods.publisher().call();
        const releaseDate = await contract.methods.releaseDate().call();
        const isbn = await contract.methods.isbn().call();
        const cover = await contract.methods.cover().call();
        const description = await contract.methods.description().call();

        if (accounts[0] === owner) setIsOwner(true);

        // master
        setContract(contract);
        setOwner(owner);

        // publication
        setTitle(title);
        setAuthor(author);
        setPublisher(publisher);
        setReleaseDate(releaseDate);
        setISBN(isbn);
        setCover(cover);
        setDescription(description);

        if (accounts[0] === owner) {
          await contract.methods
            .getRequest()
            .call({ from: owner })
            .then((resp: any) => {
              setRequest({
                account: resp[0],
                publicKey: resp[1],
                documentHash: resp[2],
              });
            })
            .catch((error: any) => {
              // console.log(error);
            });
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (address) init(address);
  }, [address]);

  const handleRead = (fileURL: string) => {
    setDocumentFile(fileURL);
  };

  const displayDocument = (): any => {
    if (documentFile !== undefined && documentFile !== "") {
      return <PDFViewer documentFile={documentFile}></PDFViewer>;
    }

    return;
  };

  return (
    <>
      <div className="row mb-5">
        <header className="mb-4">
          <h3 className="fw-bolder mb-1">{title}</h3>
        </header>
        <div className="col-md-3">
          <img
            className="img-fluid rounded"
            src={`/img/${cover}`}
            alt="..."
            style={{ width: "200px" }}
          />
        </div>
        <div className="col-md-9">
          <Table striped>
            <tbody>
              <tr>
                <th>Owner</th>
                <th>{owner}</th>
              </tr>
              <tr>
                <th>Author</th>
                <th>{author}</th>
              </tr>
              <tr>
                <th>Publisher</th>
                <th>{publisher}</th>
              </tr>
              <tr>
                <th>ISBN</th>
                <th>{isbn}</th>
              </tr>
              <tr>
                <th>Release Date</th>
                <th>{releaseDate}</th>
              </tr>
              <tr>
                <th>Summary</th>
                <th>{description}</th>
              </tr>
              <tr>
                <th>Requested</th>
                <th>
                  {request.account !== "" ? (
                    <>
                      by : {request.account} <br />
                      at: <br />
                      <br />
                      <AcceptDialog
                        owner={owner}
                        requestData={request}
                        contract={contract}
                      />
                    </>
                  ) : (
                    <i className="text-danger">No Request Found</i>
                  )}
                </th>
              </tr>
            </tbody>
          </Table>
          {isOwner ? (
            <ReadDialog
              onSetDocumentFile={handleRead}
              contract={contract}
              owner={owner}
            />
          ) : (
            <Button
              target="_blank"
              onClick={() => {
                // window.open(`${}/${document}`, "_blank");
              }}
              className="btn btn-sm btn-success"
              style={{ padding: "5px 30px" }}
            >
              Read Book
            </Button>
          )}
        </div>
      </div>
      <hr />
      {contract ? (
        <LogPrinter contract={contract} bookRawContract={bookContract} />
      ) : (
        <></>
      )}
      <hr />
      <div className="document-viewer mb-5">{displayDocument()}</div>
    </>
  );
};

export default BookDetail;
