'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  RefreshCw,
  Shield,
  Clock,
  User,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AuditLog {
  id: number;
  admin_id: number | null;
  admin_username: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: any;
  ip_address: string;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [limit, setLimit] = useState(50);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit-logs?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [limit]);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.entity.toLowerCase().includes(term) ||
      (log.admin_username && log.admin_username.toLowerCase().includes(term)) ||
      (log.ip_address && log.ip_address.toLowerCase().includes(term))
    );
  });

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          {action}
        </span>
      );
    }
    if (action.includes('DELETE')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-300">
          {action}
        </span>
      );
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          {action}
        </span>
      );
    }
    if (action.includes('CREATE') || action.includes('INSERT')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saffron-100 text-saffron-800 border border-saffron-300">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-charcoal-100 text-charcoal-800 border border-charcoal-300">
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-maroon-900">
              ऑडिट लॉग (Audit Trail Logs)
            </h1>
            <p className="text-xs text-charcoal-600">
              सर्व प्रशासकीय कृती, बदल व सुरक्षेशी संबंधित घडामोडींची अखंड नोंद
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-gold-300 text-xs bg-white text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            <option value={25}>शेवटचे २५</option>
            <option value={50}>शेवटचे ५०</option>
            <option value={100}>शेवटचे १००</option>
          </select>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-3 py-2 rounded-xl border border-gold-300 hover:bg-gold-50 text-charcoal-700 transition flex items-center gap-1.5 text-xs font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gold-500/20 flex items-center gap-3">
        <Search className="w-4 h-4 text-charcoal-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="कृती (Action), घटक (Entity), प्रशासक नाव किंवा IP द्वारे शोधा..."
          className="w-full text-xs text-charcoal-800 placeholder-charcoal-400 bg-transparent focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-charcoal-500 hover:text-charcoal-800"
          >
            साफ करा
          </button>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gold-500/20 overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500 font-serif">
            ऑडिट लॉग लोड होत आहेत...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            <Activity className="w-10 h-10 mx-auto text-gold-400 mb-3 opacity-50" />
            <p className="font-serif text-maroon-900 font-semibold">कोणतीही नोंद सापडली नाही.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-ivory-100/80 text-maroon-950 font-serif uppercase tracking-wider text-[11px] border-b border-gold-200">
                <tr>
                  <th className="p-4">वेळ (Timestamp)</th>
                  <th className="p-4">प्रशासक (Admin)</th>
                  <th className="p-4">कृती (Action)</th>
                  <th className="p-4">घटक (Entity)</th>
                  <th className="p-4">IP पत्ता</th>
                  <th className="p-4 text-right">तपशील (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasDetails = log.details && Object.keys(log.details).length > 0;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-ivory-50 transition">
                        <td className="p-4 whitespace-nowrap text-charcoal-600 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gold-600" />
                            {new Date(log.created_at).toLocaleString('mr-IN', {
                              dateStyle: 'short',
                              timeStyle: 'medium',
                            })}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium text-maroon-950">
                            <User className="w-3.5 h-3.5 text-charcoal-500" />
                            {log.admin_username || 'System'}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-mono text-charcoal-700">
                            {log.entity} {log.entity_id ? `#${log.entity_id}` : ''}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap font-mono text-[11px] text-charcoal-500">
                          {log.ip_address || '-'}
                        </td>
                        <td className="p-4 whitespace-nowrap text-right">
                          {hasDetails ? (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : log.id)}
                              className="text-xs text-saffron-700 hover:text-saffron-900 inline-flex items-center gap-1 font-medium"
                            >
                              {isExpanded ? 'लपवा' : 'पहा'}
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="text-charcoal-400">-</span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && hasDetails && (
                        <tr className="bg-ivory-50/70 border-b border-gold-200">
                          <td colSpan={6} className="p-4">
                            <div className="p-3 bg-white rounded-xl border border-gold-200 text-charcoal-800 font-mono text-xs overflow-x-auto shadow-inner">
                              <pre className="text-[11px] whitespace-pre-wrap">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
