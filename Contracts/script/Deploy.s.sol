// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/PlatformToken.sol";

contract Deploy is Script {

    function run() external {

        vm.startBroadcast();

        IdentityRegistry registry = new IdentityRegistry();

        PlatformToken token = new PlatformToken(
            address(registry),
            1000 * 10 ** 18
        );

        vm.stopBroadcast();
    }
}