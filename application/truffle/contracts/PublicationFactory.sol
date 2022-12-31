// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Publication.sol";

contract PublicationFactory {
    //for public info
    Publication[] private _publications;

    event PublicationCreated(string title, address owner, uint256 date);

    function createPublication(
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
        Publication publication = new Publication(
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

        _publications.push(publication);

        emit PublicationCreated(_title, publication.owner(), block.timestamp);
    }

    function publicationCount() external view returns (uint256) {
        return _publications.length;
    }

    function publications(uint256 _limit, uint256 _offset)
        public
        view
        returns (Publication[] memory collections)
    {
        require(_offset <= _publications.length, "offset out of bounds");
        uint256 maxlimit = 20;
        uint256 size = _publications.length - _offset;
        size = size < _limit ? size : _limit;
        size = size < maxlimit ? size : maxlimit;

        collections = new Publication[](size);

        for (uint256 i = 0; i < size; i++) {
            collections[i] = _publications[_offset + i];
        }

        return collections;
    }

    function myPublications()
        external
        view
        returns (Publication[] memory collections)
    {
        uint256 size = 0;
        for (uint256 i = 0; i < _publications.length; i++) {
            Publication pub = _publications[i];
            if (pub.owner() == msg.sender) size++;
        }

        collections = new Publication[](size);
        for (uint256 i = 0; i < _publications.length; i++) {
            Publication pub = _publications[i];
            if (pub.owner() == msg.sender) collections[i] = pub;
        }

        return collections;
    }

    function myPublicationRequests()
        external
        view
        returns (Publication[] memory collections)
    {
        uint256 size = 0;
        for (uint256 i = 0; i < _publications.length; i++) {
            Publication pub = _publications[i];
            if (pub.isMyRequest(msg.sender)) size++;
        }

        collections = new Publication[](size);
        for (uint256 i = 0; i < _publications.length; i++) {
            Publication pub = _publications[i];
            if (pub.isMyRequest(msg.sender)) collections[i] = pub;
        }

        return collections;
    }
}
