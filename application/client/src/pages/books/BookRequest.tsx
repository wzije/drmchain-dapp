import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";

const factoryContract = require("../../contracts/PublicationFactory.json");
const publicationContract = require("../../contracts/Publication.json");

const BookRequest = () => {
  const [web3, setWeb3] = useState<any>();
  const [publications, setPublications] = useState<{}[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        setWeb3(web3);
        const { abi } = factoryContract;
        const networkID = await web3.eth.net.getId();

        let address = factoryContract.networks[networkID].address;
        const contract = new web3.eth.Contract(abi, address);
        const accounts = await web3.eth.getAccounts();

        const pubs = await contract.methods
          .myPublicationRequests()
          .call({ from: accounts[0] });

        pubs.map(async (address: string, index: number) => {
          const { abi } = publicationContract;
          const newContract = new web3.eth.Contract(abi, address);
          const title = await newContract.methods.title().call();
          const cover = await newContract.methods.cover().call();
          const owner = await newContract.methods.owner().call();

          setPublications((publications) => [
            ...publications,
            { title: title, cover: cover, owner: owner, address: address },
          ]);
        });

        setPublications(publications);
      } catch (error: any) {
        console.log(error);
      }
    };

    init();
  }, []);

  const displayRequests = () => {
    return publications.map((data: any, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <img
              src={`/img/${data.cover}`}
              className="img-thumbnail"
              style={{ width: "30px" }}
            />
          </td>
          <td>{data.title}</td>
          <td>{data.owner}</td>
          <td>
            <Link to={`/explores/${data.address}`}>Show</Link>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <h3>My Requests</h3>
      <hr />
      <div className="row">
        <table className="table table-bordered">
          <thead>
            <tr>
              <td>#</td>
              <td>Cover</td>
              <td>Title</td>
              <td>Owner</td>
              <td>...</td>
            </tr>
          </thead>
          <tbody>{displayRequests()}</tbody>
        </table>
      </div>
    </>
  );
};

export default BookRequest;
