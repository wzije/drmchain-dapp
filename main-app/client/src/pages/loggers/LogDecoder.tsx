import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Web3 from "web3";
import Web3Util from "../../utils/Web3Util";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import Web3 from "web3";
// const bookFactoryContract = require("../../contracts/BookFactory.json");
const bookContract = require("../../contracts/Book.json");

const LogDecoder = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [tx, setTx] = useState("");
  const [eventType, setEventType] = useState("");
  const [logs, setLogs] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = Web3Util();
        setWeb3(web3);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  const _handleDecode = async () => {
    if (web3) {
      const receipt: any = await web3.eth.getTransactionReceipt(tx);

      const { abi } = bookContract;

      const events: any = abi
        .filter((o: any) => o.type === "event")
        .filter((o: any) => o.name === eventType);

      let transaction = web3.eth.abi.decodeLog(
        events[0].inputs,
        receipt.logs[0].data,
        receipt.logs[0].topic
      );

      setLogs(JSON.stringify(transaction));
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

      <hr />
      <div style={{ fontSize: "9pt" }}>
        {logs ? (
          <SyntaxHighlighter language="json">{logs}</SyntaxHighlighter>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LogDecoder;
