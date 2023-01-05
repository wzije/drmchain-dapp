import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import Create from "../books/BookCreate";
import ExploreDetail from "../explores/ExploreDetail";
import NotFound from "../errors/Notfound";
import BookIndex from "../books/Bookindex";
import BookDetail from "../books/BookDetail";
import BookRequest from "../books/BookRequest";

const Routers = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="explores" element={<Home />} />
    <Route path="explores/:address" element={<ExploreDetail />} />
    <Route path="mybooks" element={<BookIndex />} />
    <Route path="mybooks/:address" element={<BookDetail />} />
    <Route path="myrequests" element={<BookRequest />} />
    <Route path="create" element={<Create />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Routers;
