const ethers = require('ethers');

async function testSigning() {
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const wallet = new ethers.Wallet(privateKey);
    const userAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

    console.log('Gov Signer Address:', wallet.address);
    console.log('User Address to verify:', userAddress);

    // 1. Recreate the hashing logic from IdentityRegistry.sol
    // bytes32 messageHash = keccak256(abi.encodePacked(msg.sender));
    const messageHash = ethers.solidityPackedKeccak256(["address"], [userAddress]);
    console.log('Message Hash (keccak256):', messageHash);

    // 2. Sign the message
    // signMessage adds the "\x19Ethereum Signed Message:\n32" prefix
    const signature = await wallet.signMessage(ethers.getBytes(messageHash));
    console.log('Signature:', signature);

    // 3. Verify the recovery (what the contract does)
    // messageHash.toEthSignedMessageHash().recover(signature)
    const recoveredAddress = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
    console.log('Recovered Signer:', recoveredAddress);

    if (recoveredAddress.toLowerCase() === wallet.address.toLowerCase()) {
        console.log('SUCCESS: Signature is valid and matches Gov Signer!');
    } else {
        console.log('FAILURE: Signature mismatch!');
    }
}

testSigning();
