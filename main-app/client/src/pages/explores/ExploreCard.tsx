import React from "react";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import SubscribeDialog from "./DialogRequestOwner";
import "./css/Card.css";
import { Link } from "react-router-dom";
import Web3Util from "../../utils/Web3Util";

const BookContract = require("../../contracts/Book.json");

const BookCard = (prop: any) => {
  const book = prop.data;

  const [isOwner, setIsOwner] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, setContract] = useState<any>();

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

        console.info(accounts[0]);

        const title = await contract.methods.title().call();
        const author = await contract.methods.author().call();
        const publisher = await contract.methods.publisher().call();
        const releaseDate = await contract.methods.releaseDate().call();
        const isbn = await contract.methods.isbn().call();
        const description = await contract.methods.description().call();
        const owner = await contract.methods.owner().call();
        const cover = await contract.methods.cover().call();

        setContract(contract);
        setAccount(accounts[0]);
        setOwner(owner);

        if (owner === accounts[0]) {
          setIsOwner(true);
        }

        const isRequested = await contract.methods
          .isRequested()
          .call({ from: accounts[0] });

        setIsRequested(isRequested);

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

    if (book.address !== "") {
      init(book.address);
    }
  }, [book.address]);

  return (
    <Card className="shadow">
      <Card.Img variant="top" src={`/img/${cover}`} />
      <Card.Body className="p-0 m-0 card-img-overlay">
        <div className="p-2" style={{ background: "white", opacity: "0.9" }}>
          <h4 className="card-title">{title}</h4>
          <div className="meta card-text">{author}</div>
          <div className="card-text">{description.slice(0, 70)}...</div>
          <div className="mt-3 text-end">
            <Link
              to={`/explores/${book.address}`}
              className="btn btn-success float-right btn-sm rounded-0"
            >
              More
            </Link>
            {!isOwner ? (
              !isRequested ? (
                <SubscribeDialog
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
                className={`btn float-right btn-sm rounded-0 btn-secondary`}
                disabled
              >
                Yours
              </button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
