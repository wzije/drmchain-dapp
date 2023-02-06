// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <=0.9.0;

abstract contract Ownable {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "the guest not allowed.");
        _;
    }

    modifier nonOwner() {
        require(owner() != msg.sender, "the owner not allowed");
        _;
    }

    function _transferOwnership(address newOwner) public virtual onlyOwner {
        _owner = newOwner;
    }
}
