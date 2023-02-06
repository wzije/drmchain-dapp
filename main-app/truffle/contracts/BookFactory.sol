// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Ownable.sol";

contract BookFactory {
    //for public info
    Book[] private _books;

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
        Book book = new Book();
        book.create(
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

        if (size > 0) {
            collections = new Book[](size);
            uint256 collectIndex = 0;
            for (uint256 i = 0; i < _books.length; i++) {
                Book pub = _books[i];
                if (pub.owner() == msg.sender) {
                    collections[collectIndex] = pub;
                    collectIndex++;
                }
            }
        }

        return collections;
    }

    function myRequests() external view returns (Book[] memory collections) {
        uint256 size = 0;
        for (uint256 i = 0; i < _books.length; i++) {
            Book pub = _books[i];
            if (pub.isMyRequest(msg.sender)) size++;
        }

        if (size > 0) {
            uint256 collectIndex = 0;
            collections = new Book[](size);
            for (uint256 i = 0; i < _books.length; i++) {
                Book pub = _books[i];
                if (pub.isMyRequest(msg.sender)) {
                    collections[collectIndex] = pub;
                    collectIndex++;
                }
            }
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

        if (size > 0) {
            uint256 collectIndex = 0;
            collections = new Book[](size);
            for (uint256 i = 0; i < _books.length; i++) {
                Book pub = _books[i];
                if (pub.owner() == msg.sender && pub.isRequested()) {
                    collections[collectIndex] = pub;
                    collectIndex++;
                }
            }
        }

        return collections;
    }
}

contract Book is Ownable {
    string public title;
    string public author;
    address public author_account;
    string public publisher;
    string public releaseDate;
    string public isbn;
    string public cover;
    string public description;
    string private documentHash;

    //customer struct
    struct Requester {
        address customer;
        string publicKey;
        uint256 date;
    }

    Requester private _requester;

    event BookCreated(string title, address owner, uint256 date);
    event Requested(address customer, string title, uint256 date);
    event RequestAccepted(address from, address to, string title, uint256 date);

    function create(
        string memory _title,
        string memory _author,
        address _author_account,
        string memory _publisher,
        string memory _releaseDate,
        string memory _isbn,
        string memory _cover,
        string memory _description,
        string memory _hashDocument,
        address _owner
    ) public payable onlyOwner {
        title = _title;
        author = _author;
        author_account = _author_account;
        publisher = _publisher;
        releaseDate = _releaseDate;
        isbn = _isbn;
        cover = _cover;
        description = _description;
        documentHash = _hashDocument;

        _transferOwnership(_owner);

        emit BookCreated(_title, owner(), block.timestamp);
    }

    function getDocument() external view onlyOwner returns (string memory) {
        return documentHash;
    }

    function requestOwner(string memory _customerPublicKey)
        external
        payable
        nonOwner
    {
        require(_requester.customer != msg.sender, "you requested");
        require(_requester.customer == address(0x0), "the book requested");

        _requester.customer = msg.sender;
        _requester.publicKey = _customerPublicKey;
        _requester.date = block.timestamp;

        //emit event
        emit Requested(_requester.customer, title, _requester.date);
    }

    function getRequest()
        external
        view
        onlyOwner
        returns (
            address,
            string memory,
            string memory
        )
    {
        require(
            _requester.customer != address(0x0),
            "the request is not available"
        );
        return (_requester.customer, _requester.publicKey, documentHash);
    }

    function isMyRequest(address customer) public view returns (bool) {
        return _requester.customer == customer;
    }

    function isRequested() public view returns (bool) {
        return _requester.customer != address(0x00);
    }

    function acceptRequest(string memory _documentHash)
        external
        payable
        onlyOwner
    {
        require(
            _requester.customer != address(0x0),
            "the request is not available"
        );

        documentHash = _documentHash;
        _transferOwnership(_requester.customer);

        emit RequestAccepted(
            msg.sender,
            _requester.customer,
            title,
            block.timestamp
        );

        delete _requester;
    }
}
