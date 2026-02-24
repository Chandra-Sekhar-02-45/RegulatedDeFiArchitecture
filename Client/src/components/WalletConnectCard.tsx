import { WalletConnectionState } from "@/hooks/useWallet";
import { SectionCard } from "./SectionCard";

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type Props = {
  wallet: WalletConnectionState;
};

export function WalletConnectCard({ wallet }: Props) {
  const {
    account,
    chainId,
    networkName,
    hasProvider,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    switchNetwork,
    error,
  } = wallet;

  const status = !hasProvider
    ? "MetaMask not detected"
    : account
      ? `Connected ${shorten(account)}`
      : "Not connected";

  return (
    <SectionCard
      title="Wallet"
      subtitle="Connect a compliant wallet via MetaMask"
      action={
        account ? (
          <span className="text-sm text-[var(--text-muted)]">{networkName ?? "Network"}</span>
        ) : null
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span className="badge-dot" style={{ backgroundColor: account ? "#22c55e" : "#f97316" }} />
          <span>{status}</span>
          {chainId ? <span className="text-xs text-[var(--text-muted)]">Chain {chainId}</span> : null}
        </div>

        {!hasProvider ? (
          <p className="text-sm text-[var(--text-muted)]">
            Install MetaMask to continue. Mobile users should use the MetaMask browser.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              className="primary"
              onClick={connectWallet}
              disabled={isConnecting || Boolean(account)}
            >
              {account ? "Connected" : isConnecting ? "Connecting..." : "Connect MetaMask"}
            </button>

            {!isCorrectNetwork && account ? (
              <button className="secondary" onClick={switchNetwork}>
                Switch to required network
              </button>
            ) : null}
          </div>
        )}

        {error ? <div className="alert error">{error}</div> : null}
      </div>
    </SectionCard>
  );
}
