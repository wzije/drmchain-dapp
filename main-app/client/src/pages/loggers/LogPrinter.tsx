import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Web3Util from "../../utils/Web3Util";

const LogPrinter = (props: any) => {
  const [show, setShow] = useState(false);
  const [logs, setLogs] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      const { abi } = props.bookRawContract;
      const latestBlockNumber = await Web3Util().eth.getBlockNumber();
      const _logs: any = {};

      abi
        .filter((o: any) => o.type === "event")
        .map((o: any) =>
          props.contract
            .getPastEvents(o.name, {
              fromBlock: 0,
              toBlock: latestBlockNumber,
            })
            .then((events: any) => {
              _logs[o.name] = events;
            })
        );

      setLogs(_logs);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        className="btn btn-sm btn-success"
        style={{ padding: "5px 30px" }}
        onClick={() => setShow(!show)}
      >
        Logs
      </Button>
      <div style={{ fontSize: "9pt" }}>
        {props.contract !== null && show ? (
          <SyntaxHighlighter language="json">
            {JSON.stringify(logs, null, 2)}
          </SyntaxHighlighter>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LogPrinter;
