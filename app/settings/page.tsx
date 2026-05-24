'use client';

import { useEffect, useState } from 'react';
import LinerConnect from '@/components/LinerConnect';

export default function SettingsPage() {
  const [userId] = useState('demo-user-001'); // placeholder until real auth

  return (
    <main className="min-h-screen bg-[#0F0F1A] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <a href="/" className="text-[#7C6AF7] text-sm hover:underline">← Back to Orchpad</a>
          <h1 className="text-2xl font-bold text-white mt-4">Integrations</h1>
          <p className="text-[#8888AA] text-sm mt-1">Manage your connected accounts and services.</p>
        </div>

        {/* Liner Card */}
        <div className="bg-[#1C1C2E] border border-[#2E2E45] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#5B6EF5] rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              L
            </div>
            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg">Liner</h2>
              <p className="text-[#8888AA] text-sm mt-1">
                Sync highlights and saved documents from Liner into Orchpad automatically.
              </p>
              <div className="mt-5">
                <LinerConnect userId={userId} />
              </div>
            </div>
          </div>
        </div>

        {/* Info block */}
        <div className="bg-[#1C1C2E] border border-[#2E2E45] rounded-2xl p-6 space-y-3">
          <h3 className="text-white font-medium">How it works</h3>
          <ol className="space-y-2 text-[#8888AA] text-sm list-decimal list-inside">
            <li>Connect your Liner account using the button above.</li>
            <li>Orchpad fetches your saved documents and highlights from Liner.</li>
            <li>Documents stay in sync — refresh anytime or let it auto-update.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
