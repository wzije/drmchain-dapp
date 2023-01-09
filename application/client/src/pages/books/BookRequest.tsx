import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import Web3Util from "../../utils/Web3Util";

const bookFactoryContract = require("../../contracts/BookFactory.json");
const bookContract = require("../../contracts/Book.json");

const BookRequest = () => {
  const [myRequests, setMyRequests] = useState<{}[]>([]);
  const [myRequestedBooks, setMyRequestedBooks] = useState<{}[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = Web3Util();
        const { abi } = bookFactoryContract;
        const networkID = await web3.eth.net.getId();
        let address = bookFactoryContract.networks[networkID].address;

        const contract = new web3.eth.Contract(abi, address);
        const accounts = await web3.eth.getAccounts();

        populateMyRequestedBooks(contract, web3, accounts[0]);

        populateMyRequests(contract, web3, accounts[0]);

        // my request of book
      } catch (error: any) {
        console.log(error);
      }
    };

    init();
  }, []);

  const populateMyRequestedBooks = async (
    contract: any,
    web3: any,
    account: any
  ) => {
    try {
      const myRequestedBooks = await contract.methods
        .myRequestedBooks()
        .call({ from: account });

      myRequestedBooks.map(async (address: string, index: number) => {
        const { abi } = bookContract;
        const bookCont = new web3.eth.Contract(abi, address);
        const title = await bookCont.methods.title().call();
        const cover = await bookCont.methods.cover().call();
        const owner = await bookCont.methods.owner().call();

        setMyRequestedBooks((myRequestedBooks) => [
          ...myRequestedBooks,
          { title: title, cover: cover, owner: owner, address: address },
        ]);
      });
    } catch (error: any) {
      console.info(error);
    }
  };

  const displayRequestedBooks = () => {
    return myRequestedBooks.map((data: any, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          {/* <td>
            <img
              src={`/img/${data.cover}`}
              alt={data.cover}
              className="img-thumbnail"
              style={{ width: "30px" }}
            />
          </td> */}
          {/* <td>{data.title}</td> */}
          <td>{data.owner}</td>
          <td>
            <Link to={`/mybooks/${data.address}`}>Show</Link>
          </td>
        </tr>
      );
    });
  };

  const populateMyRequests = async (contract: any, web3: any, account: any) => {
    const myRequestList = await contract.methods
      .myRequests()
      .call({ from: account });

    myRequestList.map(async (address: string, index: number) => {
      const { abi } = bookContract;
      const bookCont = new web3.eth.Contract(abi, address);
      const title = await bookCont.methods.title().call();
      const cover = await bookCont.methods.cover().call();
      const owner = await bookCont.methods.owner().call();

      setMyRequests((myRequestList) => [
        ...myRequestList,
        { title: title, cover: cover, owner: owner, address: address },
      ]);
    });
  };

  const displayRequests = () => {
    return myRequests.map((data: any, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          {/* <td>
            <img
              src={`/img/${data.cover}`}
              alt={data.cover}
              className="img-thumbnail"
              style={{ width: "30px" }}
            />
          </td> */}
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
      <div className="card mb-5">
        <h4 className="card-header">List of Requested Books</h4>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <td width="30">#</td>
                {/* <td>Cover</td> */}
                <td>Title</td>
                {/* <td>Owner</td> */}
                <td>...</td>
              </tr>
            </thead>
            <tbody>{displayRequestedBooks()}</tbody>
          </table>
        </div>
      </div>
      <div className="card mb-5">
        <h4 className="card-header">My Ownership Requests</h4>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <td width="30">#</td>
                {/* <td>Cover</td> */}
                <td>Title</td>
                <td>Owner</td>
                <td>...</td>
              </tr>
            </thead>
            <tbody>{displayRequests()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BookRequest;
