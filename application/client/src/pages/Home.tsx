import React, { useEffect, useState } from "react";
import PublicationCard from "./explores/Card";
import Web3 from "web3";
const publicationContract = require("../contracts/PublicationFactory.json");

const Home = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const networkID = await web3.eth.net.getId();
        const { abi } = publicationContract;

        let address = publicationContract.networks[networkID].address;
        let contract = new web3.eth.Contract(abi, address);

        const publications = await contract.methods.publications(10, 0).call();
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
          <PublicationCard data={{ address, index }} key={address} />
        </div>
      );
    });
  };

  return (
    <div>
      <h3>Explore Publication</h3>
      <hr />
      <div className="row">{displayPublications()}</div>
    </div>
  );
};

export default Home;
