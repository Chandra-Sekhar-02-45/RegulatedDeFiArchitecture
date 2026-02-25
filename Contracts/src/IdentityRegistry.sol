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
    mapping(address => uint256) public nonces;

    address public governmentSigner;

    event UserVerified(address indexed user, uint256 nonce);

    constructor(address _governmentSigner) {
        governmentSigner = _governmentSigner;
    }

    /**
     * @dev Simple helper to get the hash that the Gov API signs.
     */
    function getMessageHash(
        address _user,
        uint256 _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_user, _nonce));
    }

    function register(bytes memory signature) external {
        require(!users[msg.sender].isVerified, "Already verified");

        uint256 currentNonce = nonces[msg.sender];
        bytes32 messageHash = getMessageHash(msg.sender, currentNonce);
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        address recoveredSigner = ethSignedMessageHash.recover(signature);

        require(
            recoveredSigner == governmentSigner,
            "Invalid government proof"
        );

        users[msg.sender].isVerified = true;
        nonces[msg.sender]++;

        emit UserVerified(msg.sender, currentNonce);
    }

    function isUserVerified(address user) external view returns (bool) {
        return users[user].isVerified;
    }

    function updateVolume(address user, uint256 amount) external {
        users[user].totalVolume += amount;
    }
}
