import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import RequestDialog from "./DialogRequestOwner";
import Web3Util from "../../utils/Web3Util";
import LogPrinter from "../loggers/LogPrinter";
const BookContract = require("../../contracts/Book.json");

const Detail = () => {
  let { address } = useParams();
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [owner, setOwner] = useState<any>();
  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toString());
  const [isbn, setISBN] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const init = async (address: any) => {
      try {
        const web3 = Web3Util();
        const { abi } = BookContract;
        const contract = new web3.eth.Contract(abi, address);
        const accounts = await web3.eth.getAccounts();
        const owner = await contract.methods.owner().call();

        const title = await contract.methods.title().call();
        const author = await contract.methods.author().call();
        const publisher = await contract.methods.publisher().call();
        const releaseDate = await contract.methods.releaseDate().call();
        const isbn = await contract.methods.isbn().call();
        const cover = await contract.methods.cover().call();
        const description = await contract.methods.description().call();

        const isRequested = await contract.methods
          .isRequested()
          .call({ from: accounts[0] });

        setIsRequested(isRequested);

        setContract(contract);
        setAccount(accounts[0]);
        setIsOwner(accounts[0] === owner);
        setOwner(owner);
        setTitle(title);
        setAuthor(author);
        setPublisher(publisher);
        setReleaseDate(releaseDate);
        setISBN(isbn);
        setCover(cover);
        setDescription(description);
      } catch (err) {
        console.log(err);
      }
    };

    if (address) {
      init(address);
    }
  }, [address]);

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
        <br />
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
            </tbody>
          </Table>
          <div>
            {!isOwner ? (
              !isRequested ? (
                <RequestDialog
                  title={title}
                  author={author}
                  publisher={publisher}
                  isbn={isbn}
                  releaseDate={releaseDate}
                  contract={contract}
                  account={account}
                  owner={owner}
                />
              ) : (
                <button
                  className={`btn float-right btn-sm rounded-0 btn-warning`}
                  disabled
                >
                  Requested
                </button>
              )
            ) : (
              <button
                onClick={() => (window.location.href = `/mybooks/${address}`)}
                className={`btn float-right btn-sm rounded-0 btn-primary`}
                style={{ padding: "5px 30px" }}
              >
                Go To Detail
              </button>
            )}
          </div>
        </div>
        <br />
        <div>
          <hr />
          {contract ? (
            <LogPrinter contract={contract} bookContract={BookContract} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Detail;
