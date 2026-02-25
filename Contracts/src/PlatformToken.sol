// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IdentityRegistry.sol";
import "./TransactionController.sol";

contract PlatformToken is ERC20 {
    IdentityRegistry public identityRegistry;
    TransactionController public transactionController;

    uint256 public transactionThreshold;

    modifier onlyVerified(address account) {
        require(identityRegistry.isUserVerified(account), "User not verified");
        _;
    }

    modifier onlyTransactionController() {
        require(msg.sender == address(transactionController), "Not controller");
        _;
    }

    constructor(
        address _identityRegistry,
        address _transactionController,
        uint256 _threshold
    ) ERC20("Hybrid Bank Token", "HBT") {
        identityRegistry = IdentityRegistry(_identityRegistry);
        transactionController = TransactionController(_transactionController);
        transactionThreshold = _threshold;

        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function transfer(
        address to,
        uint256 amount
    ) public override onlyVerified(msg.sender) returns (bool) {
        if (amount >= transactionThreshold) {
            // Escrow: Move funds to the controller instead of leaving them in the wallet
            _transfer(msg.sender, address(transactionController), amount);

            transactionController.createPendingTransaction(
                msg.sender,
                to,
                amount
            );
            return true;
        }

        identityRegistry.updateVolume(msg.sender, amount);
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override onlyVerified(from) returns (bool) {
        if (amount >= transactionThreshold) {
            _transfer(from, address(transactionController), amount);

            transactionController.createPendingTransaction(from, to, amount);
            return true;
        }

        identityRegistry.updateVolume(from, amount);
        return super.transferFrom(from, to, amount);
    }

    function executeTransfer(
        address from,
        address to, // unused but kept for interface consistency
        address recipient,
        uint256 amount
    ) external onlyTransactionController {
        // Transfer from the controller's balance to the final recipient
        _transfer(address(transactionController), recipient, amount);
        identityRegistry.updateVolume(from, amount);
    }

    function cancelTransfer(
        address from,
        uint256 amount
    ) external onlyTransactionController {
        // Return funds from escrow to the original sender
        _transfer(address(transactionController), from, amount);
    }
}
