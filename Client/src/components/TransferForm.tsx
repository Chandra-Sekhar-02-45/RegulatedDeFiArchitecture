"use client";

import { FormEvent, useState } from "react";
import { SectionCard } from "./SectionCard";

type TransferFormProps = {
  title: string;
  description: string;
  buttonLabel: string;
  disabledReason?: string | null;
  onSubmit: (payload: { to: string; amount: string }) => Promise<void>;
  highlight?: "warn" | "error" | "info";
  footer?: React.ReactNode;
};

export function TransferForm({
  title,
  description,
  buttonLabel,
  disabledReason,
  onSubmit,
  highlight,
  footer,
}: TransferFormProps) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const disabled = Boolean(disabledReason) || submitting;
  const bannerText = highlight === "warn"
    ? "Compliance check required for larger transfers."
    : disabledReason ?? (highlight === "info" ? "Transfers are logged for audit visibility." : null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!to || !amount) {
      setLocalError("Recipient and amount are required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ to, amount });
      setAmount("");
      setTo("");
    } catch (err: any) {
      setLocalError(err?.message ?? "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionCard title={title} subtitle={description}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          <span className="form-label">Recipient address</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            autoComplete="off"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="form-label">Amount (ETH)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.05"
            type="number"
            min="0"
            step="0.0001"
          />
        </label>

        {highlight && bannerText ? (
          <div className={`alert ${highlight === "warn" ? "info" : highlight}`}>
            {bannerText}
          </div>
        ) : null}

        {localError ? <div className="alert error">{localError}</div> : null}

        <button className="primary" type="submit" disabled={disabled}>
          {submitting ? "Submitting..." : disabledReason ?? buttonLabel}
        </button>

        {footer}
      </form>
    </SectionCard>
  );
}
