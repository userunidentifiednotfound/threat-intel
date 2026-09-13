import express from "express";
import path from "path";
import fs from "fs";
import { exec, spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to query SQLite database using db_api.py
function queryDbAction(action: string): Promise<any> {
  return new Promise((resolve) => {
    exec(`python3 db_api.py ${action}`, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        resolve({ error: stderr || err.message });
        return;
      }
      try {
        const parsed = JSON.parse(stdout.trim() || "{}");
        resolve(parsed);
      } catch (parseErr) {
        resolve({ error: "Failed to parse Python DB output", raw: stdout });
      }
    });
  });
}

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "DWI Platform Server", version: "2.4.0-PROD" });
});

// Run real CLI actions
app.post("/api/cli/execute", (req, res) => {
  const { command, action, targetName, assetVal, keywordVal } = req.body;
  
  let pythonCmd = "";
  if (action === "discovery") {
    pythonCmd = `
from dwi import DwiCLI
cli = DwiCLI()
cli._ensure_sample_target()
target = cli._select_target()
if target:
    res = cli.discovery.run_discovery_for_target(target['id'])
    print(f"DISCOVERY_COMPLETE: Discovered {res['discovered']} URLs, Verified {res['verified']}, Duplicates Consolidated {res['duplicates']}")
`;
  } else if (action === "collection") {
    pythonCmd = `
from dwi import DwiCLI
cli = DwiCLI()
cli._ensure_sample_target()
target = cli._select_target()
if target:
    res = cli.collection.run_collection_for_target(target['id'])
    print(f"COLLECTION_COMPLETE: Processed {res['processed']} URLs, Saved {res['evidence_captured']} Evidence Files, Extracted {res['indicators_extracted']} IOCs")
`;
  } else if (action === "report") {
    pythonCmd = `
from dwi import DwiCLI
cli = DwiCLI()
cli._ensure_sample_target()
target = cli._select_target()
if target:
    print(cli.reporting.generate_target_report(target['id']))
`;
  } else if (action === "add_target") {
    const tName = targetName || "New Enterprise Corp";
    const aVal = assetVal || "enterprise.com";
    const kVal = keywordVal || "database leak";
    pythonCmd = `
import uuid, datetime
from dwi import DwiCLI, DataValidator
cli = DwiCLI()
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
t_id = str(uuid.uuid4())
with cli.db.get_connection() as conn:
    conn.execute("INSERT OR REPLACE INTO targets (id, name, description, priority, status, created_at, updated_at) VALUES (?, ?, 'Monitored Target Organization', 'HIGH', 'ACTIVE', ?, ?)", (t_id, "${tName}", now, now))
    conn.execute("INSERT INTO assets VALUES (?, ?, 'domain', ?, 'HIGH', ?)", (str(uuid.uuid4()), t_id, "${aVal}", now))
    conn.execute("INSERT INTO keywords VALUES (?, ?, ?, 'brand', 1.5, ?)", (str(uuid.uuid4()), t_id, "${kVal}", now))
    conn.commit()
print(f"TARGET_ADDED: Successfully registered ${tName} with asset ${aVal} and keyword ${kVal}")
`;
  } else if (action === "batch") {
    // Full automated batch execution
    exec("python3 dwi.py --batch", { timeout: 30000 }, (error, stdout, stderr) => {
      res.json({
        success: !error,
        output: stdout || stderr,
        action: "batch"
      });
    });
    return;
  } else {
    pythonCmd = `print("Command not recognized")`;
  }

  exec(`python3 -c '${pythonCmd.replace(/'/g, "'\\''")}'`, { timeout: 25000 }, (error, stdout, stderr) => {
    res.json({
      success: !error,
      output: stdout || stderr || "Execution finished with no output",
      error: error ? error.message : null
    });
  });
});

// Database stats & overview
app.get("/api/db/stats", async (req, res) => {
  const data = await queryDbAction("stats");
  res.json(data);
});

// Findings list
app.get("/api/db/findings", async (req, res) => {
  const data = await queryDbAction("findings");
  res.json(Array.isArray(data) ? data : []);
});

// Extracted IOC Indicators
app.get("/api/db/indicators", async (req, res) => {
  const data = await queryDbAction("indicators");
  res.json(Array.isArray(data) ? data : []);
});

// 15 Discovery Sources
app.get("/api/db/sources", async (req, res) => {
  const data = await queryDbAction("sources");
  res.json(Array.isArray(data) ? data : []);
});

// Canonical URLs with Deduplication provenance
app.get("/api/db/canonical-urls", async (req, res) => {
  const data = await queryDbAction("canonical");
  res.json(Array.isArray(data) ? data : []);
});

// Evidence list
app.get("/api/db/evidence", async (req, res) => {
  const data = await queryDbAction("evidence");
  res.json(Array.isArray(data) ? data : []);
});

// Raw Evidence File Content
app.get("/api/db/evidence/:id/content", async (req, res) => {
  const evId = req.params.id;
  const list = await queryDbAction("evidence");
  if (Array.isArray(list)) {
    const found = list.find((e: any) => e.id === evId);
    if (found && found.raw_artifact_path && fs.existsSync(found.raw_artifact_path)) {
      const content = fs.readFileSync(found.raw_artifact_path, "utf-8");
      return res.json({
        id: evId,
        sha256: found.evidence_sha256,
        contentType: found.content_type,
        path: found.raw_artifact_path,
        content: content
      });
    }
  }
  res.status(404).json({ error: "Evidence artifact file not found on disk" });
});

// Targets list
app.get("/api/db/targets", async (req, res) => {
  const data = await queryDbAction("targets");
  res.json(Array.isArray(data) ? data : []);
});

// Complete dwi.py script source for inspection/download
app.get("/api/code/dwi", (req, res) => {
  const filePath = path.join(process.cwd(), "dwi.py");
  if (fs.existsSync(filePath)) {
    const code = fs.readFileSync(filePath, "utf-8");
    res.type("text/plain").send(code);
  } else {
    res.status(404).send("dwi.py not found");
  }
});

// -----------------------------------------------------------------------------
// VITE MIDDLEWARE / SPA SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DWI Platform] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
