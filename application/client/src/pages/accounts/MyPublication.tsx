import React, { useEffect, useState } from "react";
import MyPublicationCard from "./MyPublicationCard";
import Web3 from "web3";
const publicationContract = require("../../contracts/PublicationFactory.json");

const MyPublication = () => {
  const [publications, setPublications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const accounts = await web3.eth.getAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = publicationContract;

        let address = publicationContract.networks[networkID].address;
        let contract = new web3.eth.Contract(abi, address);

        const publications = await contract.methods
          .myPublications()
          .call({ from: accounts[0] });

        const subscriptions = await contract.methods
          .mySubscriptions()
          .call({ from: accounts[0] });

        console.info(subscriptions);

        setPublications(publications);
        setSubscriptions(subscriptions);
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
          <MyPublicationCard data={{ address, index }} />
        </div>
      );
    });
  };

  const displaySubscriptions = () => {
    return subscriptions.map((address, index) => {
      return (
        <div className="col-md-3 pl-1 m-0" key={address}>
          <MyPublicationCard data={{ address, index }} />
        </div>
      );
    });
  };

  return (
    <>
      <h4>My Publications</h4>
      <hr />
      <div className="row">{displayPublications()}</div>

      <br />
      <br />
      <h4>My Subscriptions</h4>
      <hr />
      <div className="row">{displaySubscriptions()}</div>
    </>
  );
};

export default MyPublication;
