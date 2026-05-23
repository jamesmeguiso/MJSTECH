import React, { useState, useEffect } from 'react';
import { Terminal, Database, Play, AlertCircle, FileCode, CheckCircle2, RefreshCw, Lock, Unlock, KeyRound } from 'lucide-react';
import { SqlQueryResult } from '../types';

export default function SqlConsoleTab() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('mjstech_admin_auth') === 'true');
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState<string | null>(null);

  const [query, setQuery] = useState('SELECT * FROM products ORDER BY price DESC;');
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<{ name: string; count: number; columns: string[] }[]>([]);
  const [reloadingMetadata, setReloadingMetadata] = useState(false);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === '6045' || cleanPass === 'mjstech' || cleanPass === 'admin' || cleanPass === 'meguiso') {
      sessionStorage.setItem('mjstech_admin_auth', 'true');
      setIsAdmin(true);
      setPassError(null);
    } else {
      setPassError('Invalid Authorization Code. Access denied.');
    }
  };

  const handleLockConsole = () => {
    sessionStorage.removeItem('mjstech_admin_auth');
    setIsAdmin(false);
    setPasscode('');
    setResult(null);
  };

  // Suggested SQL Templates
  const templates = [
    { name: 'Show High-End Gear', sql: 'SELECT name, category, price FROM products WHERE price > 40000;' },
    { name: 'Count Products by Category', sql: 'SELECT category, COUNT(*) as count, AVG(price) as avg_price FROM products GROUP BY category;' },
    { name: 'Active Urgent Repairs', sql: "SELECT tracking_number, client_name, device, status FROM repairs WHERE status IN ('Pending', 'Diagnosis', 'In Progress');" },
    { name: 'Check MJ\'s Repair Log', sql: "SELECT * FROM repairs WHERE client_name LIKE '%Meguiso%';" },
    { name: 'Add Promo Hardware', sql: "INSERT INTO products (name, category, price, specs, stock) VALUES ('MJS Pro Headset V1', 'Accessory', 2495, '7.1 Surround Sound, Noise Cancelling, Talisay Edition', 15);" }
  ];

  const fetchDatabaseMetadata = async () => {
    setReloadingMetadata(true);
    try {
      // Fetch products counts
      const prodRes = await fetch('/api/raw-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT COUNT(*) as cnt FROM products' })
      });
      const prodData = await prodRes.json();
      
      const partRes = await fetch('/api/raw-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT COUNT(*) as cnt FROM pc_parts' })
      });
      const partData = await partRes.json();

      const repRes = await fetch('/api/raw-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT COUNT(*) as cnt FROM repairs' })
      });
      const repData = await repRes.json();

      setTables([
        {
          name: 'products',
          count: prodData.success ? prodData.rows[0].cnt : 0,
          columns: ['id (INT)', 'name (STRING)', 'category (STRING)', 'price (INT)', 'specs (STRING)', 'stock (INT)', 'image (STRING)']
        },
        {
          name: 'pc_parts',
          count: partData.success ? partData.rows[0].cnt : 0,
          columns: ['id (INT)', 'part_name (STRING)', 'type (STRING)', 'price (INT)', 'brand (STRING)', 'specs (STRING)', 'watts (INT)']
        },
        {
          name: 'repairs',
          count: repData.success ? repData.rows[0].cnt : 0,
          columns: ['id (INT)', 'tracking_number (STRING)', 'client_name (STRING)', 'contact (STRING)', 'device (STRING)', 'status (STRING)', 'issue (STRING)', 'cost (INT)', 'created_at (STRING)']
        }
      ]);
    } catch (err) {
      console.error('Failed to reload schema summaries', err);
    } finally {
      setReloadingMetadata(false);
    }
  };

  useEffect(() => {
    fetchDatabaseMetadata();
    // Execute default query on load
    handleRunQuery('SELECT * FROM products ORDER BY price DESC;');
  }, []);

  const handleRunQuery = async (queryToRun = query) => {
    if (!queryToRun.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/raw-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun })
      });
      const data = await res.json();

      if (data.success) {
        setResult({
          columns: data.columns || [],
          rows: data.rows || [],
          affectedRows: data.affectedRows
        });
        // If there's an insert or update query, refresh metadata
        if (!queryToRun.toUpperCase().trim().startsWith('SELECT')) {
          fetchDatabaseMetadata();
        }
      } else {
        setError(data.error || 'Syntax execution error.');
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const phpSnippet = `<?php
/**
 * MJSTECH Computer Shop - Portal Integration
 * Location: Talisay City, Cebu, Philippines
 */
$servername = "localhost";
$username   = "mjstech_sys";
$password   = "TalisayCebu6045_db";
$dbname     = "mjstech_store";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Structured SQL query
$sql = "SELECT tracking_number, client_name, device, status FROM repairs ORDER BY id DESC LIMIT 5";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h3>Latest MJSTECH Repairs Ticket Log</h3>";
    echo "<table border='1' cellpadding='8'>";
    echo "<tr><th>Tracking ID</th><th>Customer</th><th>Hardware</th><th>Status</th></tr>";
    while($row = $result->fetch_assoc()) {
        $status_color = $row["status"] == "Ready for Pickup" ? "green" : "orange";
        echo "<tr>";
        echo "<td><strong>" . htmlspecialchars($row["tracking_number"]) . "</strong></td>";
        echo "<td>" . htmlspecialchars($row["client_name"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["device"]) . "</td>";
        echo "<td><span style='color: \${status_color}'>" . htmlspecialchars($row["status"]) . "</span></td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No repair listings found.";
}
$conn->close();
?>`;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="admin-auth-panel">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-b from-[#E24B4A]/5 to-transparent rounded-full filter blur-[50px] pointer-events-none z-0" />
        
        <div className="relative z-10 text-center space-y-5">
          <div className="w-14 h-14 bg-[#E24B4A]/10 border border-[#E24B4A]/20 rounded-2xl flex items-center justify-center mx-auto text-[#E24B4A]" id="admin-lock-icon">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">Admin Authorization</h2>
            <p className="text-xs text-white/50 leading-relaxed font-sans max-w-sm mx-auto">
              This terminal accesses the live SQL database cluster. Please supply the administrator security passcode to unlock.
            </p>
          </div>

          {passError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 font-mono" id="admin-auth-error">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-3 pt-2" id="admin-auth-form">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                className="w-full bg-black/40 text-xs pl-10 pr-4 py-3 rounded-xl border border-white/10 text-white placeholder-white/20 font-mono text-center focus:border-[#E24B4A] focus:outline-none focus:ring-1 focus:ring-[#E24B4A]"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                id="admin-passcode-input"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E24B4A] hover:bg-[#A32D2D] active:scale-95 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-widest transition-all cursor-pointer"
              id="unlock-admin-btn"
            >
              Verify &amp; Access Terminal
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 font-mono space-y-1 leading-snug">
            <div>Authorizing Node: {window.location.hostname}</div>
            <div>Hint: Check the registration documents (or try &apos;admin&apos; / &apos;mjstech&apos; / Talisay postal code &apos;6045&apos;)</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sql-console-container">
      {/* Left Pane - Table Metadata and PHP Scripts Code block */}
      <div className="lg:col-span-4 space-y-6">
        {/* Database Directory */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5" id="db-schema-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#E24B4A]" />
              <h3 className="font-semibold text-white text-sm tracking-wide uppercase">SQL Schema Directory</h3>
            </div>
            <button 
              onClick={fetchDatabaseMetadata} 
              disabled={reloadingMetadata} 
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-[#9a9590] disabled:opacity-40 transition-all"
              title="Refresh Schema Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reloadingMetadata ? 'animate-spin text-[#E24B4A]' : ''}`} />
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {tables.length === 0 ? (
              <div className="text-white/40 italic py-2">Loading active SQL schema trees...</div>
            ) : (
              tables.map((table) => (
                <div key={table.name} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[#F09595] font-semibold mb-1">
                    <span>📁 {table.name}</span>
                    <span className="text-[10px] bg-[#E24B4A]/10 text-[#E24B4A] px-2 py-0.5 rounded-full font-sans">
                      {table.count} rows
                    </span>
                  </div>
                  <div className="pl-4 grid grid-cols-1 gap-0.5 text-white/50 text-[11px]">
                    {table.columns.map((col) => (
                      <div key={col}>🔹 {col}</div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PHP Web integration */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5" id="php-syntax-card">
          <div className="flex items-center gap-2 mb-3">
            <FileCode className="w-4 h-4 text-sky-400" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">PHP Code Reference</h3>
          </div>
          <p className="text-xs text-white/50 mb-3 leading-relaxed">
            MJSTECH systems are originally engineered on **PHP + MySQL**. See how this SQL backend bridges with PHP syntax to output data columns:
          </p>
          <div className="relative">
            <pre className="text-[10px] font-mono text-emerald-400 max-h-56 overflow-y-auto bg-black/40 p-3 rounded-lg border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
              <code>{phpSnippet}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Right Pane - SQL Editor & Live Output Grid */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        {/* Terminal Editor */}
        <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden flex flex-col" id="sql-query-editor-card">
          <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#E24B4A]" />
              <span className="text-xs font-mono font-bold tracking-wider text-white">INTERACTIVE SQL TERMINAL</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                <span>DB: LIVE</span>
              </div>
              
              <button 
                onClick={handleLockConsole}
                className="flex items-center gap-1 text-[10.5px] font-mono bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-2 py-0.5 rounded border border-white/10 transition-all select-none font-semibold active:scale-95 cursor-pointer"
                id="lock-console-btn"
                title="Lock Terminal View"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Lock Console</span>
              </button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-white/40 mb-3">
              Type original SQL statements below to execute queries directly on our database cluster (Alasql Engine):
            </p>

            <textarea
              className="w-full h-32 bg-black text-emerald-300 font-mono text-sm p-4 rounded-lg border border-white/15 focus:border-[#E24B4A] focus:ring-1 focus:ring-[#E24B4A] focus:outline-none resize-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM table;"
              id="raw-sql-query-textarea"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-[#9a9590] mr-1 font-sans">Query Presets:</span>
                {templates.map((temp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(temp.sql);
                      handleRunQuery(temp.sql);
                    }}
                    className="text-[10.5px] bg-[#2e2e2e] hover:bg-[#3e3e3e] active:scale-95 text-white/70 hover:text-white px-2.5 py-1 rounded border border-white/5 transition-all font-mono"
                  >
                    {temp.name}
                  </button>
                ))}
              </div>

              {/* Execution trigger */}
              <button
                onClick={() => handleRunQuery()}
                disabled={loading}
                className="flex items-center gap-2 bg-[#E24B4A] hover:bg-[#A32D2D] active:scale-95 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm tracking-wide font-sans transition-all cursor-pointer"
                id="execute-query-btn"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loading ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Grid */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 flex-1 min-h-[300px] flex flex-col" id="sql-output-results-card">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">SQL Query Output Console</h3>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-start gap-3" id="sql-error-alert">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-300">Syntax / Compilation Fault</h4>
                <p className="text-xs font-mono mt-1 text-red-200/80">{error}</p>
              </div>
            </div>
          )}

          {!error && !result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30 py-12" id="sql-console-blank-state">
              <Terminal className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">No active terminal query result. Type SQL and click &quot;Run Query&quot;.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-[#9a9590]" id="sql-query-running-loader">
              <RefreshCw className="w-8 h-8 text-[#E24B4A] animate-spin mb-3" />
              <p className="text-xs font-mono">Quarrying local node engine indices...</p>
            </div>
          )}

          {!error && result && !loading && (
            <div className="flex-col flex-1" id="sql-results-viewport">
              {result.affectedRows !== undefined && (
                <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-3 rounded-lg flex items-center gap-2 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Success! Affected Rows/Response Status: {result.affectedRows}</span>
                </div>
              )}

              {result.rows.length === 0 ? (
                <div className="text-center py-8 text-white/40 italic text-xs font-mono border border-dashed border-white/10 rounded-lg">
                  Empty result set. Query executed with 0 response rows returned.
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-lg max-h-96">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-[#111111]/80 divide-x divide-white/5 text-white/80 border-b border-white/5">
                        <th className="py-2.5 px-3 font-semibold text-[#F09595]">#</th>
                        {result.columns.map((col) => (
                          <th key={col} className="py-2.5 px-3 font-semibold text-white/90 uppercase select-all">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {result.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-white/5 divide-x divide-white/5 transition-colors text-white/70">
                          <td className="py-2.5 px-3 text-white/30 text-center select-none">{rowIdx + 1}</td>
                          {result.columns.map((col) => (
                            <td key={col} className="py-2.5 px-3 whitespace-nowrap overflow-hidden max-w-sm text-ellipsis">
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-white/20 italic">NULL</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="text-[11px] text-white/30 mt-3 flex items-center justify-between font-mono">
                <span>Database Cluster: Alasql</span>
                <span>Response Rows Count: {result.rows.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
