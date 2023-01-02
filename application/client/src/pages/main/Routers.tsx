import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import Create from "../explores/Create";
import NotFound from "../errors/Notfound";
import Book from "../books";
import BookDetail from "../books/Detail";
import Detail from "../explores/Detail";

const Routers = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="explores" element={<Home />} />
    <Route path="explores/:address" element={<Detail />} />
    <Route path="mybooks" element={<Book />} />
    <Route path="mybooks/:address" element={<BookDetail />} />
    <Route path="create" element={<Create />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Routers;
