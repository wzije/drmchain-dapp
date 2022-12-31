// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// import "./Signature.sol";
import "./Ownable.sol";

contract Publication is Ownable {
    string public title;
    string public author;
    address public author_account;
    string public publisher;
    string public releaseDate;
    string public isbn;
    string public cover;
    string public description;

    //hash yang sudah di sign dan encrypt, hanya bisa dibuka dengan kunci private owner
    string private documentHash;

    //customer struct
    struct RequestOwner {
        address customer;
        string publicKey;
        uint256 date;
    }

    RequestOwner private _requestOwner;

    event Requested(address customer, string title, uint256 date);
    event RequestAccepted(address customer, string title, uint256 date);

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

        _transferOwnership(_owner);
    }

    function getDocument() external view onlyOwner returns (string memory) {
        return documentHash;
    }

    function requestOwner(string memory _customerPublicKey) external nonOwner {
        require(_requestOwner.customer != msg.sender, "you requested");
        require(
            _requestOwner.customer == address(0x0),
            "the publication requested"
        );

        _requestOwner.customer = msg.sender;
        _requestOwner.publicKey = _customerPublicKey;
        _requestOwner.date = block.timestamp;

        //emit event
        emit Requested(_requestOwner.customer, title, _requestOwner.date);
    }

    function getRequest()
        external
        view
        onlyOwner
        returns (address, string memory)
    {
        require(
            _requestOwner.customer != address(0x0),
            "the request is not available"
        );
        return (_requestOwner.customer, _requestOwner.publicKey);
    }

    function isMyRequest(address customer) public view returns (bool) {
        return _requestOwner.customer == customer;
    }

    function acceptRequest(address _customer, string memory _hashDocument)
        external
        onlyOwner
    {
        require(
            _requestOwner.customer != address(0x0),
            "the request is not available"
        );

        documentHash = _hashDocument;
        _transferOwnership(_customer);

        delete _requestOwner;

        emit RequestAccepted(_customer, title, block.timestamp);
    }
}
