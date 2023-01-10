// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Ownable.sol";

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

    event Requested(address customer, string title, uint256 date);
    event RequestAccepted(address from, address to, string title, uint256 date);

    constructor(
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
    ) {
        title = _title;
        author = _author;
        author_account = _author_account;
        publisher = _publisher;
        releaseDate = _releaseDate;
        isbn = _isbn;
        cover = _cover;
        description = _description;
        documentHash = _hashDocument;

        //transfer ownership to specific account
        _transferOwnership(_owner);
    }

    function getDocument() external view onlyOwner returns (string memory) {
        return documentHash;
    }

    function requestOwner(string memory _customerPublicKey) external nonOwner {
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

    function acceptRequest(string memory _documentHash) external onlyOwner {
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
