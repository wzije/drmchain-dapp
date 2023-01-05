import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";

const bookFactoryContract = require("../../contracts/BookFactory.json");
const bookContract = require("../../contracts/Book.json");

const BookRequest = () => {
  const [books, setBooks] = useState<{}[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const { abi } = bookFactoryContract;
        const networkID = await web3.eth.net.getId();
        let address = bookFactoryContract.networks[networkID].address;

        const contract = new web3.eth.Contract(abi, address);
        const accounts = await web3.eth.getAccounts();

        const pubs = await contract.methods
          .myRequests()
          .call({ from: accounts[0] });

        pubs.map(async (address: string, index: number) => {
          const { abi } = bookContract;
          const bookCont = new web3.eth.Contract(abi, address);
          const title = await bookCont.methods.title().call();
          const cover = await bookCont.methods.cover().call();
          const owner = await bookCont.methods.owner().call();

          setBooks((publications) => [
            ...publications,
            { title: title, cover: cover, owner: owner, address: address },
          ]);
        });
      } catch (error: any) {
        console.log(error);
      }
    };

    init();
  }, []);

  const displayRequests = () => {
    return books.map((data: any, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <img
              src={`/img/${data.cover}`}
              alt={data.cover}
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
