import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import MyBookCreate from "../publications/Create";
import NotFound from "../errors/Notfound";
import Profile from "../accounts/Profile";
import Wallet from "../accounts/Wallets";
import Customer from "../customers/List";
import React from "react";
import MyPublication from "../accounts/MyPublication";
import MyPublicationDetail from "../accounts/MyPublicationDetail";
import Detail from "../publications/Detail";

const Routers = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="explores" element={<Home />} />
    <Route path="explores/:address" element={<Detail />} />
    <Route path="me/books" element={<MyPublication />} />
    <Route path="me/books/:address" element={<MyPublicationDetail />} />
    <Route path="me/books/create" element={<MyBookCreate />} />
    <Route path="me/profile" element={<Profile />} />
    <Route path="me/wallets" element={<Wallet />} />
    <Route path="me/customers" element={<Customer />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Routers;
