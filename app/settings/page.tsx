'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type LinerConnection = {
  liner_user_name: string | null;
  liner_user_email: string | null;
  updated_at: string;
};

export default function SettingsPage() {
  const [connection, setConnection] = useState<LinerConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchConnection() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('liner_connections')
        .select('liner_user_name, liner_user_email, updated_at')
        .eq('user_id', user.id)
        .single();

      setConnection(data ?? null);
      setLoading(false);
    }
    fetchConnection();
  }, []);

  async function handleConnect() {
    window.location.href = '/api/liner/oauth/start';
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('liner_connections').delete().eq('user_id', user.id);
    }
    setConnection(null);
    setDisconnecting(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <a href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to Orchpad</a>
          <h1 className="text-2xl font-bold text-slate-900 mt-3">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your integrations</p>
        </div>

        {/* Liner Connection Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl">🔗</div>
            <div>
              <h2 className="font-semibold text-slate-900">Liner</h2>
              <p className="text-sm text-slate-500">Sync your Liner documents into Orchpad</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
              Loading...
            </div>
          ) : connection ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-500 text-lg">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-800">Connected</p>
                  {connection.liner_user_name && (
                    <p className="text-xs text-green-700">{connection.liner_user_name}</p>
                  )}
                  {connection.liner_user_email && (
                    <p className="text-xs text-green-600">{connection.liner_user_email}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Last synced: {new Date(connection.updated_at).toLocaleString()}
              </p>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                {disconnecting ? 'Disconnecting…' : 'Disconnect Liner'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Connect your Liner account to automatically pull document content from URLs and keep everything synced in Orchpad.
              </p>
              <button
                onClick={handleConnect}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow transition-colors"
              >
                Connect Liner Account
              </button>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-700 space-y-1">
          <p className="font-semibold">How it works</p>
          <ol className="list-decimal list-inside space-y-1 text-violet-600">
            <li>Connect your Liner account via OAuth</li>
            <li>Orchpad reads document URLs from Liner</li>
            <li>Content is synced and kept up to date automatically</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
