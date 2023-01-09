import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Web3 from "web3";
import Web3Util from "../../utils/Web3Util";
const bookFactoryContract = require("../../contracts/BookFactory.json");

const BookIndex = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = Web3Util();
        const accounts = await web3.eth.getAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = bookFactoryContract;

        let address = bookFactoryContract.networks[networkID].address;
        let contract = new web3.eth.Contract(abi, address);

        const books = await contract.methods
          .myBooks()
          .call({ from: accounts[0] });

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
          <BookCard data={{ address, index }} />
        </div>
      );
    });
  };

  return (
    <>
      <h4>My Books</h4>
      <hr />
      <div className="row">{displayBooks()}</div>
    </>
  );
};

export default BookIndex;
