// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPlatformToken {
    function executeTransfer(
        address from,
        address to,
        address recipient,
        uint256 amount
    ) external;

    function cancelTransfer(address from, uint256 amount) external;
}

contract TransactionController {
    struct PendingTransaction {
        address from;
        address to;
        uint256 amount;
        bool approved;
        bool executed;
    }

    mapping(uint256 => PendingTransaction) public transactions;
    uint256 public txCounter;

    address public moderator;
    address public token;

    modifier onlyModerator() {
        require(msg.sender == moderator, "Not moderator");
        _;
    }

    modifier onlyToken() {
        require(msg.sender == token, "Only token can call");
        _;
    }

    constructor(address _moderator) {
        moderator = _moderator;
    }

    function setToken(address _token) external {
        require(token == address(0), "Token already set");
        token = _token;
    }

    function createPendingTransaction(
        address from,
        address to,
        uint256 amount
    ) external onlyToken returns (uint256) {
        txCounter++;

        transactions[txCounter] = PendingTransaction({
            from: from,
            to: to,
            amount: amount,
            approved: false,
            executed: false
        });

        return txCounter;
    }

    function approveTransaction(uint256 txId) external onlyModerator {
        PendingTransaction storage txn = transactions[txId];
        require(!txn.executed, "Already executed");

        txn.approved = true;
        txn.executed = true;

        IPlatformToken(token).executeTransfer(
            txn.from,
            address(this),
            txn.to,
            txn.amount
        );
    }

    function rejectTransaction(uint256 txId) external onlyModerator {
        PendingTransaction storage txn = transactions[txId];
        require(!txn.executed, "Already executed");

        txn.executed = true;

        IPlatformToken(token).cancelTransfer(txn.from, txn.amount);
    }
}
