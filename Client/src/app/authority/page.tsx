"use client";

import { useState } from "react";
import { SectionCard } from "@/components/SectionCard";
import { TransactionAlerts } from "@/components/TransactionAlerts";
import { certifyUser } from "@/lib/contracts";
import { useWallet } from "@/hooks/useWallet";

export default function AuthorityDashboard() {
  const wallet = useWallet();
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const handleCertify = async () => {
    if (!target) {
      setError("Target address required.");
      return;
    }
    setError(null);
    setStatus("pending");
    setMessage("Submitting certification transaction...");
    try {
      await certifyUser(target);
      setStatus("success");
      setMessage("User certified successfully.");
      setTarget("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message ?? "Certification failed.");
    }
  };

  const gatedMessage = !wallet.account
    ? "Connect the authority wallet to proceed."
    : !wallet.isAuthority
      ? "This route is restricted to the configured authority address."
      : !wallet.isCorrectNetwork
        ? "Switch to the required network to manage certifications."
        : null;

  const disableActions = Boolean(gatedMessage);

  return (
    <main className="container-shell flex flex-col gap-6 pb-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--text-muted)]">Authority</p>
        <h1 className="text-3xl font-semibold">Government Certification Desk</h1>
        <p className="text-[var(--text-muted)] max-w-2xl">
          Only the configured authority wallet can grant certification to citizen wallets. All writes go
          through the IdentityRegistry contract.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <SectionCard
            title="Certify user"
            subtitle="Issue compliance approval on-chain"
            action={
              <button className="primary" onClick={handleCertify} disabled={disableActions}>
                Certify user
              </button>
            }
          >
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-2">
                <span className="form-label">User address</span>
                <input
                  placeholder="0x..."
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={disableActions}
                />
              </label>
              {gatedMessage ? <div className="alert info">{gatedMessage}</div> : null}
              {error ? <div className="alert error">{error}</div> : null}
            </div>
          </SectionCard>
        </div>
        <div className="flex flex-col gap-4">
          <SectionCard title="Status" subtitle="Transaction updates">
            <TransactionAlerts status={status} message={message} />
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
