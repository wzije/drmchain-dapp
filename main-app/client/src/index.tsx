import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Routers } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Routers>
    <App />
  </Routers>
);
