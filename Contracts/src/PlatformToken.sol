// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IdentityRegistry.sol";
import "./TransactionController.sol";

contract PlatformToken is ERC20 {

    IdentityRegistry public identityRegistry;
    TransactionController public transactionController;

    uint256 public transactionThreshold;

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

    function transfer(address to, uint256 amount) public override returns (bool) {

        require(identityRegistry.isUserVerified(msg.sender), "User not verified");

        if (amount >= transactionThreshold) {
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

    function executeTransfer(
        address from,
        address to,
        uint256 amount
    ) external onlyTransactionController {

        _transfer(from, to, amount);
    }
}