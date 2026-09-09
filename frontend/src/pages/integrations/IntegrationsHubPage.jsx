import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Database,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Code2,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Zap,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function IntegrationsHubPage() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [syncMessage, setSyncMessage] = useState('');

  const fetchIntegrations = async () => {
    try {
      const res = await api.get('/integrations');
      if (res.data.success) {
        setIntegrations(res.data.integrations);
      }
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSync = async (id, name) => {
    setSyncingId(id);
    setSyncMessage('');
    try {
      const res = await api.post(`/integrations/${id}/trigger-sync`);
      if (res.data.success) {
        setSyncMessage(`Successfully synced with ${name}!`);
        fetchIntegrations();
        setTimeout(() => setSyncMessage(''), 3000);
      }
    } catch (err) {
      alert('Sync failed');
    } finally {
      setSyncingId(null);
    }
  };

  const getIcon = (category) => {
    if (category.includes('Credential')) return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    if (category.includes('Learning')) return <BookOpen className="w-6 h-6 text-indigo-400" />;
    if (category.includes('Assessment')) return <Code2 className="w-6 h-6 text-purple-400" />;
    return <Database className="w-6 h-6 text-cyan-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Live External Connectors
          </span>
          <span className="text-xs text-slate-400 font-mono">Automated Webhooks & APIs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Learning Platforms, Credential Providers & ERP Integrations
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Synchronize student academic records from DigiLocker, online course badges from Coursera & NPTEL, and coding ratings from HackerRank into real-time verified skill profiles.
        </p>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Integrations Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {integrations.map((integ) => (
            <div
              key={integ._id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    {getIcon(integ.category)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {integ.category}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        {integ.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{integ.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{integ.description}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <span className="text-xs font-mono text-slate-400">
                    Records Synced: <strong className="text-white text-sm">{integ.recordsSynced?.toLocaleString()}</strong>
                  </span>
                  <button
                    onClick={() => handleSync(integ._id, integ.name)}
                    disabled={syncingId === integ._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white transition-all border border-cyan-500/30 text-xs font-semibold shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === integ._id ? 'animate-spin' : ''}`} />
                    <span>{syncingId === integ._id ? 'Syncing...' : 'Trigger Real-time Sync'}</span>
                  </button>
                </div>
              </div>

              {/* Supported Data Types */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-semibold mr-1">Synchronized Data:</span>
                  {integ.supportedDataTypes?.map((dt) => (
                    <span
                      key={dt}
                      className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700 font-mono text-[11px]"
                    >
                      {dt}
                    </span>
                  ))}
                </div>

                <span className="text-slate-500 font-mono text-[11px]">
                  Last Sync: {new Date(integ.lastSyncAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
