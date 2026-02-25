// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract IdentityRegistry {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct User {
        bool isVerified;
        uint256 totalVolume;
        uint256 riskScore;
    }

    mapping(address => User) public users;

    address public governmentSigner;

    constructor(address _governmentSigner) {
        governmentSigner = _governmentSigner;
    }

    function register(bytes memory signature) external {
        require(!users[msg.sender].isVerified, "Already verified");

        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        address recoveredSigner = ethSignedMessageHash.recover(signature);

        require(
            recoveredSigner == governmentSigner,
            "Invalid government proof"
        );

        users[msg.sender].isVerified = true;
    }

    function isUserVerified(address user) external view returns (bool) {
        return users[user].isVerified;
    }

    function updateVolume(address user, uint256 amount) external {
        users[user].totalVolume += amount;
    }
}
