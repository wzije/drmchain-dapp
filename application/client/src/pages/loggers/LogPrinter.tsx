import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LogPrinter = (props: any) => {
  const [show, setShow] = useState(false);
  const [logs, setLogs] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      const { abi } = props.bookContract;
      const _logs: any = {};

      abi
        .filter((o: any) => o.type === "event")
        .map((o: any) => {
          const name = o.name;

          console.info(name);
          props.contract
            .getPastEvents(o.name, {
              fromBlock: 0,
              toBlock: 10,
            })
            .then((events: any) => {
              _logs[name] = events;
            });
        });

      console.info(_logs);
      setLogs(_logs);
    };

    init();
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
      <div>
        {props.contract !== null && show ? (
          <pre
            style={{
              fontSize: "10pt",
              display: "block",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              margin: "1em 0",
            }}
          >
            {JSON.stringify(logs, null, 2)}
          </pre>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LogPrinter;
