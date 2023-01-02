import Topbar from "./pages/main/Topbar";
import Routers from "./pages/main/Routers";
import { useEffect } from "react";
import { Alert } from "./utils/AlertUtil";

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
          Alert("Metamask is not installed");
          return;
        }
        if (typeof window.ethereum === "undefined") {
          console.log("MetaMask is not installed!");
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
