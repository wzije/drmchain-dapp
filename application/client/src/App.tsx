import Topbar from "./pages/main/Topbar";
import Routers from "./pages/main/Routers";
import { useEffect } from "react";

declare let window: any;

function App() {
  window.ethereum.on("accountsChanged", function () {
    // Time to reload your interface with accounts[0]!
    window.location.reload();
  });

  useEffect(() => {
    const init = async () => {
      try {
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
