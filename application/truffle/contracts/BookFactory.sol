// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Book.sol";

contract BookFactory {
    //for public info
    Book[] private _books;

    event BookCreated(string title, address owner, uint256 date);

    function createBook(
        string memory _title,
        string memory _author,
        address _author_account,
        string memory _publisher,
        string memory _releaseDate,
        string memory _isbn,
        string memory _cover,
        string memory _description,
        string memory _documentHash
    ) public {
        Book book = new Book(
            _title,
            _author,
            _author_account,
            _publisher,
            _releaseDate,
            _isbn,
            _cover,
            _description,
            _documentHash,
            msg.sender
        );

        _books.push(book);

        emit BookCreated(_title, book.owner(), block.timestamp);
    }

    function bookCount() external view returns (uint256) {
        return _books.length;
    }

    function books(uint256 _limit, uint256 _offset)
        public
        view
        returns (Book[] memory collections)
    {
        require(_offset <= _books.length, "offset out of bounds");
        uint256 maxlimit = 20;
        uint256 size = _books.length - _offset;
        size = size < _limit ? size : _limit;
        size = size < maxlimit ? size : maxlimit;

        collections = new Book[](size);

        for (uint256 i = 0; i < size; i++) {
            collections[i] = _books[_offset + i];
        }

        return collections;
    }

    function myBooks() external view returns (Book[] memory collections) {
        uint256 size = 0;
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.owner() == msg.sender) size++;
        }

        collections = new Book[](size);
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.owner() == msg.sender) collections[i] = pub;
        }

        return collections;
    }

    function myRequests() external view returns (Book[] memory collections) {
        uint256 size = 0;
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.isMyRequest(msg.sender)) size++;
        }

        collections = new Book[](size);
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.isMyRequest(msg.sender)) collections[i] = pub;
        }

        return collections;
    }

    function myRequestedBooks()
        external
        view
        returns (Book[] memory collections)
    {
        uint256 size = 0;
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.owner() == msg.sender && pub.isRequested()) size++;
        }

        collections = new Book[](size);
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.owner() == msg.sender && pub.isRequested())
                collections[i] = pub;
        }

        return collections;
    }
}
