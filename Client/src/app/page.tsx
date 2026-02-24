"use client";

import { useEffect, useState } from "react";
import { AccountSummaryCard } from "@/components/AccountSummaryCard";
import { CertificationBadge } from "@/components/CertificationBadge";
import { NetworkWarning } from "@/components/NetworkWarning";
import { SectionCard } from "@/components/SectionCard";
import { TransactionAlerts } from "@/components/TransactionAlerts";
import { TransferForm } from "@/components/TransferForm";
import { WalletConnectCard } from "@/components/WalletConnectCard";
import { readCertificationStatus, submitLargeTransfer, submitSmallTransfer } from "@/lib/contracts";
import { useWallet } from "@/hooks/useWallet";

type TxStatus = "idle" | "pending" | "success" | "error";

export default function DashboardPage() {
  const wallet = useWallet();
  const [isCertified, setIsCertified] = useState<boolean | null>(null);
  const [checkingCertification, setCheckingCertification] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txMessage, setTxMessage] = useState<string | undefined>();
  const [readError, setReadError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!wallet.account || !wallet.isCorrectNetwork) {
        setIsCertified(null);
        return;
      }
      try {
        setCheckingCertification(true);
        setReadError(null);
        const certified = await readCertificationStatus(wallet.account);
        setIsCertified(Boolean(certified));
      } catch (err: any) {
        setReadError(err?.message ?? "Could not read certification status");
      } finally {
        setCheckingCertification(false);
      }
    };
    run();
  }, [wallet.account, wallet.isCorrectNetwork]);

  const handleSmallTransfer = async ({ to, amount }: { to: string; amount: string }) => {
    setTxStatus("pending");
    setTxMessage("Submitting small transfer...");
    try {
      await submitSmallTransfer(to, amount);
      setTxStatus("success");
      setTxMessage("Small transfer confirmed.");
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err?.message ?? "Small transfer failed.");
    }
  };

  const handleLargeTransfer = async ({ to, amount }: { to: string; amount: string }) => {
    if (!isCertified) {
      setTxStatus("error");
      setTxMessage("Certification required for large transfers.");
      return;
    }

    setTxStatus("pending");
    setTxMessage("Submitting large transfer with compliance validation...");
    try {
      await submitLargeTransfer(to, amount);
      setTxStatus("success");
      setTxMessage("Large transfer confirmed.");
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err?.message ?? "Large transfer failed.");
    }
  };

  const connectivityDisabledReason = !wallet.account
    ? "Connect wallet"
    : !wallet.isCorrectNetwork
      ? "Switch to required network"
      : null;

  const largeDisabledReason = connectivityDisabledReason ?? (!isCertified ? "Certification required" : null);

  return (
    <main className="container-shell flex flex-col gap-6 pb-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--text-muted)]">Hybrid banking</p>
        <h1 className="text-3xl sm:text-4xl font-semibold">Regulated DeFi Architecture</h1>
        <p className="text-[var(--text-muted)] max-w-2xl">
          Compliance-aware decentralized banking: small transfers for everyone, certified large transfers
          enforced by smart contracts.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <WalletConnectCard wallet={wallet} />
          {!wallet.isCorrectNetwork && wallet.account ? (
            <NetworkWarning onSwitch={wallet.switchNetwork} />
          ) : null}
          <AccountSummaryCard
            wallet={wallet}
            certificationBadge={<CertificationBadge certified={isCertified} loading={checkingCertification} />}
          />
        </div>

        <div className="flex flex-col gap-4">
          <SectionCard title="Notifications" subtitle="Transaction lifecycle">
            <TransactionAlerts status={txStatus} message={txMessage} />
            {readError ? <div className="alert error mt-3">{readError}</div> : null}
            {!wallet.hasProvider ? (
              <div className="alert info mt-3">Install MetaMask to continue.</div>
            ) : null}
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransferForm
          title="Small transfer"
          description="Fast-path transfers allowed for all users"
          buttonLabel="Send small transfer"
          disabledReason={connectivityDisabledReason}
          onSubmit={handleSmallTransfer}
          highlight="info"
          footer={<p className="text-xs text-[var(--text-muted)]">Recommended for &lt;$1k equivalent.</p>}
        />

        <TransferForm
          title="Large transfer"
          description="Enforces certification via IdentityRegistry"
          buttonLabel="Send large transfer"
          disabledReason={largeDisabledReason}
          onSubmit={handleLargeTransfer}
          highlight={largeDisabledReason ? "error" : "warn"}
          footer={
            <div className="text-xs text-[var(--text-muted)] flex flex-col gap-1">
              <span>Requires certification + correct network.</span>
              <span>Authority can certify accounts in the dashboard.</span>
            </div>
          }
        />
      </div>
    </main>
  );
}
