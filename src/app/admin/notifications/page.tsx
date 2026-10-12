'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Eye, X, CheckCircle2, Clock } from 'lucide-react';
import { EmailNotification } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminNotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<EmailNotification | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const jwt = token || localStorage.getItem('alfaha_jwt_token');
        const res = await fetch('/api/admin/notifications', {
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
        });
        const data = await res.json();
        if (data.success && data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="font-serif text-2xl font-bold uppercase tracking-widest text-ivory-100"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Sent Email Notifications Register
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Review automated luxury HTML confirmation and dispatch alert emails sent to patrons.
        </p>
      </div>

      <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gold-500/20 text-gold-400 font-serif uppercase tracking-wider bg-obsidian-950/60">
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-ivory-300">
              {notifications.map((item) => (
                <tr key={item.id} className="hover:bg-obsidian-850/50">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-ivory-100">{item.recipientName}</p>
                    <p className="text-[10px] text-ivory-500">{item.recipientEmail}</p>
                  </td>

                  <td className="py-3 px-4 text-ivory-200 font-medium">{item.subject}</td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-gold-300">
                    {item.orderNumber || '—'}
                  </td>

                  <td className="py-3 px-4 text-ivory-400">
                    {new Date(item.sentAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-3 py-1 bg-obsidian-950 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect HTML</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML Email Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-obsidian-900 border border-gold-500/40 rounded-lg max-w-3xl w-full h-[85vh] flex flex-col p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div>
                <p className="text-[11px] text-gold-500 uppercase tracking-widest font-bold">
                  Sent Notification Preview
                </p>
                <h3 className="font-serif text-base font-bold text-ivory-100">
                  {previewItem.subject}
                </h3>
                <p className="text-xs text-ivory-400">
                  To: {previewItem.recipientName} ({previewItem.recipientEmail})
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-ivory-400 hover:text-gold-400 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Rendered HTML inside iframe / safe div */}
            <div className="flex-1 overflow-auto my-4 bg-obsidian-950 rounded border border-gold-500/20 p-2">
              <iframe
                title="Email Preview"
                srcDoc={previewItem.htmlPreview}
                className="w-full h-full border-0 rounded bg-obsidian-950"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
