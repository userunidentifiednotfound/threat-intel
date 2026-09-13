import React, { useState } from "react";
import { Finding } from "../types";
import { ShieldAlert, AlertTriangle, Info, ExternalLink, Calendar, Target, CheckCircle2 } from "lucide-react";

interface FindingsViewProps {
  findings: Finding[];
}

export const FindingsView: React.FC<FindingsViewProps> = ({ findings }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = findings.filter((f) => {
    const matchesSeverity = filterSeverity === "ALL" || f.severity === filterSeverity;
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.canonical_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.target_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: string, riskScore: number) => {
    if (severity === "CRITICAL" || riskScore >= 90) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60">
          CRITICAL ({riskScore}/100)
        </span>
      );
    }
    if (severity === "HIGH" || riskScore >= 70) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">
          HIGH ({riskScore}/100)
        </span>
      );
    }
    if (severity === "MEDIUM" || riskScore >= 40) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-700/60">
          MEDIUM ({riskScore}/100)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
        LOW ({riskScore}/100)
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-semibold text-slate-100">
            Correlated Clean Findings ({filtered.length} of {findings.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search findings, onion URLs, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
          />

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-lg border border-slate-800 text-slate-400">
          <p className="text-sm">No findings match the selected filters.</p>
          <p className="text-xs text-slate-500 mt-1">Run discovery or collection to generate new intelligence.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((finding) => (
            <div
              key={finding.id}
              className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getSeverityBadge(finding.severity, finding.risk_score)}
                  <h4 className="text-sm font-semibold text-slate-100">{finding.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    {finding.finding_type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    {finding.target_name}
                  </span>
                  <span>Conf: {(finding.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {finding.description}
              </p>

              {finding.context_snippet && (
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 mb-3">
                  <div className="text-[11px] font-mono text-slate-500 mb-1">Evidence Context Snippet:</div>
                  <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto">
                    {finding.context_snippet}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1 truncate max-w-xl">
                  <span>Source Onion:</span>
                  <span className="text-cyan-400 truncate">{finding.canonical_url}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(finding.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
