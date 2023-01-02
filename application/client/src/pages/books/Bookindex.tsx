import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Web3 from "web3";
const factoryContract = require("../../contracts/PublicationFactory.json");

const MyPublication = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const accounts = await web3.eth.getAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = factoryContract;

        let address = factoryContract.networks[networkID].address;
        let contract = new web3.eth.Contract(abi, address);

        const publications = await contract.methods
          .myPublications()
          .call({ from: accounts[0] });

        setPublications(publications);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  const displayPublications = () => {
    return publications.map((address, index) => {
      return (
        <div className="col-md-3 pl-1 m-0" key={address}>
          <BookCard data={{ address, index }} />
        </div>
      );
    });
  };

  return (
    <>
      <h4>My Publications</h4>
      <hr />
      <div className="row">{displayPublications()}</div>
    </>
  );
};

export default MyPublication;
