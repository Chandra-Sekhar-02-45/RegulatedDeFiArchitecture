"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { useWeb3 } from "@/context/Web3Context";

const Logo = () => {
    return (
        <div className="flex items-center gap-3">
            <motion.svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                {/* Outer Hexagon */}
                <motion.path
                    d="M50 5L90 27V73L50 95L10 73V27L50 5Z"
                    stroke="#FAFAFA"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Shield/Keyhole Hybrid */}
                <motion.path
                    d="M35 38C35 29.7157 41.7157 23 50 23C58.2843 23 65 29.7157 65 38C65 44.5 61 50 55 52V65C55 67.7614 52.7614 70 50 70C47.2386 70 45 67.7614 45 65V52C39 50 35 44.5 35 38Z"
                    fill="#1A1A1A"
                    stroke="#FAFAFA"
                    strokeWidth="3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                />

                {/* Central Certified Dot */}
                <motion.circle
                    cx="50"
                    cy="38"
                    r="4"
                    fill="#FAFAFA"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8, type: "spring" }}
                />

                {/* Radar Pulse Effect */}
                <motion.circle
                    cx="50"
                    cy="38"
                    r="4"
                    stroke="#FAFAFA"
                    strokeWidth="1"
                    fill="transparent"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 3.5, opacity: 0 }}
                    transition={{
                        delay: 2.2,
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />
            </motion.svg>
            <span className="font-semibold tracking-tight text-app-white text-lg hidden sm:inline-block">
                Regulated DeFi
            </span>
        </div>
    );
};

export function Header() {
    const { account, connectWallet, isConnecting, disconnectWallet } = useWeb3();

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-6 px-4"
        >
            <div className="flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-surface-100/40 backdrop-blur-2xl border border-surface-300 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <Link href="/">
                    <Logo />
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-text-secondary">
                    <Link href="/dashboard" className="hover:text-app-white transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/authority" className="hover:text-app-white transition-colors">
                        Authority
                    </Link>
                    <Link href="/compliance" className="hover:text-app-white transition-colors">
                        Compliance
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {account ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-app-white bg-surface-200 px-3 py-1.5 rounded-md border border-surface-300 shadow-inner">
                                {formatAddress(account)}
                            </span>
                            <PremiumButton size="sm" variant="ghost" onClick={disconnectWallet}>
                                Disconnect
                            </PremiumButton>
                        </div>
                    ) : (
                        <PremiumButton size="sm" variant="glass" onClick={connectWallet} disabled={isConnecting}>
                            {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </PremiumButton>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
