// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/TransactionController.sol";
import "../src/PlatformToken.sol";

contract Deploy is Script {

    function run() external {

        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        address governmentSigner = vm.addr(privateKey);
        address moderator = vm.addr(privateKey);

        IdentityRegistry registry = new IdentityRegistry(governmentSigner);

        TransactionController controller = new TransactionController(moderator);

        PlatformToken token = new PlatformToken(
            address(registry),
            address(controller),
            1000 ether
        );

        controller.setToken(address(token));

        vm.stopBroadcast();
    }
}