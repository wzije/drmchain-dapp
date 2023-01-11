import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Web3 from "web3";
import Web3Util from "../../utils/Web3Util";
// import Web3 from "web3";
const bookFactoryContract = require("../../contracts/BookFactory.json");
const bookContract = require("../../contracts/Book.json");

const LogDecoder = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<any>();
  const [tx, setTx] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = Web3Util();

        const networkID = await web3.eth.net.getId();
        let address = bookFactoryContract.networks[networkID].address;
        const { abi } = bookFactoryContract;
        // let contract = new web3.eth.Contract(abi, address);
        setWeb3(web3);

        let logs = await getPastLogs(address, 0, 10);
        console.info(logs);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  const getPastLogs = async (
    address: string,
    fromBlock: number,
    toBlock: number
  ) => {
    if (fromBlock <= toBlock && web3) {
      try {
        const options = {
          address: address,
          fromBlock: fromBlock,
          toBlock: toBlock,
        };
        return await web3.eth.getPastLogs(options);
      } catch (error) {
        const midBlock = (fromBlock + toBlock) >> 1;
        const arr1: any = await getPastLogs(address, fromBlock, midBlock);
        const arr2: any = await getPastLogs(address, midBlock + 1, toBlock);
        return [...arr1, ...arr2];
      }
    }
    return [];
  };

  const _handleDecode = async () => {
    if (web3) {
      const receipt: any = await web3.eth.getTransactionReceipt(tx);
      console.info(receipt, "result");

      const { abi } = bookContract;
      let contract = new web3.eth.Contract(abi, receipt.logs[0].address);

      const logs = contract.events;
      console.info(logs, "events");
      // const events: any = abi
      //   .filter((o: any) => o.type === "event")
      //   .filter((o: any) => o.name == eventType);

      // console.info(events, "events");

      // let transaction = web3.eth.abi.decodeLog(
      //   events[0].inputs,
      //   receipt.logs[0].data,
      //   receipt.logs[0].topic
      // );

      // console.log(transaction, "tx");

      await contract
        .getPastEvents(
          eventType,
          {
            // filter: {
            //   myIndexedParam: [0, 100],
            // }, // Using an array means OR: e.g. 20 or 23
            fromBlock: 0,
            toBlock: 10,
          },
          (error: any, events: any) => {
            console.log(events, "huthuehe----");
          }
        )
        .then(function (events: any) {
          console.log(events, "my event"); // same results as the optional callback above
        });
    }
  };

  return (
    <div>
      <h3>Decode Tx</h3>
      <hr />
      <Form>
        <Form.Group className="mb-3" controlId="BookForm.ControlTitle">
          <Form.Label>Type</Form.Label>
          <Form.Select
            aria-label="Default select example"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="BookCreated">BookCreated</option>
            <option value="Requested">Requested</option>
            <option value="RequestAccepted">RequestAccepted</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="BookForm.ControlTitle">
          <Form.Label>Transaction Log</Form.Label>
          <Form.Control
            type="text"
            placeholder="Transaction Log"
            value={tx}
            onChange={(e) => setTx(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" className="btn" onClick={_handleDecode}>
          Decode
        </Button>
      </Form>
    </div>
  );
};

export default LogDecoder;
