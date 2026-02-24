// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IdentityRegistry.sol";

contract PlatformToken is ERC20 {

    IdentityRegistry public identityRegistry;

    uint256 public transactionThreshold;

    constructor(
        address _identityRegistry,
        uint256 _threshold
    ) ERC20("Hybrid Bank Token", "HBT") {
        identityRegistry = IdentityRegistry(_identityRegistry);
        transactionThreshold = _threshold;

        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {

        if (from != address(0) && amount >= transactionThreshold) {
            require(
                identityRegistry.isVerified(from),
                "Sender not verified for high transaction"
            );
        }

        super._update(from, to, amount);
    }
}