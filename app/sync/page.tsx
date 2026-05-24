import Link from 'next/link';

export default function SyncPage() {
  return (
    <main className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-4xl">🔄</div>
        <h1 className="text-2xl font-bold text-white">Documents coming soon</h1>
        <p className="text-[#8888AA] text-sm">
          Stage 2 will bring your synced Liner documents here.
        </p>
        <Link href="/settings" className="text-[#7C6AF7] text-sm hover:underline">
          ← Back to Settings
        </Link>
      </div>
    </main>
  );
}
