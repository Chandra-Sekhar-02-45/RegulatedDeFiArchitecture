"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { deriveWalletFlags, hasBrowserProvider, requestAccounts, switchToRequiredNetwork, EthereumLike } from "@/lib/contracts";

declare global {
  interface Window {
    ethereum?: EthereumLike;
  }
}

export type WalletConnectionState = {
  account: string | null;
  chainId: number | null;
  networkName: string | null;
  hasProvider: boolean;
  isConnecting: boolean;
  error?: string;
  isAuthority: boolean;
  isModerator: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  refresh: () => Promise<void>;
  switchNetwork: () => Promise<void>;
};

export function useWallet(): WalletConnectionState {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [hasProviderState, setHasProviderState] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const syncFromProvider = useCallback(async () => {
    if (!hasBrowserProvider()) return;
    const { BrowserProvider } = await import("ethers");
    const provider = new BrowserProvider(window.ethereum!);
    const [accounts, network] = await Promise.all([
      provider.listAccounts(),
      provider.getNetwork(),
    ]);

    setAccount(accounts[0]?.address ?? null);
    setChainId(Number(network.chainId));
    setNetworkName(network.name ?? "");
  }, []);

  useEffect(() => {
    if (!hasBrowserProvider()) {
      setHasProviderState(false);
      return;
    }
    setHasProviderState(true);

    const ethereum = window.ethereum as EthereumLike;

    const handleAccountsChanged = (accs: string[]) => {
      setAccount(accs?.[0] ?? null);
    };

    const handleChainChanged = () => {
      syncFromProvider();
    };

    ethereum?.on?.("accountsChanged", handleAccountsChanged as (...args: unknown[]) => void);
    ethereum?.on?.("chainChanged", handleChainChanged as (...args: unknown[]) => void);
    ethereum?.on?.("disconnect", (() => setAccount(null)) as (...args: unknown[]) => void);

    syncFromProvider();

    return () => {
      ethereum?.removeListener?.("accountsChanged", handleAccountsChanged as (...args: unknown[]) => void);
      ethereum?.removeListener?.("chainChanged", handleChainChanged as (...args: unknown[]) => void);
    };
  }, [syncFromProvider]);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(undefined);
      const accounts = await requestAccounts();
      setAccount(accounts[0] ?? null);
      await syncFromProvider();
    } catch (err: any) {
      setError(err?.message ?? "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [syncFromProvider]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setError(undefined);
  }, []);

  const refresh = useCallback(async () => {
    try {
      await syncFromProvider();
    } catch (err: any) {
      setError(err?.message ?? "Unable to refresh wallet state");
    }
  }, [syncFromProvider]);

  const switchNetwork = useCallback(async () => {
    setError(undefined);
    await switchToRequiredNetwork();
    await refresh();
  }, [refresh]);

  const flags = useMemo(() => deriveWalletFlags(account, chainId), [account, chainId]);

  return {
    account,
    chainId,
    networkName,
    hasProvider: hasProviderState,
    isConnecting,
    error,
    isAuthority: flags.isAuthority,
    isModerator: flags.isModerator,
    isCorrectNetwork: flags.isCorrectNetwork,
    connectWallet,
    disconnect,
    refresh,
    switchNetwork,
  };
}
