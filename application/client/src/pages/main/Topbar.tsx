import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
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

  const accountIcon = (
    <div className="" style={{ float: "left" }}>
      <img
        className="rounded-circle border"
        src="/img/no-profile-icon.png"
        alt="user"
        style={{ width: "28px" }}
      />
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
              <NavLink className="nav-link" to="me/books/create">
                Create
              </NavLink>
              <NavLink className="nav-link" to="me/books">
                Library
              </NavLink>
              <NavDropdown align="end" title={accountIcon}>
                <NavLink className="dropdown-item" to="me/profile">
                  Profile
                </NavLink>
                <NavLink className="dropdown-item" to="me/books">
                  My Books
                </NavLink>
                <NavLink className="dropdown-item" to="me/customers">
                  My Customers
                </NavLink>
              </NavDropdown>
              <NavLink className="nav-link" to="me/wallets">
                <Icon icon={faWallet} />
              </NavLink>
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
