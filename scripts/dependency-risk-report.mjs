import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function classifyAudit(result) {
  if (result.error || ![0, 1].includes(result.status)) throw Error('npm audit infrastructure failure');
  let report;
  try { report = JSON.parse(result.stdout); } catch { throw Error('npm audit returned invalid JSON'); }
  const counts = report.metadata?.vulnerabilities;
  if (report.error || report.auditReportVersion !== 2 || !counts || !report.vulnerabilities || !['info', 'low', 'moderate', 'high', 'critical', 'total'].every(key => Number.isInteger(counts[key]) && counts[key] >= 0)) throw Error('npm audit returned an incomplete/error report');
  if ((result.status === 1) !== (counts.total > 0)) throw Error('npm audit exit status disagrees with findings');
  return { report, counts };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  fs.mkdirSync('audit-results', { recursive: true });
  const summary = ['## DEPENDENCY RISK REPORT', 'Findings are unresolved security risks. A completed report is not a clean security audit. S12 remains PARCIAL.', '', '| Scope | Low | Moderate | High | Critical | Total |', '|---|---:|---:|---:|---:|---:|'];
  let failed = false;
  for (const side of ['backend', 'frontend']) for (const production of [false, true]) {
    const scope = `${side}-${production ? 'production' : 'full'}`;
    const output = `audit-results/${scope}.json`;
    if (fs.existsSync(output)) fs.unlinkSync(output);
    const args = ['audit', '--prefix', side, '--json', ...(production ? ['--omit=dev'] : [])];
    const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
    const result = spawnSync(process.platform === 'win32' ? process.execPath : 'npm', process.platform === 'win32' ? [npmCli, ...args] : args, { encoding: 'utf8', windowsHide: true, timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
    try {
      const { report, counts } = classifyAudit(result);
      fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
      const line = `| ${scope} | ${counts.low} | ${counts.moderate} | ${counts.high} | ${counts.critical} | ${counts.total} |`;
      summary.push(line); console.log(line);
      if (counts.total) console.log(`::warning title=Dependency risks (${scope})::${counts.total} unresolved findings; high=${counts.high}, critical=${counts.critical}. See audit JSON and S12 risk register.`);
    } catch (error) {
      failed = true;
      const message = `${scope}: ${error.message}; exit=${result.status}; signal=${result.signal ?? 'none'}`;
      console.error(message); summary.push(`\n**REPORT FAILED:** ${message}`);
    }
  }
  const markdown = summary.join('\n') + '\n';
  fs.writeFileSync('audit-results/summary.md', markdown);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  process.exitCode = failed ? 1 : 0;
}
