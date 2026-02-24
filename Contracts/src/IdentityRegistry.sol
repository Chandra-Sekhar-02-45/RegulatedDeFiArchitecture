// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityRegistry {

    address public admin;

    mapping(address => bool) public isVerified;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function verifyUser(address user) external onlyAdmin {
        isVerified[user] = true;
    }

    function revokeUser(address user) external onlyAdmin {
        isVerified[user] = false;
    }
}