import React, { useState, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Layers,
  ShieldAlert,
  Database,
  HardDrive,
  Radio,
  BookOpen,
  Play,
  RotateCw,
  Plus,
  Download,
  CheckCircle2,
  Lock,
  Cpu
} from "lucide-react";
import { TerminalView } from "./components/TerminalView";
import { ArchitectureBlueprint } from "./components/ArchitectureBlueprint";
import { FindingsView } from "./components/FindingsView";
import { IndicatorsView } from "./components/IndicatorsView";
import { EvidenceVault } from "./components/EvidenceVault";
import { SourcesMatrix } from "./components/SourcesMatrix";
import { KaliGuide } from "./components/KaliGuide";
import { AddTargetModal } from "./components/AddTargetModal";
import { DatabaseStats, Finding, Indicator, DiscoverySource, EvidenceItem } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "terminal" | "blueprint" | "findings" | "indicators" | "evidence" | "sources" | "guide"
  >("terminal");
  const [stats, setStats] = useState<DatabaseStats>({
    targets: 0,
    observations: 0,
    canonical_urls: 0,
    evidence: 0,
    indicators: 0,
    findings: 0,
    sources: 15,
    queue_pending: 0
  });
  const [findings, setFindings] = useState<Finding[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [sources, setSources] = useState<DiscoverySource[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [isAddTargetOpen, setIsAddTargetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, findingsRes, indicatorsRes, sourcesRes, evidenceRes] = await Promise.all([
        fetch("/api/db/stats").then((r) => r.json()),
        fetch("/api/db/findings").then((r) => r.json()),
        fetch("/api/db/indicators").then((r) => r.json()),
        fetch("/api/db/sources").then((r) => r.json()),
        fetch("/api/db/evidence").then((r) => r.json())
      ]);

      if (statsRes && !statsRes.error) setStats(statsRes);
      if (Array.isArray(findingsRes)) setFindings(findingsRes);
      if (Array.isArray(indicatorsRes)) setIndicators(indicatorsRes);
      if (Array.isArray(sourcesRes)) setSources(sourcesRes);
      if (Array.isArray(evidenceRes)) setEvidenceList(evidenceRes);
    } catch (err) {
      console.error("Error fetching intelligence data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-[#0d131a] sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wide text-slate-100 uppercase">
                  Dark Web Intelligence Platform
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  CLI v2.4.0-PROD
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Tor Proxy: 127.0.0.1:9050
                </span>
                <span>•</span>
                <span className="text-slate-300">SQLite DB: dwi.db</span>
                <span>•</span>
                <span className="text-slate-400">Target: Kali Linux / Linux</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <button
              id="btn-refresh-data"
              onClick={fetchAllData}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
              <span>Sync DB</span>
            </button>

            <button
              id="btn-open-add-target"
              onClick={() => setIsAddTargetOpen(true)}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Target [1]</span>
            </button>

            <a
              href="/api/code/dwi"
              download="dwi.py"
              className="px-3 py-1.5 rounded bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 text-xs font-mono border border-cyan-700/60 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get dwi.py</span>
            </a>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <section className="bg-[#0a0f16] border-b border-slate-800/80 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Targets</div>
            <div className="text-base font-bold text-slate-100">{stats.targets}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Raw Observations</div>
            <div className="text-base font-bold text-amber-400">{stats.observations}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Canonical URLs</div>
            <div className="text-base font-bold text-cyan-400">{stats.canonical_urls}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Raw Evidence Files</div>
            <div className="text-base font-bold text-emerald-400">{stats.evidence}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Clean Extracted IOCs</div>
            <div className="text-base font-bold text-purple-300">{stats.indicators}</div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Correlated Findings</div>
            <div className="text-base font-bold text-rose-400">{stats.findings}</div>
          </div>
        </div>
      </section>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "terminal"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Interactive Kali CLI</span>
          </button>

          <button
            onClick={() => setActiveTab("blueprint")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "blueprint"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab("findings")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "findings"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Threat Findings ({stats.findings})</span>
          </button>

          <button
            onClick={() => setActiveTab("indicators")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "indicators"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Normalized IOCs ({stats.indicators})</span>
          </button>

          <button
            onClick={() => setActiveTab("evidence")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "evidence"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Evidence Artifacts ({stats.evidence})</span>
          </button>

          <button
            onClick={() => setActiveTab("sources")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "sources"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>15 Discovery Engines</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "guide"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kali CLI Guide</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "terminal" && (
          <div className="h-[680px]">
            <TerminalView
              onTriggerRefresh={fetchAllData}
              onOpenAddTarget={() => setIsAddTargetOpen(true)}
            />
          </div>
        )}

        {activeTab === "blueprint" && <ArchitectureBlueprint />}

        {activeTab === "findings" && <FindingsView findings={findings} />}

        {activeTab === "indicators" && <IndicatorsView indicators={indicators} />}

        {activeTab === "evidence" && <EvidenceVault evidenceList={evidenceList} />}

        {activeTab === "sources" && <SourcesMatrix sources={sources} />}

        {activeTab === "guide" && <KaliGuide />}
      </main>

      {/* Target Modal */}
      <AddTargetModal
        isOpen={isAddTargetOpen}
        onClose={() => setIsAddTargetOpen(false)}
        onTargetAdded={fetchAllData}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d131a] py-3 px-4 sm:px-6 text-center text-xs font-mono text-slate-500">
        Dark Web Intelligence (DWI) Platform • Production CLI for Kali Linux • Clean SQLite Storage • Strict Evidence Preservation
      </footer>
    </div>
  );
}
