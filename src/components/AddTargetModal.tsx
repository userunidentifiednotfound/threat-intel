import React, { useState } from "react";
import { X, Target, Plus, ShieldCheck, Loader2 } from "lucide-react";

interface AddTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTargetAdded: () => void;
}

export const AddTargetModal: React.FC<AddTargetModalProps> = ({ isOpen, onClose, onTargetAdded }) => {
  const [name, setName] = useState("");
  const [assetVal, setAssetVal] = useState("");
  const [keywordVal, setKeywordVal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Target company name is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/cli/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_target",
          targetName: name.trim(),
          assetVal: assetVal.trim() || `${name.toLowerCase().replace(/\s+/g, "")}.com`,
          keywordVal: keywordVal.trim() || "database dump"
        })
      });
      const data = await res.json();
      if (data.success) {
        onTargetAdded();
        onClose();
      } else {
        setErrorMsg(data.error || "Failed to register target organization.");
      }
    } catch (err: any) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#0b1016] border border-slate-800 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-100">
              CLI Option 1: Add Monitored Target Organization
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-xs text-rose-300 font-mono">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Target Organization / Company Name: <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cyberdyne Systems, Initech Corp"
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Primary Monitored Asset (Domain or IP Range):
            </label>
            <input
              type="text"
              value={assetVal}
              onChange={(e) => setAssetVal(e.target.value)}
              placeholder="e.g. cyberdyne.io or 198.51.100.0/24"
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              High-Risk Dark Web Keyword:
            </label>
            <input
              type="text"
              value={keywordVal}
              onChange={(e) => setKeywordVal(e.target.value)}
              placeholder="e.g. credential leak, source code, vpn access"
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Register Target in Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
