import React, { useEffect, useState } from "react";
import BookCard from "./explores/ExploreCard";
// import Web3 from "web3";
import Web3Util from "../utils/Web3Util";
const bookFactoryContract = require("../contracts/BookFactory.json");

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = Web3Util();
        const networkID = await web3.eth.net.getId();
        const { abi } = bookFactoryContract;

        let address = bookFactoryContract.networks[networkID].address;
        let contract = new web3.eth.Contract(abi, address);

        const books = await contract.methods.books(10, 0).call();
        setBooks(books);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  const displayBooks = () => {
    return books.map((address, index) => {
      return (
        <div className="col-md-3 pl-1 m-0 mb-3" key={address}>
          <BookCard data={{ address, index }} key={address} />
        </div>
      );
    });
  };

  return (
    <div>
      <h3>Explore Books</h3>
      <hr />
      <div className="row">{displayBooks()}</div>
    </div>
  );
};

export default Home;
