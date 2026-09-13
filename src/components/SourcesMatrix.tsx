import React from "react";
import { DiscoverySource } from "../types";
import { Radio, CheckCircle, Clock, Zap, ExternalLink, Shield } from "lucide-react";

interface SourcesMatrixProps {
  sources: DiscoverySource[];
}

export const SourcesMatrix: React.FC<SourcesMatrixProps> = ({ sources }) => {
  return (
    <div className="space-y-4">
      <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-sm font-semibold text-slate-100">
              15-Engine Dark Web Discovery Reliability Matrix
            </span>
            <p className="text-xs text-slate-400">
              Parallel multi-source discovery engine monitoring hidden service directories, Tor search engines, and onion gateways.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sources.map((src) => {
          const relPct = (src.reliability_score * 100).toFixed(0);
          return (
            <div
              key={src.id}
              className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {src.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                    {src.source_type}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate mb-3">
                  {src.base_url || src.onion_url}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80 space-y-2 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Engine Reliability</span>
                    <span className="text-emerald-400 font-bold">{relPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${relPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Avg Latency:</span>
                  </span>
                  <span className="text-slate-200">{src.avg_latency_ms || 285} ms</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Successful Hits:</span>
                  </span>
                  <span className="text-cyan-300 font-semibold">{src.success_count || 1} hits</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
