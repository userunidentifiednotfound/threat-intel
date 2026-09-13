export interface Target {
  id: string;
  name: string;
  description: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  created_at: string;
  updated_at: string;
  assets?: TargetAsset[];
  keywords?: TargetKeyword[];
}

export interface TargetAsset {
  id: string;
  target_id: string;
  asset_type: string;
  value: string;
  criticality: string;
  created_at: string;
}

export interface TargetKeyword {
  id: string;
  target_id: string;
  keyword: string;
  category: string;
  weight: number;
  created_at: string;
}

export interface DatabaseStats {
  targets: number;
  observations: number;
  canonical_urls: number;
  evidence: number;
  indicators: number;
  findings: number;
  sources: number;
  queue_pending: number;
}

export interface Finding {
  id: string;
  title: string;
  finding_type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  risk_score: number;
  confidence: number;
  description: string;
  context_snippet: string;
  created_at: string;
  canonical_url: string;
  target_name: string;
}

export interface Indicator {
  id: string;
  indicator_type: string;
  raw_value: string;
  normalized_value: string;
  hash_type?: string;
  confidence: number;
  validation_notes?: string;
  observation_count: number;
  first_seen: string;
  last_seen: string;
  canonical_url: string;
}

export interface DiscoverySource {
  id: string;
  name: string;
  source_type: string;
  base_url: string;
  onion_url: string;
  reliability_score: number;
  success_count: number;
  avg_latency_ms: number;
  enabled: number;
  last_checked_at: string;
}

export interface CanonicalUrl {
  id: string;
  canonical_url: string;
  domain_or_onion: string;
  crawl_status: string;
  crawl_priority: number;
  relevance_score: number;
  confidence_score: number;
  observation_count: number;
  source_count: number;
  relevance_reason: string;
  first_seen: string;
  last_seen: string;
  target_name: string;
}

export interface EvidenceItem {
  id: string;
  evidence_sha256: string;
  content_type: string;
  raw_artifact_path: string;
  raw_size_bytes: number;
  crawler_version: string;
  parser_version: string;
  collection_timestamp: string;
  canonical_url: string;
  page_title?: string;
  page_classification?: string;
}

export interface EvidenceContentModalData {
  id: string;
  sha256: string;
  contentType: string;
  path: string;
  content: string;
}
