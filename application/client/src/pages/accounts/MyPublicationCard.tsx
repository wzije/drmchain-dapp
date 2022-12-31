import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Web3 from "web3";
import "./css/MyPublicationCard.css";

const publicationContract = require("../../contracts/Publication.json");

const MyPublicationCard = (prop: any) => {
  const publication = prop.data;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const init = async (address: any) => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const { abi } = publicationContract;
        const contract = new web3.eth.Contract(abi, address);
        const title = await contract.methods.title().call();
        const author = await contract.methods.author().call();
        const cover = await contract.methods.cover().call();
        const description = await contract.methods.description().call();

        setTitle(title);
        setAuthor(author);
        setCover(cover);
        setDescription(description);
      } catch (err) {
        console.log(err);
      }
    };

    if (publication.address) {
      init(publication.address);
    }
  }, [publication.address]);

  return (
    <Card className="shadow">
      <Card.Img variant="top" src={`/img/${cover}`} />
      <Card.Body className="p-0 m-0 card-img-overlay">
        <div className="p-2" style={{ background: "white", opacity: "0.85" }}>
          <h4 className="card-title">{title}</h4>
          <div className="meta card-text">{author}</div>
          <div className="card-text">{description.slice(0, 70)}...</div>
          <div className="mt-3 text-end">
            <Link
              to={`/me/books/${publication.address}`}
              className="btn btn-success float-right btn-sm rounded-0"
            >
              More
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MyPublicationCard;
