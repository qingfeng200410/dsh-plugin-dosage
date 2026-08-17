/**
 * dsh-plugin-dosage — pre-publish sanity gate (dependency-free).
 *
 * Run by `npm run check` and `npm run prepublishOnly` before the package is
 * packed/uploaded. It verifies every piece of the DSH plugin contract that
 * would otherwise fail LOUDLY at boot or client-load time when missing:
 *
 *   1. `dsh.bundle.patch` — the profile bundle patch file exists and carries a
 *      valid insert entry naming this package (auto-activation via
 *      `dsh plugin --profile <name> add <pkg>` depends on it).
 *   2. `dsh.client` — the web client declaration and `exports["./client"]`
 *      bundle exist (the host serves it at `/plugins/<name>/client.js`).
 *   3. `files` — the publish whitelist covers every artifact above.
 *
 * This is a structural gate, not a full parser; the authoritative YAML +
 * loader-composition validation is done by DSH itself at profile boot.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const fail = (message) => {
	console.error(`[check-package] FAIL: ${message}`);
	process.exitCode = 1;
};

let ok = true;
const check = (condition, message) => {
	if (!condition) {
		fail(message);
		ok = false;
	}
};

let pkg;
try {
	pkg = JSON.parse(readFileSync(resolve(pkgDir, "package.json"), "utf8"));
} catch (error) {
	console.error(`[check-package] FAIL: cannot read package.json: ${String(error && error.message || error)}`);
	process.exit(1);
}

// ── identity ───────────────────────────────────────────────────────────────
check(typeof pkg.name === "string" && pkg.name.length > 0, "package.json must declare a name");
check(typeof pkg.version === "string" && /^\d+\.\d+\.\d+/.test(pkg.version), `invalid version ${JSON.stringify(pkg.version)}`);

// ── dsh.bundle patch (host-side auto-activation) ───────────────────────────
const bundlePatch = pkg.dsh && pkg.dsh.bundle && pkg.dsh.bundle.patch;
check(typeof bundlePatch === "string" && bundlePatch.length > 0, 'package.json must declare "dsh": { "bundle": { "patch": "..." } }');
if (typeof bundlePatch === "string") {
	const patchPath = resolve(pkgDir, bundlePatch);
	check(existsSync(patchPath), `dsh.bundle.patch file not found: ${bundlePatch}`);
	if (existsSync(patchPath)) {
		const text = readFileSync(patchPath, "utf8");
		check(text.includes("- insert:"), `bundle patch ${bundlePatch} must contain a top-level "- insert:" entry`);
		check(text.includes(`name: '${pkg.name}'`) || text.includes(`name: "${pkg.name}"`), `bundle patch ${bundlePatch} must insert an entry with name: '${pkg.name}'`);
		const required = ["fs", "webServer", "subprocess", "credentials", "sandboxPolicy", "agents", "sessions", "sessionPersistence", "settings", "llm"];
		const missing = required.filter((service) => !text.includes(`- ${service}`));
		check(missing.length === 0, `bundle patch ${bundlePatch} is missing inject entries: ${missing.join(", ")}`);
	}
}

// ── dsh.client + client bundle (browser half) ──────────────────────────────
const clientDecl = pkg.dsh && pkg.dsh.client;
check(clientDecl !== null && typeof clientDecl === "object", 'package.json must declare "dsh": { "client": { "platform": "web", ... } }');
if (clientDecl !== null && typeof clientDecl === "object") {
	check(clientDecl.platform === "web", `dsh.client.platform must be "web" (got ${JSON.stringify(clientDecl.platform)})`);
	check(Array.isArray(clientDecl.inject) && clientDecl.inject.length > 0, "dsh.client.inject must be a non-empty string array");
}
const clientRel = pkg.exports && (typeof pkg.exports["./client"] === "string" ? pkg.exports["./client"] : (pkg.exports["./client"] && pkg.exports["./client"].default));
check(typeof clientRel === "string", 'package.json must export "./client" pointing at the client bundle');
if (typeof clientRel === "string") {
	check(existsSync(resolve(pkgDir, clientRel)), `client bundle not found: ${clientRel} (run the client build before publishing)`);
}

// ── files whitelist ────────────────────────────────────────────────────────
check(Array.isArray(pkg.files), "package.json must declare a files whitelist");
for (const entry of pkg.files || []) {
	check(existsSync(resolve(pkgDir, entry)), `files entry not found: ${entry}`);
}

if (ok) console.log(`[check-package] OK — ${pkg.name}@${pkg.version} satisfies the DSH plugin contract`);
