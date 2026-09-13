import React, { useState } from "react";
import { Indicator } from "../types";
import { Database, Copy, Check, Filter, Search, Tag, ShieldCheck } from "lucide-react";

interface IndicatorsViewProps {
  indicators: Indicator[];
}

export const IndicatorsView: React.FC<IndicatorsViewProps> = ({ indicators }) => {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedVal, setCopiedVal] = useState<string | null>(null);

  const types = Array.from(new Set(indicators.map((i) => i.indicator_type)));

  const filtered = indicators.filter((item) => {
    const matchesType = selectedType === "ALL" || item.indicator_type === selectedType;
    const matchesSearch =
      item.normalized_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.raw_value && item.raw_value.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.validation_notes && item.validation_notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedVal(val);
    setTimeout(() => setCopiedVal(null), 1500);
  };

  const getBadgeColor = (type: string) => {
    if (type.startsWith("CRYPTO")) return "bg-amber-950/80 text-amber-300 border-amber-700/60";
    if (type === "CVE") return "bg-rose-950/80 text-rose-300 border-rose-700/60";
    if (type.startsWith("HASH")) return "bg-purple-950/80 text-purple-300 border-purple-700/60";
    if (type === "EMAIL") return "bg-cyan-950/80 text-cyan-300 border-cyan-700/60";
    if (type === "IP") return "bg-blue-950/80 text-blue-300 border-blue-700/60";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-slate-100">
            Normalized IOC Intelligence Vault ({filtered.length} of {indicators.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search IOCs, CVEs, wallets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 pl-8 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Types ({indicators.length})</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t} ({indicators.filter((i) => i.indicator_type === t).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* IOC Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0b1016] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Indicator Type</th>
                <th className="px-4 py-3">Normalized Value</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Observations</th>
                <th className="px-4 py-3">Validation Rule</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getBadgeColor(ioc.indicator_type)}`}>
                      {ioc.indicator_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-semibold break-all max-w-xs sm:max-w-md">
                    {ioc.normalized_value}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${ioc.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-[11px]">{(ioc.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                      {ioc.observation_count}x
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px] max-w-xs truncate">
                    {ioc.validation_notes || "Verified checksum & regex"}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleCopy(ioc.normalized_value)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1 text-[11px]"
                      title="Copy IOC to clipboard"
                    >
                      {copiedVal === ioc.normalized_value ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
