import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import Web3 from "web3";
import MyPublicationApproveDialog from "./MyPublicationApproveDialog";
import MyPublicationReadDialog from "./MyPublicationReadDialog";
const publicationContract = require("../../contracts/Publication.json");

const dedicatedIPFSURL = "https://wzije.infura-ipfs.io/ipfs";

const MyPublicationDetail = () => {
  let { address } = useParams();
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [owner, setOwner] = useState<any>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toString());
  const [isbn, setISBN] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState("");

  useEffect(() => {
    const init = async (address: any) => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const { abi } = publicationContract;
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

        if (accounts[0] === owner) {
          const { subscribers, addresses } = await contract.methods
            .getSubscribers()
            .call({ from: owner });

          const subscriberList: any[] = [];
          for (let i = 0; i < subscribers.length; i++) {
            subscriberList.push({
              subscriber: subscribers[i],
              address: addresses[i],
            });
          }
          setSubscribers(subscriberList);
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
      } catch (err) {
        console.log(err);
      }
    };

    if (address) {
      init(address);
    }
  }, [address]);

  const displaySubscribers = () => {
    return subscribers.map((data: any, index: number) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{data.subscriber.date}</td>
          <td>{data.address}</td>
          <td>{data.subscriber.isShared ? "Shared" : "Awaiting"}</td>
          <td>
            {!data.subscriber.isShared ? (
              <MyPublicationApproveDialog
                owner={owner}
                subscriberAddress={data.address}
                subscriberKey={data.subscriber.key}
                document={document}
                contract={contract}
              />
            ) : (
              <Button variant="danger" className="btn btn-sm">
                Revoke
              </Button>
            )}
          </td>
        </tr>
      );
    });
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
            </tbody>
          </Table>
          {!isOwner ? (
            <MyPublicationReadDialog
              account={account}
              contract={contract}
              owner={owner}
            />
          ) : (
            <Button
              target="_blank"
              onClick={() => {
                window.open(`${dedicatedIPFSURL}/${document}`, "_blank");
              }}
              className="btn btn-sm btn-success"
              style={{ padding: "5px 30px" }}
            >
              Read Book
            </Button>
          )}
        </div>
      </div>
      {isOwner ? (
        <div className="row mb-5">
          <div className="col-md-12">
            <h5 className="fw-bolder mb-3">Subscribers</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Shared</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{displaySubscribers()}</tbody>
            </Table>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MyPublicationDetail;
