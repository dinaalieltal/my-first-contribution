import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">📋</span>
          <span className="text-2xl text-[#2E2E45] font-light">⟷</span>
          <span className="text-4xl">🔗</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Orchpad × Liner</h1>
        <p className="text-[#8888AA] text-base leading-relaxed">
          Connect your Liner account to automatically sync your saved documents into Orchpad — no manual copying.
        </p>
        <Link
          href="/settings"
          className="inline-block bg-[#7C6AF7] hover:bg-[#6A59E0] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Go to Settings →
        </Link>
      </div>
    </main>
  );
}
