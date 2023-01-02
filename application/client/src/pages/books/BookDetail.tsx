import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import Web3 from "web3";
import AcceptDialog from "./DialogAccept";
import ReadDialog from "./DialogReadConfirm";
import { Alert } from "../../utils/AlertUtil";
import PDFViewer from "./PDFVIewer";

const publicationContract = require("../../contracts/Publication.json");

const BookDetail = () => {
  let { address } = useParams();
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [owner, setOwner] = useState<any>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [request, setRequest] = useState<{
    account: String;
    publicKey: string;
  }>({ account: "", publicKey: "" });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toString());
  const [isbn, setISBN] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState("");
  const [documentFile, setDocumentFile] = useState("");

  useEffect(() => {
    const init = async (address: any) => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const { abi } = publicationContract;
        const contract = new web3.eth.Contract(abi, address);
        const accounts = await web3.eth.getAccounts();
        const owner = await contract.methods.owner().call();

        if (owner !== accounts[0]) {
          Alert("the book is't yours");
          window.location.href = "/mybooks";
        }

        const title = await contract.methods.title().call();
        const author = await contract.methods.author().call();
        // const authorAccount = await contract.methods.authorAccount().call();
        const publisher = await contract.methods.publisher().call();
        const releaseDate = await contract.methods.releaseDate().call();
        const isbn = await contract.methods.isbn().call();
        const cover = await contract.methods.cover().call();
        const description = await contract.methods.description().call();

        if (accounts[0] === owner) {
          const document = await contract.methods
            .getDocument()
            .call({ from: owner });

          setDocument(document);
          setIsOwner(true);
        }

        setContract(contract);
        setAccount(accounts[0]);
        setOwner(owner);

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
              console.info(resp);
              setRequest({
                account: resp[0],
                publicKey: resp[1],
              });
            })
            .catch((error: any) => {
              console.log(error);
            });

          console.info(request, "request");
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (address) init(address);
  }, [address]);

  const handleRead = (fileURL: string) => {
    setDocumentFile(fileURL);
    console.info(fileURL, "blabateuhtehuteoalea");
  };

  const displayDocument = (): any => {
    console.info("run display");
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
                        customerAccount={request.account}
                        customerPublicKey={request.publicKey}
                        documentHash={document}
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
              account={account}
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
      <div className="document-viewer">{displayDocument()}</div>
    </>
  );
};

export default BookDetail;
