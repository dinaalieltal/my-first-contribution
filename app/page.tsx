import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">📋</span>
          <span className="text-2xl font-bold text-slate-800">Orchpad</span>
          <span className="text-slate-400 text-2xl">×</span>
          <span className="text-4xl">🔗</span>
          <span className="text-2xl font-bold text-violet-700">Liner</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Orchpad–Liner Sync</h1>
        <p className="text-slate-500 text-lg">
          Connect your Liner account to pull documents into Orchpad and keep them automatically up to date.
        </p>
        <Link
          href="/settings"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition-colors"
        >
          Go to Settings →
        </Link>
      </div>
    </main>
  );
}
