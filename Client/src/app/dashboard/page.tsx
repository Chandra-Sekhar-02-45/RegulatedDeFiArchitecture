"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Copy, Plus, Send, Activity, History, ShieldAlert, BadgeCheck } from "lucide-react";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useRouter } from "next/navigation";

const MOCK_TRANSACTIONS = [
    { id: "0x3f...", amount: "45,000.00 USDC", type: "Incoming", date: "2 mins ago", status: "Verified" },
    { id: "0xa2...", amount: "12,500.00 USDC", type: "Outgoing", date: "1 hour ago", status: "Verified" },
    { id: "0x88...", amount: "100.00 USDC", type: "Incoming", date: "5 hours ago", status: "Verified" },
    { id: "0x1c...", amount: "5,000.00 USDC", type: "Outgoing", date: "Yesterday", status: "Flagged" },
];

export default function Dashboard() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const { account } = useWeb3();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const isAuth = localStorage.getItem("isAuthenticated");
        if (!isAuth) {
            router.push("/login");
        }
    }, [router]);

    const formatAddress = (addr: string) => {
        if (!addr) return "";
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    if (!isMounted) return null;

    return (
        <main className="min-h-screen bg-app-black pt-28 pb-20 selection:bg-app-white selection:text-app-black">
            <Header />

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Wallet Summary & Quick Transfer */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-surface-100/50 backdrop-blur-xl border border-surface-300 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-text-secondary text-sm font-medium mb-1">Total Balance</h2>
                                <p className="text-4xl font-mono text-app-white tracking-tight tabular-nums">
                                    $2,450,912.00
                                </p>
                            </div>

                            {/* Certification Badge */}
                            <div className="flex items-center gap-2 bg-surface-200 border border-surface-300 rounded-full py-1.5 px-3">
                                <div className="relative w-2 h-2">
                                    <div className="absolute inset-0 bg-app-white rounded-full"></div>
                                    <div className="absolute inset-0 bg-app-white rounded-full animate-ping opacity-70"></div>
                                </div>
                                <span className="text-xs font-semibold text-app-white tracking-wide">Certified</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-surface-200 rounded-xl border border-surface-300">
                            <span className="font-mono text-text-secondary text-sm">
                                {account ? formatAddress(account) : "Not Connected"}
                            </span>
                            <button className="text-text-tertiary hover:text-app-white transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <button className="flex flex-col items-center justify-center gap-2 py-4 bg-surface-100/30 border border-surface-300 rounded-xl hover:bg-surface-100 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center group-hover:bg-app-white group-hover:text-app-black transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-sm text-text-secondary">Deposit</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 py-4 bg-surface-100/30 border border-surface-300 rounded-xl hover:bg-surface-100 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center group-hover:bg-app-white group-hover:text-app-black transition-colors">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-sm text-text-secondary">Analytics</span>
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Main Transfer Interface & History */}
                <div className="lg:col-span-8 flex flex-col gap-8">

                    {/* Main Transfer Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-surface-100 rounded-3xl p-8 border border-surface-300"
                    >
                        <h2 className="text-xl font-semibold text-app-white mb-6 flex items-center gap-2">
                            <Send className="w-5 h-5" /> Execute Transfer
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Recipient Address</label>
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    className="w-full bg-transparent border-b border-surface-300 py-3 text-lg font-mono text-app-white placeholder:text-text-tertiary focus:outline-none focus:border-app-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Amount (USDC)</label>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-mono text-text-tertiary">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-transparent border-b border-surface-300 py-3 pl-8 text-4xl font-mono tabular-nums text-app-white placeholder:text-text-tertiary focus:outline-none focus:border-app-white transition-colors"
                                    />
                                </div>
                                <div className="mt-2 text-sm text-text-tertiary flex items-center justify-between">
                                    <span>Available: 2,450,912.00 USDC</span>
                                    {amount && parseFloat(amount) > 10000 && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-app-white flex items-center gap-1"
                                        >
                                            <BadgeCheck className="w-4 h-4" /> Compliance Check: Auto-Clearing
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            <PremiumButton className="w-full" size="lg">Review Transfer</PremiumButton>
                        </div>
                    </motion.div>

                    {/* Transaction History */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-text-secondary flex items-center gap-2">
                            <History className="w-5 h-5" /> Recent Activity
                        </h3>

                        <motion.div
                            className="bg-surface-100 rounded-xl border border-surface-300 overflow-hidden"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        >
                            {MOCK_TRANSACTIONS.map((tx, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="flex items-center justify-between p-4 border-b border-surface-300/50 last:border-0 hover:bg-surface-200 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'Incoming' ? 'bg-surface-300' : 'bg-surface-200'}`}>
                                            {tx.type === 'Incoming' ? <Activity className="w-4 h-4 text-app-white" /> : <Send className="w-4 h-4 text-app-white" />}
                                        </div>
                                        <div>
                                            <p className="font-mono text-app-white text-sm">{tx.id}</p>
                                            <p className="text-xs text-text-tertiary">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <p className={`font-mono text-sm tabular-nums ${tx.type === 'Incoming' ? 'text-app-white' : 'text-text-secondary'}`}>
                                                {tx.type === 'Incoming' ? '+' : '-'}{tx.amount}
                                            </p>
                                            <span className="text-xs text-text-tertiary">{tx.status}</span>
                                        </div>
                                        <span className="text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">↗</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
}
