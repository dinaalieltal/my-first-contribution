'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function ConnectedContent() {
  const params = useSearchParams();
  const connected = params.get('connected');
  const error = params.get('error');

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
        {connected ? (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="text-xl font-bold text-slate-900">Liner Connected!</h1>
            <p className="text-slate-500 text-sm">Your Liner account is now linked to Orchpad. Documents will sync automatically.</p>
          </>
        ) : (
          <>
            <div className="text-5xl">❌</div>
            <h1 className="text-xl font-bold text-slate-900">Connection Failed</h1>
            <p className="text-slate-500 text-sm">{error ?? 'Something went wrong. Please try again.'}</p>
          </>
        )}
        <Link
          href="/settings"
          className="inline-block mt-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Back to Settings
        </Link>
      </div>
    </main>
  );
}

export default function ConnectedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>}>
      <ConnectedContent />
    </Suspense>
  );
}
