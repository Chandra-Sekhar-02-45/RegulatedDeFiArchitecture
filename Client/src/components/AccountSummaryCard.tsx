import { WalletConnectionState } from "@/hooks/useWallet";
import { SectionCard } from "./SectionCard";

function shorten(address?: string | null) {
  if (!address) return "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type Props = {
  wallet: WalletConnectionState;
  certificationBadge: React.ReactNode;
};

export function AccountSummaryCard({ wallet, certificationBadge }: Props) {
  const { account, chainId, networkName, isAuthority, isCorrectNetwork } = wallet;

  return (
    <SectionCard
      title="Account Summary"
      subtitle="Connection, network and compliance posture"
      action={certificationBadge}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-[var(--text-muted)]">Wallet</span>
          <strong className="text-base">{shorten(account)}</strong>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[var(--text-muted)]">Network</span>
          <strong className="text-base">{chainId ? `Chain ${chainId}` : "Unknown"}</strong>
          <span className="text-xs text-[var(--text-muted)]">{networkName ?? ""}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[var(--text-muted)]">Authority</span>
          <strong className="text-base">{isAuthority ? "Yes" : "No"}</strong>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[var(--text-muted)]">Network status</span>
          <strong className="text-base">{isCorrectNetwork ? "Aligned" : "Mismatch"}</strong>
        </div>
      </div>
    </SectionCard>
  );
}
