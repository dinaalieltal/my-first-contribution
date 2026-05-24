'use client';

import { useEffect, useState } from 'react';

interface Connection {
  liner_name?: string;
  liner_email?: string;
  connected_at?: string;
}

export default function LinerConnect({ userId }: { userId: string }) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetchConnection();
    // Handle OAuth callback success
    const params = new URLSearchParams(window.location.search);
    if (params.get('liner_connected') === '1') {
      fetchConnection();
      window.history.replaceState({}, '', '/settings');
    }
  }, []);

  async function fetchConnection() {
    setLoading(true);
    try {
      const res = await fetch(`/api/liner/connection?userId=${userId}`);
      const data = await res.json();
      setConnection(data.connection || null);
    } catch {
      setConnection(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await fetch(`/api/liner/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setConnection(null);
    } finally {
      setDisconnecting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#8888AA] text-sm">
        <div className="w-4 h-4 border-2 border-[#7C6AF7] border-t-transparent rounded-full animate-spin" />
        Checking connection...
      </div>
    );
  }

  if (connection) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-green-400 text-sm font-medium">Connected</span>
        </div>
        {connection.liner_name && (
          <p className="text-[#8888AA] text-sm">
            Signed in as <span className="text-white">{connection.liner_name}</span>
            {connection.liner_email && (
              <span className="text-[#666688]"> · {connection.liner_email}</span>
            )}
          </p>
        )}
        {connection.connected_at && (
          <p className="text-[#555570] text-xs">
            Connected {new Date(connection.connected_at).toLocaleDateString()}
          </p>
        )}
        <div className="flex gap-3 pt-1">
          <a
            href="/sync"
            className="bg-[#7C6AF7] hover:bg-[#6A59E0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View Synced Docs
          </a>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="border border-[#2E2E45] hover:border-red-500 text-[#8888AA] hover:text-red-400 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#444460] rounded-full" />
        <span className="text-[#8888AA] text-sm">Not connected</span>
      </div>
      <a
        href={`/api/liner/oauth/start?userId=${userId}`}
        className="inline-flex items-center gap-2 bg-[#5B6EF5] hover:bg-[#4A5DE0] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
      >
        <span className="text-base">🔗</span>
        Connect Liner Account
      </a>
      <p className="text-[#555570] text-xs">You'll be redirected to Liner to authorize access.</p>
    </div>
  );
}
