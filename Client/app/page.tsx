"use client";

import ConnectWallet from "./ConnectWallet";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-10 gap-8">
      
      <h1 className="text-4xl font-bold text-center">
        Regulated DeFi Architecture
      </h1>

      <p className="text-gray-400 text-center max-w-xl">
        Hybrid Government-Certified Decentralized Banking Framework
      </p>

      <ConnectWallet />

      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Certification Status</h2>
        <p className="text-yellow-400">Not Verified</p>
      </div>

      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Small Transfer</h2>
        <button className="bg-blue-600 px-4 py-2 rounded">
          Send Small Transaction
        </button>
      </div>

      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Large Transfer</h2>
        <button className="bg-red-600 px-4 py-2 rounded">
          Send Large Transaction (Requires Certification)
        </button>
      </div>

    </main>
  );
}