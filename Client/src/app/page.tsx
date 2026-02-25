"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { PremiumButton } from "@/components/ui/PremiumButton";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, Lock, Database, Network } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-app-black flex flex-col selection:bg-app-white selection:text-app-black font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] opacity-50 blur-3xl animate-[pulse_10s_infinite_alternate]" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
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
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-app-white leading-[1.05] mb-6 max-w-4xl"
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
            <Link href="/signup">
              <PremiumButton size="lg" variant="primary">
                Open Account <ArrowRight className="w-5 h-5 ml-2" />
              </PremiumButton>
            </Link>
            <Link href="/login">
              <PremiumButton size="lg" variant="ghost" className="hidden sm:inline-flex">
                Sign In to Portal
              </PremiumButton>
            </Link>
          </motion.div>
        </div>

        {/* Geometric Floating Elements (Repositioned to hero only) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden perspective-1000 hidden lg:block">
          <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] opacity-20"
          >
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="#FAFAFA" strokeWidth="1" fill="transparent" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [20, -30, 20], rotate: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[20%] right-[15%] opacity-10"
          >
            <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="#FAFAFA" strokeWidth="0.5" strokeDasharray="4 4" fill="transparent" />
              <rect x="25" y="25" width="50" height="50" stroke="#FAFAFA" strokeWidth="1" fill="transparent" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Trusted Partners Marquee */}
      <section className="relative py-12 border-y border-surface-300/50 bg-surface-100/20 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-app-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-app-black to-transparent z-10" />

        <div className="flex gap-16 items-center w-max animate-marquee">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-16 items-center pr-16">
              <span className="font-mono text-text-tertiary font-semibold tracking-widest text-lg uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> SEC Compliant
              </span>
              <span className="font-mono text-text-tertiary font-semibold tracking-widest text-lg uppercase flex items-center gap-2">
                <Network className="w-5 h-5" /> ISO 27001
              </span>
              <span className="font-mono text-text-tertiary font-semibold tracking-widest text-lg uppercase flex items-center gap-2">
                <Lock className="w-5 h-5" /> SOC2 Type II
              </span>
              <span className="font-mono text-text-tertiary font-semibold tracking-widest text-lg uppercase flex items-center gap-2">
                <Database className="w-5 h-5" /> Basel III Validated
              </span>
              <span className="font-mono text-text-tertiary font-semibold tracking-widest text-lg uppercase flex items-center gap-2">
                <Activity className="w-5 h-5" /> FINRA Audited
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Features Bento Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-app-white tracking-tight mb-4">Architecture of the Future</h2>
          <p className="text-text-secondary">Designed for scale, secured by mathematics, governed by policy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {/* Large Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-surface-100/40 backdrop-blur-md border border-surface-300 rounded-3xl p-8 lg:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <Network className="w-32 h-32 text-app-white" />
            </div>
            <h3 className="text-2xl font-semibold text-app-white mb-4 relative z-10">Private Subnet Consensus</h3>
            <p className="text-text-secondary leading-relaxed max-w-md relative z-10">
              Our proprietary Level-2 architecture isolates institutional capital flow from public mempools, preventing front-running and ensuring absolute settlement finality in under 200ms.
            </p>
          </motion.div>

          {/* Small Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-surface-100/40 backdrop-blur-md border border-surface-300 rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-surface-200 rounded-2xl flex items-center justify-center border border-surface-300 mb-6 group-hover:bg-app-white group-hover:text-app-black transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-app-white mb-3">Identity Primitives</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Cryptographic KYC state channels map legal entities to on-chain signatures without exposing PII.
            </p>
          </motion.div>

          {/* Small Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-surface-100/40 backdrop-blur-md border border-surface-300 rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-surface-200 rounded-2xl flex items-center justify-center border border-surface-300 mb-6 group-hover:bg-app-white group-hover:text-app-black transition-colors">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-app-white mb-3">Algorithmic Auditing</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Continuous smart contract proofs monitor liquidity depth and aggregate risk thresholds automatically.
            </p>
          </motion.div>

          {/* Large Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-surface-100/40 backdrop-blur-md border border-surface-300 rounded-3xl p-8 lg:p-12 pl-8 lg:pl-12 relative overflow-hidden group flex flex-col justify-end min-h-[300px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface-200/50 to-transparent z-0" />
            <div className="absolute top-0 right-10 translate-y-10 w-64 h-32 bg-surface-300/30 border border-surface-300 rounded-t-xl z-0 group-hover:translate-y-8 transition-transform duration-500">
              <div className="w-full h-8 border-b border-surface-300 bg-surface-200 rounded-t-xl flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <div className="ml-2 w-24 h-2 bg-surface-300 rounded-full" />
              </div>
              <div className="p-4 space-y-2">
                <div className="w-3/4 h-2 bg-surface-300 rounded-full" />
                <div className="w-1/2 h-2 bg-surface-300 rounded-full" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-app-white mb-4">Programmable Compliance API</h3>
              <p className="text-text-secondary leading-relaxed max-w-md">
                Embed federal clearing logics directly into your transactional code. Pre-flight checks ensure zero failed settlements.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
