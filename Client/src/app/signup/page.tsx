"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Lock, Mail, User, ShieldCheck, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate a network request
        setTimeout(() => {
            localStorage.setItem("isAuthenticated", "true");
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-app-black flex items-center justify-center relative overflow-hidden selection:bg-app-white selection:text-app-black px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)] opacity-50 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_50%)] opacity-50 blur-3xl" />
            </div>

            <Link href="/" className="absolute top-8 left-8 z-10 hidden sm:flex items-center gap-2 text-text-secondary hover:text-app-white transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span className="font-medium text-sm">Return to Protocol</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[500px] relative z-10 py-12"
            >
                <div className="flex justify-center mb-6">
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 5L90 27V73L50 95L10 73V27L50 5Z" stroke="#FAFAFA" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M35 38C35 29.7157 41.7157 23 50 23C58.2843 23 65 29.7157 65 38C65 44.5 61 50 55 52V65C55 67.7614 52.7614 70 50 70C47.2386 70 45 67.7614 45 65V52C39 50 35 44.5 35 38Z" fill="#1A1A1A" stroke="#FAFAFA" strokeWidth="2" />
                    </svg>
                </div>

                <div className="bg-surface-100/50 backdrop-blur-xl border border-surface-300 rounded-3xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-app-white tracking-tight mb-2">Initialize Account</h1>
                        <p className="text-text-secondary text-sm">Provision a secure institutional identity</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-text-secondary ml-1 uppercase tracking-wider">Entity Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-text-tertiary" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-surface-200/50 border border-surface-300 rounded-xl py-3 pl-10 pr-4 text-app-white placeholder:text-text-tertiary focus:outline-none focus:border-app-white focus:bg-surface-200 transition-colors sm:text-sm"
                                    placeholder="e.g. Acme Corp LLC"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-text-secondary ml-1 uppercase tracking-wider">Email Node</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-text-tertiary" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface-200/50 border border-surface-300 rounded-xl py-3 pl-10 pr-4 text-app-white placeholder:text-text-tertiary focus:outline-none focus:border-app-white focus:bg-surface-200 transition-colors sm:text-sm"
                                    placeholder="identity@institution.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-text-secondary ml-1 uppercase tracking-wider">Access Key</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-text-tertiary" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface-200/50 border border-surface-300 rounded-xl py-3 pl-10 pr-4 text-app-white placeholder:text-text-tertiary focus:outline-none focus:border-app-white focus:bg-surface-200 transition-colors sm:text-sm"
                                    placeholder="Create strong password"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-4 mb-8 bg-surface-200/30 p-3 rounded-xl border border-surface-300/50">
                            <ShieldCheck className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                            <p className="text-xs text-text-secondary leading-relaxed">
                                By provisioning this node, you agree to the regulatory oversight protocols and identity attestation mandates of the network.
                            </p>
                        </div>

                        <PremiumButton size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? "Provisioning..." : "Provision Node"}
                        </PremiumButton>
                    </form>

                    <div className="mt-8 pt-6 border-t border-surface-300/50 text-center">
                        <p className="text-sm text-text-secondary">
                            Already verified?{" "}
                            <Link href="/login" className="text-app-white hover:underline underline-offset-4 font-medium transition-colors">
                                Access Portal
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
