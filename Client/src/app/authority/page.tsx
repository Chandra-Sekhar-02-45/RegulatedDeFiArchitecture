"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Search, Filter, MoreHorizontal, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

const MOCK_USERS = [
  { id: "0x12a3...8f9e", name: "Acme Corp", kycLevel: "Tier 3", status: "Certified", volume: "$50.2M", lastActive: "2m ago" },
  { id: "0x4b7c...21da", name: "Jane Smith", kycLevel: "Tier 1", status: "Pending", volume: "$12.4K", lastActive: "1d ago" },
  { id: "0x98df...3a11", name: "Global Trade Inc.", kycLevel: "Tier 3", status: "Flagged", volume: "$102.5M", lastActive: "Just now" },
  { id: "0x56a1...b2c3", name: "John Doe", kycLevel: "Tier 2", status: "Certified", volume: "$450K", lastActive: "1h ago" },
];

export default function AuthorityDashboard() {
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);

  return (
    <main className="min-h-screen bg-app-black pt-28 pb-10 flex flex-col selection:bg-app-white selection:text-app-black">
      <Header />

      <div className="w-full max-w-[1400px] mx-auto px-6 flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-app-white mb-2">Authority Console</h1>
            <p className="text-text-secondary text-sm">Manage identities and regulatory compliance on the subnet.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search addresses..."
                className="pl-9 pr-4 py-2 bg-surface-100 border border-surface-300 rounded-lg text-sm text-app-white focus:outline-none focus:border-app-white transition-colors w-64"
              />
            </div>
            <button className="p-2 bg-surface-100 border border-surface-300 rounded-lg hover:bg-surface-200 transition-colors">
              <Filter className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="flex-1 bg-surface-100/30 border border-surface-300 rounded-xl overflow-hidden relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-300 text-xs font-medium text-text-secondary uppercase tracking-wider bg-surface-100">
                <th className="py-4 px-6 font-medium">Identifier</th>
                <th className="py-4 px-6 font-medium">Entity Name</th>
                <th className="py-4 px-6 font-medium">KYC Level</th>
                <th className="py-4 px-6 font-medium">Volume</th>
                <th className="py-4 px-6 font-medium">Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedUser(user)}
                  className="border-b border-surface-300/50 last:border-0 hover:bg-surface-200/50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-6 font-mono text-app-white text-sm">{user.id}</td>
                  <td className="py-4 px-6 text-text-primary text-sm font-medium">{user.name}</td>
                  <td className="py-4 px-6 text-text-secondary text-sm">{user.kycLevel}</td>
                  <td className="py-4 px-6 font-mono tabular-nums text-text-secondary text-sm">{user.volume}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${user.status === 'Certified' ? 'bg-app-white/10 border-app-white/20 text-app-white' :
                          user.status === 'Flagged' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                            'bg-surface-300/30 border-surface-300 flex-text-secondary'
                        }`}>
                        {user.status === 'Certified' && <CheckCircle2 className="w-3 h-3" />}
                        {user.status === 'Flagged' && <ShieldAlert className="w-3 h-3" />}
                        {user.status}
                      </span>
                      <MoreHorizontal className="w-4 h-4 text-text-tertiary group-hover:text-app-white transition-colors" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Right Slide-over Drawer for Management */}
          <AnimatePresence>
            {selectedUser && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedUser(null)}
                  className="absolute inset-0 bg-app-black/40 backdrop-blur-[2px] z-10"
                />
                <motion.div
                  initial={{ x: "100%", opacity: 0.8 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0.8 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute top-0 right-0 bottom-0 w-[400px] bg-surface-100 border-l border-surface-300 p-6 z-20 shadow-2xl flex flex-col"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-medium text-app-white mb-1">Entity Details</h3>
                      <p className="font-mono text-text-secondary text-xs">{selectedUser.id}</p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-text-tertiary hover:text-app-white transition-colors">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-tertiary mb-1">Entity Name</p>
                        <p className="text-app-white font-medium">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-text-tertiary mb-1">KYC Check</p>
                        <p className="text-app-white font-medium">{selectedUser.kycLevel}</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-surface-300" />

                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-3">Attestation Controls</h4>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-app-white/5 border border-surface-300 rounded-lg text-sm text-app-white hover:bg-app-white/10 transition-colors flex justify-between items-center group">
                          Issue Certification
                          <CheckCircle2 className="w-4 h-4 text-text-tertiary group-hover:text-app-white transition-colors" />
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors flex justify-between items-center group">
                          Revoke & Restrict
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
