import React, { useState, useEffect } from "react";
import { Terminal, Download, Copy, Check, ShieldCheck, FileText, Code2 } from "lucide-react";

export const KaliGuide: React.FC = () => {
  const [dwiScript, setDwiScript] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/code/dwi")
      .then((res) => res.text())
      .then((text) => setDwiScript(text))
      .catch(() => setDwiScript("# Failed to load dwi.py source."));
  }, []);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Kali Linux Instructions Header */}
      <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          Native Kali Linux / Linux CLI Deployment Guide
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          This platform runs completely self-contained in Python 3 with the standard library and SQLite3. Zero external frameworks, zero Docker, zero Kubernetes.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500"># 1. Ensure Tor daemon is active on Kali Linux</span>
              <div className="text-emerald-400 font-bold mt-1">
                sudo apt update && sudo apt install -y tor && sudo systemctl start tor
              </div>
            </div>
            <button
              onClick={() => copyText("sudo apt update && sudo apt install -y tor && sudo systemctl start tor", "cmd1")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copiedCmd === "cmd1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500"># 2. Start the interactive CLI menu</span>
              <div className="text-cyan-300 font-bold mt-1">
                python3 dwi.py
              </div>
            </div>
            <button
              onClick={() => copyText("python3 dwi.py", "cmd2")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copiedCmd === "cmd2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500"># 3. Headless batch execution (for cron/scheduled intelligence runs)</span>
              <div className="text-amber-300 font-bold mt-1">
                python3 dwi.py --batch
              </div>
            </div>
            <button
              onClick={() => copyText("python3 dwi.py --batch", "cmd3")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copiedCmd === "cmd3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500"># 4. Export intelligence dossier without entering interactive loop</span>
              <div className="text-emerald-400 font-bold mt-1">
                python3 dwi.py --report
              </div>
            </div>
            <button
              onClick={() => copyText("python3 dwi.py --report", "cmd4")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copiedCmd === "cmd4" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Script Source Inspector */}
      <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-100">
              dwi.py Monolithic Source Code (Standalone Script)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/code/dwi"
              download="dwi.py"
              className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download dwi.py</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(dwiScript);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono inline-flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
        </div>

        <div className="rounded bg-[#070b10] border border-slate-800/80 p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap select-text leading-relaxed">
          {dwiScript}
        </div>
      </div>
    </div>
  );
};
