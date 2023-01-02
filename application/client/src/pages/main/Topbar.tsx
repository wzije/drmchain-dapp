import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

import Web3 from "web3";
import "./main.css";

const Topbar = () => {
  const [account, setAccount] = useState<any>();
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  const bookIcon = (
    <div className="" style={{ float: "left" }}>
      <Icon icon={faBook} />
      &nbsp;Books
    </div>
  );

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <NavLink className="navbar-brand" to="/">
            DC-PUB
          </NavLink>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
            ></Nav>
            <Nav className="d-flex">
              <NavLink className="nav-link" to="explores">
                Explores
              </NavLink>
              <NavLink className="nav-link" to="create">
                Create
              </NavLink>
              <NavDropdown align="end" title={bookIcon}>
                <NavLink className="dropdown-item" to="mybooks">
                  My Books
                </NavLink>
                <NavLink className="dropdown-item" to="myrequest">
                  My Request
                </NavLink>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar
        expand="lg"
        variant="light"
        style={{ backgroundColor: "hwb(0deg 93% 7%)" }}
      >
        <Container fluid className="text-black" style={{ fontSize: "11pt" }}>
          Account: {account}
        </Container>
      </Navbar>
    </>
  );
};

export default Topbar;
