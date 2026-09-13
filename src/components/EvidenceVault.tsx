import React, { useState } from "react";
import { EvidenceItem, EvidenceContentModalData } from "../types";
import { FileCode2, ShieldCheck, Eye, Copy, Check, X, Download, HardDrive } from "lucide-react";

interface EvidenceVaultProps {
  evidenceList: EvidenceItem[];
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({ evidenceList }) => {
  const [activeModalData, setActiveModalData] = useState<EvidenceContentModalData | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const openEvidenceModal = async (ev: EvidenceItem) => {
    setLoadingContent(true);
    try {
      const res = await fetch(`/api/db/evidence/${ev.id}/content`);
      const data = await res.json();
      if (data && data.content) {
        setActiveModalData(data);
      } else {
        alert("Unable to read evidence file from disk: " + (data.error || "Unknown"));
      }
    } catch (e: any) {
      alert("Error loading evidence: " + e.message);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Principle header */}
      <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-sm font-semibold text-slate-100">
              Immutable Forensic Raw Evidence Vault ({evidenceList.length} Preserved Artifacts)
            </span>
            <p className="text-xs text-slate-400">
              Preserved bit-for-bit on disk in <code className="text-emerald-400">evidence/</code> before any normalization or parsing.
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0b1016] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Evidence ID & SHA-256 Checksum</th>
                <th className="px-4 py-3">Target Onion Source</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Size (Bytes)</th>
                <th className="px-4 py-3">Captured Timestamp</th>
                <th className="px-4 py-3 text-right">Inspect Raw</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {evidenceList.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-semibold truncate max-w-[220px]">
                          {ev.evidence_sha256}
                        </span>
                        <span className="text-[10px] text-slate-500">{ev.raw_artifact_path}</span>
                      </div>
                      <button
                        onClick={() => handleCopyHash(ev.evidence_sha256)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400"
                        title="Copy SHA-256"
                      >
                        {copiedHash === ev.evidence_sha256 ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cyan-400 max-w-xs truncate">
                    {ev.canonical_url}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {ev.page_classification || "marketplace"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {ev.raw_size_bytes.toLocaleString()} B
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-[11px]">
                    {ev.collection_timestamp}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEvidenceModal(ev)}
                      disabled={loadingContent}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Raw</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Content Modal */}
      {activeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0b1016] border border-slate-800 rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-100">
                  Forensic Raw Artifact Inspector
                </span>
              </div>
              <button
                onClick={() => setActiveModalData(null)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border-b border-slate-800/80 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">File Path:</span>
                <span className="text-slate-200">{activeModalData.path}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SHA-256 Hash:</span>
                <span className="text-emerald-400 font-bold select-all break-all">{activeModalData.sha256}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Content Type:</span>
                <span className="text-slate-200">{activeModalData.contentType}</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-[#070b10] whitespace-pre-wrap leading-relaxed select-text">
              {activeModalData.content}
            </div>

            <div className="flex items-center justify-end px-4 py-3 border-t border-slate-800 bg-slate-900/60">
              <button
                onClick={() => setActiveModalData(null)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
