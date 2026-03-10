import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    dir: ".lighthouseci",
    maxLcpMs: 5500,
  };

  for (const arg of argv) {
    if (arg.startsWith("--dir=")) {
      args.dir = arg.slice("--dir=".length);
    } else if (arg.startsWith("--max-lcp-ms=")) {
      args.maxLcpMs = Number(arg.slice("--max-lcp-ms=".length));
    }
  }

  return args;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length === 0) {
    return NaN;
  }

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function toPathname(urlString) {
  try {
    return new URL(urlString).pathname || "/";
  } catch {
    return urlString;
  }
}

const { dir, maxLcpMs } = parseArgs(process.argv.slice(2));
const resolvedDir = path.resolve(process.cwd(), dir);

if (!fs.existsSync(resolvedDir)) {
  console.error(`❌ Lighthouse directory not found: ${resolvedDir}`);
  process.exit(1);
}

const reportFiles = fs
  .readdirSync(resolvedDir)
  .filter((name) => name.startsWith("lhr-") && name.endsWith(".json"))
  .map((name) => path.join(resolvedDir, name));

if (reportFiles.length === 0) {
  console.error(`❌ No Lighthouse reports found in ${resolvedDir}`);
  process.exit(1);
}

const reports = reportFiles.map((filePath) => {
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const requestedUrl = payload.requestedUrl ?? "";
  const finalUrl = payload.finalDisplayedUrl ?? payload.finalUrl ?? requestedUrl;
  const lcpMs = payload.audits?.["largest-contentful-paint"]?.numericValue;
  const performanceScore = payload.categories?.performance?.score;

  return {
    filePath,
    requestedUrl,
    finalUrl,
    requestedPath: toPathname(requestedUrl),
    finalPath: toPathname(finalUrl),
    lcpMs,
    performanceScore,
  };
});

const directAudits = new Set(
  reports.filter((report) => report.requestedPath === report.finalPath).map((report) => report.finalPath),
);

const selectedReports = reports.filter((report) => {
  if (report.requestedPath === report.finalPath) {
    return true;
  }

  return !directAudits.has(report.finalPath);
});

const skippedRedirectAliases = reports.filter((report) => !selectedReports.includes(report));

const groupedReports = new Map();

for (const report of selectedReports) {
  const key = report.requestedPath === report.finalPath ? report.requestedPath : report.finalPath;
  const bucket = groupedReports.get(key) ?? [];
  bucket.push(report);
  groupedReports.set(key, bucket);
}

const summaries = [...groupedReports.entries()]
  .map(([route, bucket]) => {
    const lcpValues = bucket.map((report) => report.lcpMs).filter((value) => Number.isFinite(value));
    const scoreValues = bucket
      .map((report) => report.performanceScore)
      .filter((value) => Number.isFinite(value));

    return {
      route,
      medianLcpMs: median(lcpValues),
      medianPerformanceScore: median(scoreValues),
      lcpValues,
      requestedUrls: [...new Set(bucket.map((report) => report.requestedUrl))],
    };
  })
  .sort((left, right) => right.medianLcpMs - left.medianLcpMs);

if (summaries.length === 0) {
  console.error("❌ No Lighthouse reports remained after redirect deduplication.");
  process.exit(1);
}

console.log("Lighthouse mobile budget summary:");

for (const summary of summaries) {
  const formattedScore =
    Number.isFinite(summary.medianPerformanceScore)
      ? summary.medianPerformanceScore.toFixed(2)
      : "n/a";
  console.log(
    `- ${summary.route}: median LCP ${summary.medianLcpMs.toFixed(0)}ms, median performance ${formattedScore}, runs [${summary.lcpValues.map((value) => value.toFixed(0)).join(", ")}]`,
  );
}

if (skippedRedirectAliases.length > 0) {
  console.log(
    `Skipped redirect-only audit aliases: ${[...new Set(skippedRedirectAliases.map((report) => report.requestedPath))].join(", ")}`,
  );
}

const violations = summaries.filter((summary) => summary.medianLcpMs > maxLcpMs);

if (violations.length > 0) {
  console.error(`❌ Mobile Lighthouse median LCP exceeded ${maxLcpMs}ms.`);

  for (const violation of violations) {
    console.error(
      `  - ${violation.route}: ${violation.medianLcpMs.toFixed(0)}ms > ${maxLcpMs}ms`,
    );
  }

  process.exit(1);
}

console.log(`✅ All Lighthouse mobile median LCP values are within ${maxLcpMs}ms.`);
