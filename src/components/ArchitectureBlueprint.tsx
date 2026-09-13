import React from "react";
import { ArrowRight, CheckCircle2, Database, ShieldAlert, Cpu, Eye, FileCode2, Layers, Search, Filter } from "lucide-react";

export const ArchitectureBlueprint: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Target & Asset Enhancement",
      input: "Target Company, Monitored Domains, IP CIDRs, Executive Identities",
      output: "Expanded Targeted Dork Queries (11+ permutations)",
      description: "Combines strict company domains with high-risk dark web keywords (stealer logs, database dump, vpn access, breach) to generate specialized search matrices.",
      icon: Search,
      tag: "Target Modeling"
    },
    {
      num: "02",
      title: "15-Engine Multi-Source Discovery",
      input: "Targeted Search Queries across Tor & Clearweb Onion Proxies",
      output: "Raw Discovery Observations (33+ observed records with engine latency & reliability)",
      description: "Parallel discovery across 15 dark web engines (Ahmia, Haystak, Torch, DanWin, Dark Search, OnionLand, etc.). Every observed result is stored as an unverified observation.",
      icon: Layers,
      tag: "Discovery Engine"
    },
    {
      num: "03",
      title: "Dedicated URL Verification & Evaluation",
      input: "Raw Discovered URLs & Snippets",
      output: "Evaluated & Scored Candidate URLs",
      description: "Validates Tor v2/v3 onion regex (56-char base32), resolves network host structure, strips tracking params, enforces host blacklists, and scores target relevance.",
      icon: Filter,
      tag: "Verification Gate"
    },
    {
      num: "04",
      title: "Canonical Normalization & Deduplication",
      input: "Evaluated Candidates",
      output: "Canonical URLs (1:N Deduplicated Mapping)",
      description: "Normalizes URLs into standard RFC representations. Multiple discovery hits for the same onion asset are linked to 1 single canonical record, tracking observation counts without database pollution.",
      icon: CheckCircle2,
      tag: "Data Quality"
    },
    {
      num: "05",
      title: "Crawl Queue & Evidence Acquisition",
      input: "Prioritized Canonical Queue (P1-P5)",
      output: "Bit-for-Bit Raw Forensics (.raw on disk + SHA-256 Checksum)",
      description: "Fetches live dark web onion pages through Tor SOCKS5 proxy (127.0.0.1:9050). Saves untouched raw bytes to disk immediately before any parsing or processing occurs.",
      icon: FileCode2,
      tag: "Forensic Evidence"
    },
    {
      num: "06",
      title: "IOC & Entity Extraction Engine",
      input: "Preserved Raw HTML / Text Evidence",
      output: "Normalized Indicators (Crypto, CVEs, Hashes, Emails, IPs)",
      description: "Regex-based and semantic extraction of IOCs with strict validation (Base58/Bech32 BTC, Monero 95-char, RFC emails, public IPv4 checks). Tracks first-seen, last-seen, and provenance.",
      icon: Cpu,
      tag: "Processing Engine"
    },
    {
      num: "07",
      title: "Correlation & Risk Scoring Engine",
      input: "Normalized IOCs + Page Classification + Asset Weights",
      output: "Actionable Findings (Risk Score 0-100, Severity, Dossier)",
      description: "Calculates composite risk score based on asset criticality, threat marker density (ransomware, stealer, credential dump), and confidence. Generates executive and technical dossiers.",
      icon: ShieldAlert,
      tag: "Clean Intelligence"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-md bg-cyan-950/60 border border-cyan-800 text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Core Architectural Principle: Strict Data Quality
            </h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              <span className="font-semibold text-slate-200">"Discover everything relevant, verify before processing, preserve the evidence, normalize the data, remove duplicates, correlate observations, and only then create clean intelligence."</span>
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Never allow raw discovery results to directly pollute the primary database. Every URL, page, IOC, and observation passes through rigorous validation gates.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Visual Flow */}
      <div className="p-5 rounded-lg bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          End-to-End Data Pipeline Architecture
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.slice(0, 4).map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="p-4 rounded-md bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      STEP {step.num}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{step.tag}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mb-1.5 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {step.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1 font-mono">
                  <div className="text-slate-500">IN: <span className="text-slate-300">{step.input}</span></div>
                  <div className="text-slate-500">OUT: <span className="text-emerald-400">{step.output}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {steps.slice(4).map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="p-4 rounded-md bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      STEP {step.num}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{step.tag}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mb-1.5 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {step.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1 font-mono">
                  <div className="text-slate-500">IN: <span className="text-slate-300">{step.input}</span></div>
                  <div className="text-slate-500">OUT: <span className="text-emerald-400">{step.output}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relational Schema Overview */}
      <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">
          Relational Database Separation (15 Clean Tables)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          The SQLite database maintains strict separation between raw observations, canonical mappings, crawl states, immutable forensic evidence, extracted indicators, and correlated intelligence.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">targets</span>
            <div className="text-slate-500 text-[10px] mt-1">Monitored organizations</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">assets</span>
            <div className="text-slate-500 text-[10px] mt-1">Domains, IPs, brands</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">keywords</span>
            <div className="text-slate-500 text-[10px] mt-1">Dork keywords & weights</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">discovery_sources</span>
            <div className="text-slate-500 text-[10px] mt-1">15 Search engines & stats</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-semibold">discovery_observations</span>
            <div className="text-slate-500 text-[10px] mt-1">Raw search hits (unverified)</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-semibold">canonical_urls</span>
            <div className="text-slate-500 text-[10px] mt-1">1:N deduplicated URLs</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">crawl_queue</span>
            <div className="text-slate-500 text-[10px] mt-1">Priority queue (P1-P5)</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-rose-400 font-semibold">evidence</span>
            <div className="text-slate-500 text-[10px] mt-1">Immutable SHA256 artifacts</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">pages</span>
            <div className="text-slate-500 text-[10px] mt-1">Parsed page classifications</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-semibold">extracted_indicators</span>
            <div className="text-slate-500 text-[10px] mt-1">Normalized clean IOCs</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">entities</span>
            <div className="text-slate-500 text-[10px] mt-1">Actors, groups, wallets</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">relationships</span>
            <div className="text-slate-500 text-[10px] mt-1">Graph links (source-target)</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-rose-400 font-semibold">findings</span>
            <div className="text-slate-500 text-[10px] mt-1">Correlated intelligence findings</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-semibold">alerts</span>
            <div className="text-slate-500 text-[10px] mt-1">Critical alerts</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-semibold">investigations</span>
            <div className="text-slate-500 text-[10px] mt-1">Analyst dossiers & notes</div>
          </div>
        </div>
      </div>
    </div>
  );
};
