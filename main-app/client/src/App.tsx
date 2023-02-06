import Topbar from "./pages/main/Topbar";
import Routers from "./pages/main/Routers";
import { useEffect } from "react";
import { Error } from "./utils/ModalUtil";

declare let window: any;

function App(): JSX.Element {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", function () {
      window.location.reload();
    });
  }

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          Error("Metamask is not installed").then((res) => {
            if (res.isConfirmed)
              window.location.href = "https://metamask.io/download/";
          });
          return;
        }

        if (typeof window.ethereum === "undefined") {
          Error("Metamask is not installed").then((res) => {
            if (res.isConfirmed)
              // window.open("https://metamask.io/download/");
              window.location.href = "https://metamask.io/download/";
          });
          return;
        } else {
          console.log("Metamask connected");
        }
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  return (
    <>
      <Topbar />
      <div className="container pt-4 pb-5">
        <Routers />
      </div>
    </>
  );
}

export default App;
