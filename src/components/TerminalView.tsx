import React, { useState, useRef, useEffect } from "react";
import { Terminal, Play, RotateCcw, Copy, Check, ShieldAlert, Database, Search, ArrowRight, Loader2 } from "lucide-react";

interface TerminalViewProps {
  onTriggerRefresh: () => void;
  onOpenAddTarget: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ onTriggerRefresh, onOpenAddTarget }) => {
  const [logs, setLogs] = useState<string[]>([
    "╔══════════════════════════════════════════════════════════════════════════════╗",
    "║               DARK WEB INTELLIGENCE (DWI) PLATFORM                           ║",
    "║                Production CLI for Kali Linux / Linux                         ║",
    "║                        Version 2.4.0-PROD                                    ║",
    "╚══════════════════════════════════════════════════════════════════════════════╝",
    'Principle: "Discover everything relevant, verify before processing, preserve the',
    'evidence, normalize the data, remove duplicates, correlate observations, and',
    'only then create clean intelligence."',
    "",
    "Ready for operator commands. Enter option (1-9) or execute automated batch.",
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const executeAction = async (action: string, customParams?: any) => {
    setIsRunning(true);
    setLogs((prev) => [
      ...prev,
      `root@kali:~/dwi# python3 dwi.py --action ${action}`,
      `[*] Initializing process pipeline for action: [${action}]...`
    ]);

    try {
      const res = await fetch("/api/cli/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...customParams })
      });
      const data = await res.json();
      
      if (data.output) {
        const lines = data.output.split("\n");
        setLogs((prev) => [...prev, ...lines, "[+] Operation completed successfully."]);
      } else if (data.error) {
        setLogs((prev) => [...prev, `[-] Error executing: ${data.error}`]);
      }
      onTriggerRefresh();
    } catch (err: any) {
      setLogs((prev) => [...prev, `[-] Network/Execution error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd || isRunning) return;
    setInputVal("");

    if (cmd === "1") {
      onOpenAddTarget();
      setLogs((prev) => [...prev, `root@kali:~/dwi# 1`, "[*] Opening Target Provisioning Dialog..."]);
    } else if (cmd === "2") {
      executeAction("discovery");
    } else if (cmd === "3") {
      executeAction("collection");
    } else if (cmd === "4") {
      executeAction("report");
    } else if (cmd === "5" || cmd.startsWith("search")) {
      executeAction("report");
    } else if (cmd === "6" || cmd === "investigate") {
      executeAction("report");
    } else if (cmd === "7" || cmd === "report") {
      executeAction("report");
    } else if (cmd === "8") {
      executeAction("discovery");
    } else if (cmd === "batch" || cmd === "run") {
      executeAction("batch");
    } else if (cmd === "clear") {
      setLogs(["[*] Console buffer cleared."]);
    } else {
      setLogs((prev) => [
        ...prev,
        `root@kali:~/dwi# ${cmd}`,
        `Unknown command: '${cmd}'. Available options: 1-8, 'batch', 'report', 'clear'`
      ]);
    }
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="kali-terminal-container" className="flex flex-col h-full bg-[#0a0e14] text-slate-200 rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#121820] border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-600/40"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block border border-yellow-600/40"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-600/40"></span>
          </div>
          <div className="flex items-center gap-2 ml-3 text-xs font-mono text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-semibold">root@kali: ~/dwi</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">python3 dwi.py (Active Shell)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-terminal"
            onClick={copyLogs}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy Terminal Logs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy Output"}</span>
          </button>
          <button
            id="btn-clear-terminal"
            onClick={() => setLogs(["[*] Terminal buffer reset."])}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Action Pills for CLI Options */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 bg-[#0d131a] border-b border-slate-800/80 text-xs font-mono">
        <span className="text-slate-400 font-semibold mr-1">CLI Direct Menu:</span>
        <button
          id="btn-cli-opt1"
          onClick={onOpenAddTarget}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1"
        >
          <span className="text-emerald-400 font-bold">[1]</span> Add Target
        </button>
        <button
          id="btn-cli-opt2"
          disabled={isRunning}
          onClick={() => executeAction("discovery")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 disabled:opacity-50"
        >
          <span className="text-emerald-400 font-bold">[2]</span> Multi-Source Discovery
        </button>
        <button
          id="btn-cli-opt3"
          disabled={isRunning}
          onClick={() => executeAction("collection")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 disabled:opacity-50"
        >
          <span className="text-emerald-400 font-bold">[3]</span> Collect & Extract IOCs
        </button>
        <button
          id="btn-cli-opt4"
          disabled={isRunning}
          onClick={() => executeAction("report")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 disabled:opacity-50"
        >
          <span className="text-emerald-400 font-bold">[4]</span> View Findings
        </button>
        <button
          id="btn-cli-opt7"
          disabled={isRunning}
          onClick={() => executeAction("report")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 disabled:opacity-50"
        >
          <span className="text-emerald-400 font-bold">[7]</span> Full Dossier
        </button>
        <button
          id="btn-cli-batch"
          disabled={isRunning}
          onClick={() => executeAction("batch")}
          className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 font-semibold flex items-center gap-1 disabled:opacity-50 ml-auto"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Automated Batch (1-4)</span>
        </button>
      </div>

      {/* Terminal Screen Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-1 select-text bg-[#070b10]">
        {logs.map((log, index) => {
          let lineStyle = "text-slate-300";
          if (log.includes("[*]")) lineStyle = "text-cyan-400";
          if (log.includes("[+]")) lineStyle = "text-emerald-400 font-semibold";
          if (log.includes("[-]")) lineStyle = "text-rose-400 font-semibold";
          if (log.includes("==>")) lineStyle = "text-amber-400 font-bold";
          if (log.includes("CRITICAL")) lineStyle = "text-rose-400 font-bold";
          if (log.includes("root@kali")) lineStyle = "text-emerald-300 font-semibold";

          return (
            <div key={index} className={`whitespace-pre-wrap ${lineStyle}`}>
              {log}
            </div>
          );
        })}
        {isRunning && (
          <div className="flex items-center gap-2 text-cyan-400 py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Kali CLI process executing in background...</span>
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      {/* Terminal Interactive Input */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f141c] border-t border-slate-800">
        <span className="text-emerald-400 font-mono text-xs font-semibold whitespace-nowrap">
          root@kali:~/dwi#
        </span>
        <input
          id="input-kali-command"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type option number (1-9), 'batch', 'report', or 'clear'..."
          disabled={isRunning}
          className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder-slate-600 disabled:opacity-50"
        />
        <button
          id="btn-submit-command"
          type="submit"
          disabled={isRunning || !inputVal.trim()}
          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono disabled:opacity-40 transition-colors"
        >
          Execute
        </button>
      </form>
    </div>
  );
};
