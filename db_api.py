#!/usr/bin/env python3
"""Database query helper for DWI web API."""
import sys
import json
import sqlite3
import os

DB_PATH = "dwi.db"

def get_db():
    if not os.path.exists(DB_PATH):
        from dwi import DatabaseManager
        DatabaseManager(db_path=DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def handle_stats():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM targets")
    targets_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM discovery_observations")
    obs_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM canonical_urls")
    canon_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM evidence")
    evidence_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM extracted_indicators")
    ioc_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM findings")
    findings_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM discovery_sources WHERE enabled = 1")
    sources_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM crawl_queue WHERE state = 'PENDING'")
    queue_pending = cur.fetchone()[0]

    print(json.dumps({
        "targets": targets_count,
        "observations": obs_count,
        "canonical_urls": canon_count,
        "evidence": evidence_count,
        "indicators": ioc_count,
        "findings": findings_count,
        "sources": sources_count,
        "queue_pending": queue_pending
    }))

def handle_findings():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    SELECT f.id, f.title, f.finding_type, f.severity, f.risk_score, f.confidence,
           f.description, f.context_snippet, f.created_at, c.canonical_url, t.name as target_name
    FROM findings f
    JOIN canonical_urls c ON f.canonical_url_id = c.id
    JOIN targets t ON f.target_id = t.id
    ORDER BY f.risk_score DESC LIMIT 50
    """)
    rows = [dict(r) for r in cur.fetchall()]
    print(json.dumps(rows))

def handle_indicators():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    SELECT i.id, i.indicator_type, i.raw_value, i.normalized_value, i.hash_type,
           i.confidence, i.validation_notes, i.observation_count, i.first_seen, i.last_seen,
           c.canonical_url
    FROM extracted_indicators i
    JOIN pages p ON i.page_id = p.id
    JOIN canonical_urls c ON p.canonical_url_id = c.id
    ORDER BY i.observation_count DESC, i.first_seen DESC LIMIT 100
    """)
    rows = [dict(r) for r in cur.fetchall()]
    print(json.dumps(rows))

def handle_sources():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    SELECT id, name, source_type, base_url, onion_url, reliability_score,
           success_count, avg_latency_ms, enabled, last_checked_at
    FROM discovery_sources
    ORDER BY reliability_score DESC
    """)
    rows = [dict(r) for r in cur.fetchall()]
    print(json.dumps(rows))

def handle_canonical():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    SELECT c.id, c.canonical_url, c.domain_or_onion, c.crawl_status, c.crawl_priority,
           c.relevance_score, c.confidence_score, c.observation_count, c.source_count,
           c.relevance_reason, c.first_seen, c.last_seen, t.name as target_name
    FROM canonical_urls c
    JOIN targets t ON c.target_id = t.id
    ORDER BY c.observation_count DESC, c.relevance_score DESC LIMIT 50
    """)
    rows = [dict(r) for r in cur.fetchall()]
    print(json.dumps(rows))

def handle_evidence():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    SELECT e.id, e.evidence_sha256, e.content_type, e.raw_artifact_path, e.raw_size_bytes,
           e.crawler_version, e.parser_version, e.collection_timestamp,
           c.canonical_url, p.title as page_title, p.page_classification
    FROM evidence e
    JOIN canonical_urls c ON e.canonical_url_id = c.id
    LEFT JOIN pages p ON p.evidence_id = e.id
    ORDER BY e.collection_timestamp DESC LIMIT 50
    """)
    rows = [dict(r) for r in cur.fetchall()]
    print(json.dumps(rows))

def handle_targets():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM targets ORDER BY created_at DESC")
    targets = [dict(t) for t in cur.fetchall()]
    for t in targets:
        cur.execute("SELECT * FROM assets WHERE target_id = ?", (t["id"],))
        t["assets"] = [dict(a) for a in cur.fetchall()]
        cur.execute("SELECT * FROM keywords WHERE target_id = ?", (t["id"],))
        t["keywords"] = [dict(k) for k in cur.fetchall()]
    print(json.dumps(targets))

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing action"}))
        sys.exit(1)
    action = sys.argv[1]
    if action == "stats":
        handle_stats()
    elif action == "findings":
        handle_findings()
    elif action == "indicators":
        handle_indicators()
    elif action == "sources":
        handle_sources()
    elif action == "canonical":
        handle_canonical()
    elif action == "evidence":
        handle_evidence()
    elif action == "targets":
        handle_targets()
    else:
        print(json.dumps({"error": f"Unknown action: {action}"}))

if __name__ == "__main__":
    main()
