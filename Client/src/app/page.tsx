"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { ArrowRight, ShieldCheck, Link2 } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-app-black flex flex-col items-center justify-center selection:bg-app-white selection:text-app-black">
      {/* Header */}
      <Header />

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] opacity-50 blur-3xl animate-[pulse_10s_infinite_alternate]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-surface-300 rounded-full bg-surface-100/50 backdrop-blur-md mb-8 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-app-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">
            Government Certified Decentralized Network
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-app-white leading-[1.05] mb-6 max-w-4xl"
        >
          Institutional DeFi.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-app-white via-text-secondary to-surface-300">
            Regulated. Cryptographic.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 font-medium leading-relaxed"
        >
          The first hybrid decentralized banking protocol operating securely within federal compliance frameworks. Execute high-volume transactions with cryptographic certainty.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <PremiumButton size="lg" variant="primary">
            Enter Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </PremiumButton>
          <PremiumButton size="lg" variant="ghost" className="hidden sm:inline-flex">
            View Audit Reports <ShieldCheck className="w-5 h-5 ml-2 text-text-tertiary" />
          </PremiumButton>
        </motion.div>
      </div>

      {/* Geometric Floating Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden perspective-1000">
        <motion.div
          initial={{ y: 0, rotate: 0 }}
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] opacity-20"
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="#FAFAFA" strokeWidth="1" fill="transparent" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ y: 0, rotate: 0 }}
          animate={{ y: [20, -30, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[15%] right-[15%] opacity-10"
        >
          <svg width="160" height="160" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#FAFAFA" strokeWidth="0.5" strokeDasharray="4 4" fill="transparent" />
            <rect x="25" y="25" width="50" height="50" stroke="#FAFAFA" strokeWidth="1" fill="transparent" />
          </svg>
        </motion.div>
      </div>
    </main>
  );
}
