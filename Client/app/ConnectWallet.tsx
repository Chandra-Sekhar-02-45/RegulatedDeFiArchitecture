"use client";

import { useState } from "react";
import { BrowserProvider, Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  return (
    <div>
      {account ? (
        <p className="text-green-400">Connected: {account}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}