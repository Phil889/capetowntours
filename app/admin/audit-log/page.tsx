"use client";
import { useEffect, useState } from "react";

type AuditLogEntry = {
  id: string;
  timestamp: string;
  user_id: string | null;
  action: string;
  target: string | null;
  status: string | null;
  details: any;
};

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/audit-log");
        if (!res.ok) {
          throw new Error("Failed to fetch audit log");
        }
        const data = await res.json();
        setEntries(data.entries || []);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchAuditLog();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">System Audit Log</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Timestamp</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Action</th>
              <th className="border px-2 py-1">Target</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="border px-2 py-1">{entry.timestamp}</td>
                <td className="border px-2 py-1">{entry.user_id}</td>
                <td className="border px-2 py-1">{entry.action}</td>
                <td className="border px-2 py-1">{entry.target}</td>
                <td className="border px-2 py-1">{entry.status}</td>
                <td className="border px-2 py-1">
                  <pre className="text-xs whitespace-pre-wrap">
                    {entry.details ? JSON.stringify(entry.details, null, 2) : ""}
                  </pre>
                </td>
              </tr>
            ))}
            {entries.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No audit log entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
