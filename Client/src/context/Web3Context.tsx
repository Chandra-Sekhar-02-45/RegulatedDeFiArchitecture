"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface Web3ContextType {
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnecting: boolean;
    error: string | null;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    connectWallet: async () => { },
    disconnectWallet: () => { },
    isConnecting: false,
    error: null,
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        setIsConnecting(true);
        setError(null);
        try {
            if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } else {
                setError("MetaMask is not installed. Please install it to use this app.");
            }
        } catch (err: any) {
            console.error("Wallet connection failed:", err);
            setError(err.message || "Failed to connect wallet.");
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                try {
                    const accounts = await provider.send("eth_accounts", []);
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                } catch (e) {
                    console.error("Error checking connection:", e);
                }

                // Setup event listeners
                const handleAccountsChanged = (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    } else {
                        setAccount(null);
                    }
                };

                const handleChainChanged = () => {
                    window.location.reload();
                };

                (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
                (window as any).ethereum.on("chainChanged", handleChainChanged);

                return () => {
                    if ((window as any).ethereum.removeListener) {
                        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
                        (window as any).ethereum.removeListener("chainChanged", handleChainChanged);
                    }
                };
            }
        };
        checkConnection();
    }, []);

    return (
        <Web3Context.Provider value={{ account, connectWallet, disconnectWallet, isConnecting, error }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);
