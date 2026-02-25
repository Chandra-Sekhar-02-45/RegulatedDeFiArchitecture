"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { ShieldAlert, CheckCircle2, Copy, ShieldCheck, Activity, Send, Network, AlertCircle, RefreshCw } from "lucide-react";
import {
  ControllerTx,
  fetchBalance,
  fetchRecentTransactions,
  fetchTokenMeta,
  formatAmount,
  readUserProfile,
  registerWithSignature,
  registrationDigest,
  verifyGovernmentSignatureLocal,
} from "@/lib/contracts";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";

type Profile = {
  isVerified: boolean;
  totalVolume: bigint;
  riskScore: bigint;
};

type TxStatus = "idle" | "pending" | "success" | "error";

export default function ProfilePage() {
  const wallet = useWallet();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
    }
  }, [router]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [decimals, setDecimals] = useState<number>(18);
  const [symbol, setSymbol] = useState<string>("HBT");
  const [threshold, setThreshold] = useState<bigint | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [transactions, setTransactions] = useState<ControllerTx[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingTxs, setLoadingTxs] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txMessage, setTxMessage] = useState<string | undefined>();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [signature, setSignature] = useState("");

  const digest = useMemo(() => (wallet.account ? registrationDigest(wallet.account) : null), [wallet.account]);
  const localSignatureValid = useMemo(() => {
    if (!wallet.account || !signature) return null;
    return verifyGovernmentSignatureLocal(wallet.account, signature.trim());
  }, [wallet.account, signature]);

  const loadProfile = async () => {
    if (!wallet.account || !wallet.isCorrectNetwork) return;
    setLoadingProfile(true);
    try {
      const [{ isVerified, totalVolume, riskScore }, meta, bal] = await Promise.all([
        readUserProfile(wallet.account),
        fetchTokenMeta(),
        fetchBalance(wallet.account),
      ]);
      setProfile({ isVerified, totalVolume, riskScore });
      setDecimals(meta.decimals);
      setSymbol(meta.symbol);
      setThreshold(meta.threshold);
      setBalance(bal);
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err?.message ?? "Unable to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadTransactions = async () => {
    if (!wallet.isCorrectNetwork) return;
    setLoadingTxs(true);
    try {
      const txs = await fetchRecentTransactions(10);
      setTransactions(txs);
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err?.message ?? "Unable to load transactions");
    } finally {
      setLoadingTxs(false);
    }
  };

  useEffect(() => {
    if (!wallet.account || !wallet.isCorrectNetwork) {
      setProfile(null);
      setBalance(null);
      setTransactions([]);
      return;
    }
    loadProfile();
    loadTransactions();
  }, [wallet.account, wallet.isCorrectNetwork]);

  const handleRegister = async () => {
    if (!signature) {
      setRegisterError("Signature required.");
      return;
    }
    if (wallet.account && localSignatureValid === false) {
      setRegisterError("Signature does not match the configured government signer.");
      return;
    }
    setRegisterError(null);
    setRegistering(true);
    setTxStatus("pending");
    setTxMessage("Submitting registration to ledger...");
    try {
      await registerWithSignature(signature.trim());
      await loadProfile();
      setTxStatus("success");
      setTxMessage("Identity successfully registered.");
      setSignature("");
    } catch (err: any) {
      setTxStatus("error");
      setTxMessage(err?.message ?? "Registration failed");
      setRegisterError(err?.message ?? "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const connectivityDisabledReason = !wallet.account
    ? "Connect wallet first"
    : !wallet.isCorrectNetwork
      ? "Switch to required network"
      : null;

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-app-black pt-28 pb-20 selection:bg-app-white selection:text-app-black font-sans">
      <Header />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-app-white mb-2">Compliance Profile</h1>
          <p className="text-text-secondary text-sm">Manage your decentralized institutional identity and risk vectors.</p>
        </div>

        {/* Network & Wallet Warnings */}
        {!wallet.isCorrectNetwork && wallet.account && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-500 mb-1">Incorrect Network Detected</h3>
              <p className="text-sm text-yellow-500/80 mb-3">Please route to the certified regulatory subnet to continue transmitting data.</p>
              <PremiumButton size="sm" variant="ghost" onClick={wallet.switchNetwork}>
                Switch Network
              </PremiumButton>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Identity & Status */}
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="bg-surface-100/50 backdrop-blur-xl border border-surface-300 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-medium text-app-white mb-1">Entity Credentials</h2>
                  <p className="text-sm text-text-tertiary">Current network status</p>
                </div>
                {loadingProfile ? (
                  <div className="h-8 w-24 bg-surface-200 animate-pulse rounded-full" />
                ) : profile?.isVerified ? (
                  <div className="flex items-center gap-2 bg-surface-200 border border-surface-300 rounded-full py-1.5 px-3">
                    <div className="relative w-2 h-2">
                      <div className="absolute inset-0 bg-[#22c55e] rounded-full"></div>
                      <div className="absolute inset-0 bg-[#22c55e] rounded-full animate-ping opacity-70"></div>
                    </div>
                    <span className="text-xs font-semibold text-app-white tracking-wide">Certified Tier-1</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full py-1.5 px-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs font-semibold text-red-500 tracking-wide">Unverified Node</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-200/50 rounded-xl border border-surface-300 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-300 flex items-center justify-center">
                    <Network className="w-5 h-5 text-app-white" />
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Connected Address</p>
                    <p className="font-mono text-app-white text-sm">
                      {wallet.account ? formatAddress(wallet.account) : "No Active Keypair"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-surface-200/30 rounded-xl border border-surface-300/50">
                  <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-2">Liquid Balance</p>
                  <p className="text-2xl font-semibold text-app-white">
                    {balance !== null ? formatAmount(balance, decimals) : "—"} <span className="text-text-tertiary text-sm font-normal">{symbol}</span>
                  </p>
                </div>
                <div className="p-5 bg-surface-200/30 rounded-xl border border-surface-300/50">
                  <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-2">Algorithmic Risk</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-app-white">
                      {profile ? Number(profile.riskScore).toString() : "—"}
                    </p>
                    {profile && (
                      <span className={`text-xs ${Number(profile.riskScore) < 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                        {Number(profile.riskScore) < 50 ? "Low Risk" : "Elevated Risk"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Registration Provisioning Box */}
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-surface-100/30 border border-surface-300 rounded-3xl p-8 relative overflow-hidden"
            >
              <h2 className="text-lg font-medium text-app-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-text-secondary" /> Attach Identity Credentials
              </h2>
              <p className="text-sm text-text-tertiary mb-6">Execute the cryptographic payload provided by the compliance authority to attach your real-world identity to this node.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Signature Payload (HEX)</label>
                  <textarea
                    rows={3}
                    placeholder="0x..."
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    disabled={Boolean(connectivityDisabledReason)}
                    className="w-full bg-surface-200/50 border border-surface-300 rounded-xl p-4 text-app-white font-mono text-sm placeholder:text-text-tertiary focus:outline-none focus:border-app-white focus:bg-surface-200 transition-colors resize-none"
                  />
                </div>

                {registerError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-500">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    {registerError}
                  </div>
                )}

                {/* Local Pre-validation */}
                {signature && localSignatureValid !== null && (
                  <div className={`p-3 border rounded-lg flex items-center gap-2 text-sm ${localSignatureValid ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {localSignatureValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                    {localSignatureValid ? "Pre-check Valid: Signature maps to Government Assessor" : "Pre-check Failed: Signature does not map to Authority"}
                  </div>
                )}

                <PremiumButton
                  size="lg"
                  className="w-full mt-2"
                  onClick={handleRegister}
                  disabled={registering || Boolean(connectivityDisabledReason) || !signature}
                >
                  {connectivityDisabledReason || (registering ? "Transmitting..." : "Submit Identity Payload")}
                </PremiumButton>

                <div className="mt-4 p-4 bg-surface-200/30 rounded-xl border border-surface-300 space-y-2 font-mono text-xs text-text-tertiary">
                  <div className="flex justify-between">
                    <span>Target Assessor:</span>
                    <span className="text-text-secondary">{process.env.NEXT_PUBLIC_AUTHORITY_ADDRESS?.substring(0, 10) || "none"}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Identity Digest:</span>
                    <span className="text-text-secondary">{digest ? `${digest.substring(0, 14)}...` : "—"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Layout: Actions & Queue */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Status Notifier */}
            {(txStatus !== "idle" || txMessage) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-5 border rounded-2xl ${txStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  txStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                    'bg-surface-200 border-surface-300 text-app-white'
                  }`}
              >
                <h4 className="text-sm font-semibold mb-1 uppercase tracking-wider">System Event</h4>
                <p className="text-sm opacity-90 leading-relaxed">{txMessage}</p>
              </motion.div>
            )}

            {/* Quick Actions / Refresh */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-100 rounded-2xl p-6 border border-surface-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-app-white uppercase tracking-wider">Sync State</h3>
                <button onClick={() => { loadProfile(); loadTransactions(); }} disabled={loadingProfile || loadingTxs} className="text-text-tertiary hover:text-app-white transition-colors">
                  <RefreshCw className={`w-4 h-4 ${loadingProfile || loadingTxs ? 'animate-spin opacity-50' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-text-tertiary leading-relaxed mb-4">
                Pull latest deterministic state from the subnet including your updated risk scores and pending transactions.
              </p>
              <PremiumButton variant="glass" size="sm" className="w-full" onClick={() => { loadProfile(); loadTransactions(); }} disabled={loadingProfile || loadingTxs}>
                Force Resync
              </PremiumButton>
            </motion.div>

            {/* Transaction Queue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-100 rounded-2xl p-6 border border-surface-300 flex-1 flex flex-col"
            >
              <h3 className="text-sm font-medium text-app-white flex items-center gap-2 mb-4 uppercase tracking-wider">
                <Activity className="w-4 h-4" /> Activity Queue
              </h3>

              <div className="flex-1 flex flex-col gap-3">
                {loadingTxs ? (
                  <div className="flex items-center justify-center p-8 text-text-tertiary text-sm">Synchronizing ledger...</div>
                ) : transactions.length === 0 ? (
                  <div className="flex items-center justify-center p-8 text-text-tertiary text-sm">No transaction blocks found.</div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id.toString()} className="flex flex-col gap-2 p-3 bg-surface-200/50 border border-surface-300/50 rounded-xl hover:bg-surface-200 transition-colors group cursor-default">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-text-secondary bg-surface-300 px-2 py-0.5 rounded-sm">TX #{tx.id.toString()}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tx.executed ? (tx.approved ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500") : "bg-yellow-500/10 text-yellow-500"}`}>
                          {tx.executed ? (tx.approved ? "Approved" : "Rejected") : "Pending Review"}
                        </span>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Amount</span>
                          <span className="text-sm font-semibold text-app-white">{formatAmount(tx.amount, decimals)} <span className="text-xs font-normal text-text-tertiary">{symbol}</span></span>
                        </div>
                        <div className="text-right flex flex-col gap-0.5">
                          <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Hash Route</span>
                          <span className="text-xs font-mono text-text-secondary">{tx.from.slice(0, 4)}.. → {tx.to.slice(0, 4)}..</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}
