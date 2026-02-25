"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
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
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)] opacity-50 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_50%)] opacity-50 blur-3xl" />
            </div>

            <Link href="/" className="absolute top-8 left-8 z-10 hidden sm:flex items-center gap-2 text-text-secondary hover:text-app-white transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span className="font-medium text-sm">Return to Protocol</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 5L90 27V73L50 95L10 73V27L50 5Z" stroke="#FAFAFA" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M35 38C35 29.7157 41.7157 23 50 23C58.2843 23 65 29.7157 65 38C65 44.5 61 50 55 52V65C55 67.7614 52.7614 70 50 70C47.2386 70 45 67.7614 45 65V52C39 50 35 44.5 35 38Z" fill="#FAFAFA" />
                    </svg>
                </div>

                <div className="bg-surface-100/50 backdrop-blur-xl border border-surface-300 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-app-white tracking-tight mb-2">Access Portal</h1>
                        <p className="text-text-secondary text-sm">Sign in to your regulated identity</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
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
                                    placeholder="••••••••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mt-2 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-surface-300 bg-surface-200 text-app-white focus:ring-1 focus:ring-app-white/20 w-4 h-4 cursor-pointer" />
                                <span className="text-text-secondary group-hover:text-app-white transition-colors">Trust device</span>
                            </label>
                            <a href="#" className="text-text-secondary hover:text-app-white transition-colors">Recover Keys</a>
                        </div>

                        <PremiumButton size="lg" className="w-full mt-6" disabled={isLoading}>
                            {isLoading ? "Authenticating..." : "Authorize Access"}
                        </PremiumButton>
                    </form>

                    <div className="mt-8 pt-6 border-t border-surface-300/50 text-center">
                        <p className="text-sm text-text-secondary">
                            Identity not registered?{" "}
                            <Link href="/signup" className="text-app-white hover:underline underline-offset-4 font-medium transition-colors">
                                Initialize Account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
