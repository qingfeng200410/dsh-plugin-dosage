/**
 * dsh-plugin-dosage — HOST half.
 *
 * Permanent Cordis plugin for a DeepSeek Harness web/desktop profile:
 *  - listens to `llm/stream`, records every model call's token usage,
 *    cache-hit/miss counts and finish reason;
 *  - persists records to `<DSH_HOME|~/.dsh>/dsh-usage/usage-records.json`
 *    (user-level, not the current project workspace);
 *  - serves a JSON API at `POST /usage/api` for the client half.
 *
 * The apply body is instrumented: every step is appended to a diagnostics
 * buffer and flushed to `<DSH_HOME|~/.dsh>/dsh-usage/dsh-usage-boot.log`
 * so activation failures are visible without app logs.
 *
 * Cross-platform note: path handling uses node:path (join / dirname) with the
 * host platform's separator, so the plugin works on Windows, macOS and Linux.
 */
import path from 'node:path'
import fsNative from 'node:fs'
import os from 'node:os'
import { apply as applyStats, collectCallRecords, Config } from './stats/server.js'

function resolveDshHome() {
  const raw = (typeof process !== 'undefined' && process.env && process.env.DSH_HOME)
    ? String(process.env.DSH_HOME)
    : path.join(os.homedir(), '.dsh')
  return process.platform === 'win32' ? raw.replace(/\//g, '\\') : raw
}

export default {
  inject: [
    'fs', 'webServer', 'subprocess', 'credentials', 'sandboxPolicy', 'agents',
    'sessions', 'sessionPersistence', 'settings', 'llm'
  ],
  Config,
  async apply(ctx, rawConfig = {}) {
    const diag = { ok: true, steps: [], error: null }
    const push = (s) => { try { diag.steps.push(String(s)) } catch (e) {} }
    const flushDiag = () => {
      try {
        const dir = path.join(resolveDshHome(), 'dsh-usage')
        fsNative.mkdirSync(dir, { recursive: true })
        fsNative.writeFileSync(
          path.join(dir, 'dsh-usage-boot.log'),
          JSON.stringify({ time: Date.now(), ...diag }, null, 2),
          'utf8'
        )
      } catch (e) {}
    }
    try {
      push('apply-start')

      const records = []
      const MAX_RECORDS = 100000

      const PRICING = {
        base: {
          'deepseek-v4-flash': { cacheHit: 0.02, cacheMiss: 1.0, output: 2.0 },
          'deepseek-v4-pro': { cacheHit: 0.025, cacheMiss: 3.0, output: 6.0 }
        },
        peakValley: {
          'deepseek-v4-flash': {
            offPeak: { cacheHit: 0.05, cacheMiss: 1.5, output: 4.5 },
            peak: { cacheHit: 0.1, cacheMiss: 3.0, output: 9.0 }
          },
          'deepseek-v4-pro': {
            offPeak: { cacheHit: 0.15, cacheMiss: 4.5, output: 13.5 },
            peak: { cacheHit: 0.3, cacheMiss: 9.0, output: 27.0 }
          }
        }
      }
      const DEFAULT_PRICING = JSON.parse(JSON.stringify(PRICING))
      const PRICE_MODELS = ['deepseek-v4-flash', 'deepseek-v4-pro']
      // 新价格表（峰谷价）生效时间：北京时间 2026-08-17 00:00。
      // 在此之前的调用按旧价格表（基础价 base）计费；之后按新价格表（峰谷价）计费。
      const EFFECTIVE_AT = Date.parse('2026-08-17T00:00:00+08:00')

      function modelKey(model) {
        const m = String(model || '').toLowerCase()
        if (m.indexOf('flash') >= 0) return 'deepseek-v4-flash'
        if (m.indexOf('pro') >= 0) return 'deepseek-v4-pro'
        return 'unknown'
      }

      function isPeak(ts) {
        const d = new Date(ts + 8 * 3600 * 1000)
        const t = d.getUTCHours() * 60 + d.getUTCMinutes()
        return (t >= 9 * 60 && t < 12 * 60) || (t >= 14 * 60 && t < 18 * 60)
      }

      // regime: 'base' = 旧价格表（基础价） | 'peakValley' = 新价格表（峰谷价） | 'auto' = 按生效日期自动切换
      function costFor(rec, regime) {
        const mk = modelKey(rec.model)
        const hit = rec.cacheReadTokens || 0
        const miss = rec.inputTokens || 0
        const out = rec.outputTokens || 0
        if (regime === 'base') {
          const p = PRICING.base[mk]
          if (!p) return 0
          return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
        }
        if (regime === 'auto') {
          // 生效前用旧价格表（基础价）；生效后按峰谷时段用新价格表
          if (rec.time < EFFECTIVE_AT) {
            const p = PRICING.base[mk]
            if (!p) return 0
            return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
          }
          const pv = PRICING.peakValley[mk]
          if (!pv) return 0
          const p = isPeak(rec.time) ? pv.peak : pv.offPeak
          return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
        }
        const pv = PRICING.peakValley[mk]
        if (!pv) return 0
        const p = isPeak(rec.time) ? pv.peak : pv.offPeak
        return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
      }

      const msg = (e) => String((e && e.message) || e)
      const fail = (message) => ({ ok: false, error: message })
      const pad2 = (n) => (n < 10 ? '0' : '') + n
      const fmtInt = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      const fmtTime = (ts) => {
        const d = new Date(ts + 8 * 3600 * 1000)
        return `${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`
      }
      const fmtMoney = (n) => {
        if (!n) return '0.0000'
        if (n < 0.0001) return n.toExponential(2)
        if (n < 1) return n.toFixed(4)
        return n.toFixed(2)
      }
      const IS_WIN = typeof process !== 'undefined' && process.platform === 'win32'
      const IS_MAC = typeof process !== 'undefined' && process.platform === 'darwin'
      // Windows 保留原有行为：把 / 统一成 \；POSIX 上保持原样（不做 / → \ 转换）。
      const normPath = (p) => {
        const s = String(p == null ? '' : p)
        return IS_WIN ? s.replace(/\//g, '\\') : s
      }
      // 平台化拼接：Windows 用反斜杠，POSIX 用正斜杠。
      const joinPath = (...parts) => path.join(...parts.map((p) => String(p == null ? '' : p)))
      const stamp = () => {
        const d = new Date()
        return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`
      }

      // ── daily aggregates (Beijing-time calendar) ───────────────────────────
      function bjKey(ts) {
        const d = new Date(Number(ts) + 8 * 3600 * 1000)
        return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`
      }

      function buildDays(list) {
        const map = {}
        for (const r of list) {
          const key = bjKey(r.time)
          let d = map[key]
          if (!d) {
            d = {
              day: key, calls: 0, miss: 0, hit: 0, write: 0, out: 0, reason: 0,
              peakCalls: 0, offPeakCalls: 0, baseCost: 0, peakValleyCost: 0, autoCost: 0,
              // 高峰/空闲时段消耗拆分（每个计费档位各一桶），供日历/概览区分展示
              basePeakCost: 0, baseOffPeakCost: 0,
              pvPeakCost: 0, pvOffPeakCost: 0,
              autoPeakCost: 0, autoOffPeakCost: 0
            }
            map[key] = d
          }
          d.calls++
          d.miss += r.inputTokens || 0
          d.hit += r.cacheReadTokens || 0
          d.write += r.cacheWriteTokens || 0
          d.out += r.outputTokens || 0
          d.reason += r.reasoningTokens || 0
          const cBase = costFor(r, 'base')
          const cPv = costFor(r, 'peakValley')
          const cAuto = costFor(r, 'auto')
          if (isPeak(r.time)) {
            d.peakCalls++
            d.basePeakCost += cBase
            d.pvPeakCost += cPv
            d.autoPeakCost += cAuto
          } else {
            d.offPeakCalls++
            d.baseOffPeakCost += cBase
            d.pvOffPeakCost += cPv
            d.autoOffPeakCost += cAuto
          }
          d.baseCost += cBase
          d.peakValleyCost += cPv
          d.autoCost += cAuto
        }
        const days = []
        for (const k in map) days.push(map[k])
        days.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0))
        return days
      }

      const fs = ctx.get('fs')
      push('fs=' + (fs ? 'present' : 'undefined'))
      let root = ''
      let dataPath = ''
      let pricingPath = ''
      let persistOk = false
      let persistError = ''
      let initPromise = null
      let writeChain = Promise.resolve()
      let cachedPolicy = null

      const dirs = () => ({
        data: joinPath(root, 'dsh-usage'),
        csv: joinPath(root, 'dsh-usage', 'csv'),
        json: joinPath(root, 'dsh-usage', 'json'),
        images: joinPath(root, 'dsh-usage', 'images')
      })

      function currentAgent() {
        try {
          const agents = ctx.get('agents')
          if (agents && typeof agents.currentInitiator === 'function') return agents.currentInitiator()
        } catch (e) {}
        return undefined
      }

      function sessionPolicy() {
        if (cachedPolicy) return cachedPolicy
        try {
          const agent = currentAgent()
          const sp = ctx.get('sandboxPolicy')
          if (sp && typeof sp.resolve === 'function' && agent && agent.session) {
            const policy = sp.resolve({ session: agent.session })
            if (policy && policy.workspaceRoot) {
              cachedPolicy = policy
              return policy
            }
          }
        } catch (e) {}
        return undefined
      }

      function writeTextNative(filePath, text) {
        fsNative.mkdirSync(path.dirname(filePath), { recursive: true })
        fsNative.writeFileSync(filePath, text, 'utf8')
      }

      function persistNow() {
        if (!dataPath) return Promise.resolve()
        const text = JSON.stringify(records)
        writeChain = writeChain.then(() => {
          writeTextNative(dataPath, text)
          persistOk = true
          persistError = ''
        }).catch((e) => {
          persistOk = false
          persistError = msg(e)
        })
        return writeChain
      }

      function persistPricing() {
        if (!pricingPath || !persistOk) return Promise.resolve()
        try {
          writeTextNative(pricingPath, JSON.stringify(PRICING))
        } catch (e) {}
        return Promise.resolve()
      }

      async function loadPricing() {
        if (!pricingPath) return
        try {
          const data = JSON.parse(fsNative.readFileSync(pricingPath, 'utf8'))
          if (!data || typeof data !== 'object') return
          for (const regime of ['base', 'peakValley']) {
            const src = data[regime]
            const dst = PRICING[regime]
            if (!src || typeof src !== 'object' || !dst) continue
            for (const mk of PRICE_MODELS) {
              const row = src[mk]
              if (!row || typeof row !== 'object' || !dst[mk]) continue
              for (const k of ['cacheHit', 'cacheMiss', 'output']) {
                const v = Number(row[k])
                if (Number.isFinite(v) && v >= 0) dst[mk][k] = v
              }
            }
          }
        } catch (e) {}
      }

      function normalizeRecord(raw) {
        if (!raw || typeof raw !== 'object') return null
        const time = Number(raw.time)
        if (!Number.isFinite(time) || time <= 0) return null
        const toNum = (v, d) => { const n = Number(v); return Number.isFinite(n) ? n : (d === undefined ? 0 : d) }
        return {
          time,
          model: String(raw.model || ''),
          provider: String(raw.provider || ''),
          purpose: String(raw.purpose || ''),
          inputTokens: toNum(raw.inputTokens),
          outputTokens: toNum(raw.outputTokens),
          cacheReadTokens: toNum(raw.cacheReadTokens),
          cacheWriteTokens: toNum(raw.cacheWriteTokens),
          reasoningTokens: toNum(raw.reasoningTokens),
          finishReason: String(raw.finishReason || '')
        }
      }

      function mergeRecords(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return
        const existing = {}
        for (let i = 0; i < records.length; i++) existing[records[i].time] = true
        for (let i = 0; i < arr.length; i++) {
          const rec = normalizeRecord(arr[i])
          if (!rec || existing[rec.time]) continue
          existing[rec.time] = true
          records.push(rec)
        }
        if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS)
        records.sort((a, b) => a.time - b.time)
      }

      async function readRecordsFile(filePath) {
        try {
          const arr = JSON.parse(fsNative.readFileSync(filePath, 'utf8'))
          if (Array.isArray(arr)) return arr
        } catch (e) {}
        if (fs) {
          try {
            const arr = JSON.parse(await fs.readText(await fs.resolve(filePath)))
            if (Array.isArray(arr)) return arr
          } catch (e) {}
        }
        return null
      }

      function collectSessionCandidates() {
        const candidates = []
        const agent = currentAgent()
        if (agent && agent.session && agent.session.header && agent.session.header.cwd) {
          candidates.push(normPath(String(agent.session.header.cwd)))
        }
        try {
          const sp = ctx.get('sandboxPolicy')
          if (sp && sp.workspaceRoot) candidates.push(normPath(String(sp.workspaceRoot)))
        } catch (e) {}
        try {
          if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
            candidates.push(normPath(process.cwd()))
          }
        } catch (e) {}
        return candidates
      }

      async function migrateLegacy(candidates) {
        const paths = []
        for (const c of candidates) {
          if (!c) continue
          paths.push(joinPath(normPath(c), '.dsh-usage-records.json'))
          paths.push(joinPath(normPath(c), 'dsh-usage', 'usage-records.json'))
        }
        for (const p of paths) {
          const arr = await readRecordsFile(p)
          if (arr) mergeRecords(arr)
        }
      }

      // 会话工作区里可能还有旧数据；只合并进来，不再把存储根切到项目目录。
      let sessionMigrated = false
      async function ensureSessionRoot() {
        if (sessionMigrated) return
        const candidates = collectSessionCandidates()
        if (candidates.length === 0) return
        sessionMigrated = true
        await migrateLegacy(candidates)
        persistNow()
      }

      async function initPersistence() {
        const nextRoot = resolveDshHome()
        const nextData = joinPath(nextRoot, 'dsh-usage', 'usage-records.json')
        const nextPricing = joinPath(nextRoot, 'dsh-usage', 'pricing.json')
        try {
          fsNative.mkdirSync(path.dirname(nextData), { recursive: true })
        } catch (e) {
          persistOk = false
          persistError = '无法创建数据目录：' + msg(e)
          push('persist-mkdir-failed: ' + persistError)
          return
        }
        root = nextRoot
        dataPath = nextData
        pricingPath = nextPricing
        const existing = await readRecordsFile(dataPath)
        if (existing) mergeRecords(existing)
        await loadPricing()
        const sessionCandidates = collectSessionCandidates()
        await migrateLegacy(sessionCandidates)
        if (sessionCandidates.length > 0) sessionMigrated = true
        await persistNow()
        if (persistOk) push('persist-ok path=' + dataPath)
        else push('persist-write-failed: ' + persistError)
      }

      const ensureInit = () => (initPromise ||= initPersistence())

      try { ensureInit() } catch (e) { push('ensureInit-threw: ' + msg(e)) }

      // ── capture ────────────────────────────────────────────────────────────
      try {
        ctx.on('llm/stream', function (options, next) {
          const source = next()
          const model = (options && options.model) || ''
          const provider = (options && options.provider) || ''
          const purpose = options && options.purpose ? String(options.purpose) : ''
          const startedAt = Date.now()
          let usage = null
          let finishReason = ''

          async function* observe() {
            try {
              for await (const chunk of source) {
                if (chunk && chunk.type === 'usage' && chunk.usage) {
                  usage = chunk.usage
                } else if (chunk && chunk.type === 'finish') {
                  const r = chunk.reason
                  finishReason = r ? String(r.kind || '') : ''
                }
                yield chunk
              }
            } finally {
              if (usage) {
                records.push({
                  time: startedAt,
                  model,
                  provider,
                  purpose,
                  inputTokens: usage.inputTokens || 0,
                  outputTokens: usage.outputTokens || 0,
                  cacheReadTokens: usage.cacheReadTokens || 0,
                  cacheWriteTokens: usage.cacheWriteTokens || 0,
                  reasoningTokens: usage.reasoningTokens || 0,
                  finishReason
                })
                if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS)
                try {
                  const agent = currentAgent()
                  const sp = ctx.get('sandboxPolicy')
                  if (sp && typeof sp.resolve === 'function' && agent && agent.session) {
                    const policy = sp.resolve({ session: agent.session })
                    if (policy && policy.workspaceRoot) cachedPolicy = policy
                  }
                } catch (e) {}
                ensureInit().then(() => ensureSessionRoot()).then(persistNow).catch(() => {})
              }
            }
          }

          return observe()
        })
        push('llm-stream-listener-ok')
      } catch (e) {
        push('llm-stream-listener-threw: ' + (e && e.stack ? e.stack : msg(e)))
      }

      // ── balance ────────────────────────────────────────────────────────────
      function parseBalance(text) {
        let data
        try { data = JSON.parse(text) } catch (e) { return fail('无法解析余额响应') }
        const infos = []
        const rawInfos = data && Array.isArray(data.balance_infos) ? data.balance_infos : []
        for (const b of rawInfos) {
          infos.push({
            currency: String(b.currency || 'CNY'),
            totalBalance: String(b.total_balance == null ? '0' : b.total_balance),
            grantedBalance: String(b.granted_balance == null ? '0' : b.granted_balance),
            toppedUpBalance: String(b.topped_up_balance == null ? '0' : b.topped_up_balance)
          })
        }
        return { ok: true, queriedAt: Date.now(), isAvailable: data.is_available === true, infos }
      }

      // spawn 的 cwd：校验工作区目录真实存在，无效时回退到宿主进程的 cwd
      // （POSIX 上根目录是伪路径/不存在时，直接传 cwd 会导致 spawn ENOENT）。
      async function safeCwd() {
        if (root && fs) {
          try {
            const t = await fs.resolve(root)
            const info = await fs.stat(t)
            if (info) return root
          } catch (e) {}
        }
        return (typeof process !== 'undefined' && typeof process.cwd === 'function' && process.cwd()) || '.'
      }

      // 通用子进程执行：收集 stdout/stderr，统一处理 cwd 与错误分类。
      async function runCollect(argv, opts) {
        const subprocess = ctx.get('subprocess')
        if (!subprocess) return { ok: false, error: '命令执行服务不可用' }
        let handle
        try {
          handle = subprocess.spawn({
            argv,
            cwd: await safeCwd(),
            stdio: opts && opts.stdinData != null
              ? { stdin: { data: opts.stdinData }, stdout: { maxBytes: 65536 }, stderr: { maxBytes: 65536 } }
              : { stdin: 'ignore', stdout: { maxBytes: 65536 }, stderr: { maxBytes: 65536 } },
            graceMs: (opts && opts.graceMs) || 15000,
            ...(opts && opts.env ? { env: opts.env } : {})
          })
        } catch (e) { return { ok: false, error: '启动失败：' + msg(e) } }
        let outcome
        try { outcome = await handle.done } catch (e) { return { ok: false, error: '执行失败：' + msg(e) } }
        const outText = handle.collected && handle.collected.stdout ? handle.collected.stdout.readFrom(0).text : ''
        const errText = handle.collected && handle.collected.stderr ? handle.collected.stderr.readFrom(0).text : ''
        return { ok: outcome.exitCode === 0, exitCode: outcome.exitCode, out: outText, err: errText }
      }

      // node 可执行文件候选：Windows 保留原有路径；POSIX 走 PATH；
      // Electron 宿主（桌面端）下用 execPath + ELECTRON_RUN_AS_NODE=1 兜底。
      const isElectron = typeof process !== 'undefined' && !!(process.versions && process.versions.electron)
      function nodeCandidates() {
        const list = IS_WIN
          ? ['node.exe', 'node', 'C:\\Program Files\\nodejs\\node.exe']
          : ['node']
        if (typeof process !== 'undefined' && process.execPath && !list.includes(process.execPath)) list.push(process.execPath)
        return list
      }

      async function spawnNode(script, stdinData, env) {
        const subprocess = ctx.get('subprocess')
        if (!subprocess) return { ok: false, error: '命令执行服务不可用' }
        let exe = null
        for (const c of nodeCandidates()) {
          try { exe = await subprocess.resolveExecutable(c); if (exe) break } catch (e) {}
        }
        if (!exe) return { ok: false, error: '未找到 node 可执行文件' }
        const finalEnv = env || {}
        if (isElectron && exe === process.execPath && !('ELECTRON_RUN_AS_NODE' in finalEnv)) {
          finalEnv.ELECTRON_RUN_AS_NODE = '1'
        }
        const r = await runCollect([exe, '-e', script], { stdinData, env: finalEnv })
        if (!r.ok) {
          if (r.exitCode != null) return { ok: false, error: 'node 退出码 ' + r.exitCode + (r.err ? '：' + r.err.trim() : '') }
          return { ok: false, error: r.error || '执行失败' }
        }
        return { ok: true, out: r.out }
      }

      async function queryBalance() {
        const credentials = ctx.get('credentials')
        if (!credentials) return fail('凭据服务不可用')
        let hit
        try { hit = await credentials.resolve('DEEPSEEK_API_KEY') } catch (e) { return fail('读取凭据失败：' + msg(e)) }
        if (!hit || !hit.value) return fail('未配置 DEEPSEEK_API_KEY，请在「设置 → 模型」中配置后重试')
        const key = hit.value
        const script = [
          'const https=require("https");',
          'const key=process.env.BALANCE_API_KEY||"";',
          'const req=https.get("https://api.deepseek.com/user/balance",{headers:{Authorization:"Bearer "+key}},function(res){',
          'var body="";',
          'res.on("data",function(c){body+=c});',
          'res.on("end",function(){process.stdout.write(JSON.stringify({statusCode:res.statusCode,body:body}))});',
          '});',
          'req.on("error",function(e){process.stdout.write(JSON.stringify({error:String(e&&e.message||e)}))});',
          'req.setTimeout(20000,function(){req.destroy(new Error("timeout"))});'
        ].join('\n')
        const r = await spawnNode(script, null, { BALANCE_API_KEY: key })
        if (!r.ok) return fail(r.error)
        let parsed
        try { parsed = JSON.parse(r.out) } catch (e) { return fail('无法解析 node 输出') }
        if (parsed.error) return fail(parsed.error)
        if (parsed.statusCode !== 200) return fail('接口返回 HTTP ' + parsed.statusCode + '：' + String(parsed.body || '').slice(0, 300))
        return parseBalance(parsed.body)
      }

      // ── export helpers ─────────────────────────────────────────────────────
      function csvCell(s) {
        s = String(s == null ? '' : s)
        if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
        return s
      }

      function buildCsv(list) {
        const header = ['time', 'model', 'provider', 'inputTokens', 'cacheReadTokens', 'cacheWriteTokens', 'outputTokens', 'reasoningTokens', 'finishReason', 'period', 'baseCost', 'peakValleyCost', 'autoCost']
        const lines = [header.join(',')]
        for (const r of list) {
          lines.push([
            r.time, r.model, r.provider, r.inputTokens, r.cacheReadTokens, r.cacheWriteTokens,
            r.outputTokens, r.reasoningTokens, r.finishReason,
            isPeak(r.time) ? 'peak' : 'offPeak', costFor(r, 'base'), costFor(r, 'peakValley'), costFor(r, 'auto')
          ].map(csvCell).join(','))
        }
        return lines.join('\r\n')
      }

      async function writePngFile(base64, outPath) {
        const script = [
          'const fs=require("fs");',
          'let d="";',
          'process.stdin.on("data",function(c){d+=c});',
          'process.stdin.on("end",function(){',
          '  const buf=Buffer.from(d,"base64");',
          '  fs.mkdirSync(require("path").dirname(process.env.PNG_PATH),{recursive:true});',
          '  fs.writeFileSync(process.env.PNG_PATH,buf);',
          '  process.stdout.write(JSON.stringify({ok:true,bytes:buf.length}));',
          '});'
        ].join('\n')
        return spawnNode(script, base64, { PNG_PATH: outPath })
      }

      async function writeTextFileViaNode(content, outPath) {
        const script = [
          'const fs=require("fs");',
          'let d="";',
          'process.stdin.on("data",function(c){d+=c});',
          'process.stdin.on("end",function(){',
          '  fs.mkdirSync(require("path").dirname(process.env.OUT_PATH),{recursive:true});',
          '  fs.writeFileSync(process.env.OUT_PATH, Buffer.from(d,"utf8"));',
          '  process.stdout.write(JSON.stringify({ok:true}));',
          '});'
        ].join('\n')
        return spawnNode(script, content, { OUT_PATH: outPath })
      }

      async function mkdirViaNode(dir) {
        const script = [
          'const fs=require("fs");',
          'fs.mkdirSync(process.env.MKDIR_PATH,{recursive:true});',
          'process.stdout.write(JSON.stringify({ok:true}));'
        ].join('\n')
        return spawnNode(script, null, { MKDIR_PATH: dir })
      }

      async function pickDirectory() {
        const subprocess = ctx.get('subprocess')
        if (!subprocess) return fail('命令执行服务不可用')
        // macOS：osascript 原生目录选择（POSIX path）。
        if (IS_MAC) {
          let exe = null
          try { exe = await subprocess.resolveExecutable('osascript') } catch (e) {}
          if (!exe) return fail('未找到 osascript（macOS 需安装命令行工具 Command Line Tools）')
          const r = await runCollect([exe, '-e', 'POSIX path of (choose folder)'], { graceMs: 120000 })
          if (!r.ok && r.error) return fail(r.error)
          const path = normPath(r.out.trim())
          if (!path) return { ok: false, cancelled: true }
          return { ok: true, path }
        }
        // Linux：优先 zenity，其次 kdialog。
        if (!IS_WIN) {
          for (const c of ['zenity', 'kdialog']) {
            let exe = null
            try { exe = await subprocess.resolveExecutable(c) } catch (e) {}
            if (!exe) continue
            const argv = c === 'zenity'
              ? [exe, '--file-selection', '--directory', '--title=选择导出目录']
              : [exe, '--getexistingdirectory', '选择导出目录']
            const r = await runCollect(argv, { graceMs: 120000 })
            if (!r.ok && r.error) return fail(r.error)
            const path = normPath(r.out.trim())
            if (!path) return { ok: false, cancelled: true }
            return { ok: true, path }
          }
          return fail('未找到目录选择工具（请安装 zenity 或 kdialog）')
        }
        // Windows：PowerShell 原生目录选择。
        let exe = null
        for (const c of ['powershell.exe', 'pwsh.exe', 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe']) {
          try { exe = await subprocess.resolveExecutable(c); if (exe) break } catch (e) {}
        }
        if (!exe) return fail('未找到 PowerShell')
        const script = 'Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = "选择导出目录"; if ($f.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($f.SelectedPath) }'
        const r = await runCollect([exe, '-NoProfile', '-STA', '-NonInteractive', '-Command', script], { graceMs: 120000 })
        if (!r.ok && r.error) return fail(r.error)
        const path = normPath(r.out.trim())
        if (!path) return { ok: false, cancelled: true }
        return { ok: true, path }
      }

      async function revealDir(dirArg) {
        const subprocess = ctx.get('subprocess')
        if (!subprocess) return fail('命令执行服务不可用')
        let target = ''
        const isKey = dirArg === 'csv' || dirArg === 'json' || dirArg === 'images' || dirArg === 'data'
        if (isKey) {
          const d = dirs()
          target = dirArg === 'csv' ? d.csv : dirArg === 'json' ? d.json : dirArg === 'images' ? d.images : d.data
          target = normPath(target)
          try { fsNative.mkdirSync(target, { recursive: true }) } catch (e) {}
        } else {
          target = normPath(dirArg)
          await mkdirViaNode(target)
        }
        // 平台化「在文件管理器中显示」：Windows explorer.exe / macOS open / Linux xdg-open。
        const revealCmd = IS_WIN ? 'explorer.exe' : (IS_MAC ? 'open' : 'xdg-open')
        let exe = null
        try { exe = await subprocess.resolveExecutable(revealCmd) } catch (e) {}
        if (!exe) return fail('未找到 ' + revealCmd)
        try {
          subprocess.spawn({ argv: [exe, target], cwd: await safeCwd(), stdio: { stdin: 'ignore', stdout: { maxBytes: 1024 }, stderr: { maxBytes: 1024 } }, graceMs: 5000 })
          return { ok: true }
        } catch (e) { return fail(msg(e)) }
      }

      async function displayRecords() {
        try {
          const fromSessions = await collectCallRecords(ctx)
          if (Array.isArray(fromSessions) && fromSessions.length > 0) return fromSessions
        } catch (e) {
          push('collectCallRecords-failed: ' + msg(e))
        }
        return records
      }

      function mapListItems(list) {
        return list.map((r) => ({
          time: r.time, model: r.model, provider: r.provider, purpose: r.purpose,
          inputTokens: r.inputTokens, outputTokens: r.outputTokens,
          cacheReadTokens: r.cacheReadTokens, cacheWriteTokens: r.cacheWriteTokens,
          reasoningTokens: r.reasoningTokens, finishReason: r.finishReason,
          modelKey: modelKey(r.model),
          baseCost: costFor(r, 'base'), peakValleyCost: costFor(r, 'peakValley'), autoCost: costFor(r, 'auto'),
          peak: isPeak(r.time)
        }))
      }

      async function routeApi(body) {
        const action = body && body.action ? String(body.action) : ''
        try { await ensureInit() } catch (e) {}
        switch (action) {
          case 'list': {
            const source = await displayRecords()
            return { ok: true, records: mapListItems(source), count: source.length, dataPath, persistOk, persistError, pricing: PRICING, effectiveAt: EFFECTIVE_AT, days: buildDays(source) }
          }
          case 'clear': {
            const n = records.length
            records.length = 0
            persistNow()
            return { ok: true, cleared: n }
          }
          case 'setPrices': {
            const prices = body && body.prices
            if (!prices || typeof prices !== 'object') return fail('缺少价格数据')
            let changed = false
            for (const regime of ['base', 'peakValley']) {
              const src = prices[regime]
              const dst = PRICING[regime]
              if (!src || typeof src !== 'object' || !dst) continue
              for (const mk of PRICE_MODELS) {
                const row = src[mk]
                if (!row || typeof row !== 'object' || !dst[mk]) continue
                for (const k of ['cacheHit', 'cacheMiss', 'output']) {
                  const v = Number(row[k])
                  if (Number.isFinite(v) && v >= 0) { dst[mk][k] = v; changed = true }
                }
              }
            }
            if (!changed) return fail('没有可用的价格更新（价格必须是非负数字）')
            persistPricing()
            return { ok: true }
          }
          case 'resetPrices': {
            for (const regime of ['base', 'peakValley']) {
              const src = DEFAULT_PRICING[regime]
              const dst = PRICING[regime]
              if (!src || !dst) continue
              for (const mk of PRICE_MODELS) {
                if (!src[mk] || !dst[mk]) continue
                dst[mk].cacheHit = src[mk].cacheHit
                dst[mk].cacheMiss = src[mk].cacheMiss
                dst[mk].output = src[mk].output
              }
            }
            persistPricing()
            return { ok: true }
          }
          case 'balance':
            return queryBalance()
          case 'pickDir':
            return pickDirectory()
          case 'export': {
            if (!root) return fail('未找到数据目录')
            const source = await displayRecords()
            const kind = (body && body.kind) === 'json' ? 'json' : 'csv'
            const name = 'dsh-usage-' + stamp() + (kind === 'json' ? '.json' : '.csv')
            const content = kind === 'json'
              ? JSON.stringify({ exportedAt: Date.now(), pricing: PRICING, records: source }, null, 2)
              : buildCsv(source)
            const dirArg = body && body.dir ? normPath(String(body.dir)) : ''
            if (dirArg) {
              const outPath = joinPath(dirArg, name)
              const r = await writeTextFileViaNode(content, outPath)
              if (!r.ok) return fail(r.error)
              return { ok: true, path: outPath, name, dir: dirArg }
            }
            const outPath = joinPath(kind === 'json' ? dirs().json : dirs().csv, name)
            try {
              writeTextNative(outPath, content)
              return { ok: true, path: outPath, name, dir: kind === 'json' ? 'json' : 'csv' }
            } catch (e) { return fail(msg(e)) }
          }
          case 'exportPng': {
            const dataUrl = body && body.dataUrl ? String(body.dataUrl) : ''
            if (!dataUrl) return fail('缺少图片数据')
            const idx = dataUrl.indexOf('base64,')
            const b64 = idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl
            if (!root) return fail('未找到数据目录')
            const name = 'dsh-usage-report-' + stamp() + '.png'
            const dirArg = body && body.dir ? normPath(String(body.dir)) : ''
            const outPath = normPath(joinPath(dirArg || dirs().images, name))
            const r = await writePngFile(b64, outPath)
            if (!r.ok) return fail(r.error)
            return { ok: true, path: outPath, name, dir: dirArg || 'images' }
          }
          case 'import': {
            const content = body && body.content != null ? String(body.content) : ''
            const filename = body && body.filename ? String(body.filename) : ''
            if (!content) return fail('请选择要导入的文件')
            let parsed
            if (String(filename || '').toLowerCase().indexOf('.csv') >= 0) {
              const lines = String(content).split(/\r?\n/).filter((l) => l.trim().length > 0)
              const header = lines[0] ? parseCsvLine(lines[0]) : []
              const idx = {}
              header.forEach((h, i) => { idx[String(h).trim()] = i })
              parsed = lines.slice(1).map((line) => {
                const cells = parseCsvLine(line)
                const get = (name) => (idx[name] === undefined ? '' : (cells[idx[name]] === undefined ? '' : cells[idx[name]]))
                return {
                  time: get('time'), model: get('model'), provider: get('provider'),
                  inputTokens: get('inputTokens'), outputTokens: get('outputTokens'),
                  cacheReadTokens: get('cacheReadTokens'), cacheWriteTokens: get('cacheWriteTokens'),
                  reasoningTokens: get('reasoningTokens'), finishReason: get('finishReason')
                }
              })
            } else {
              try {
                const data = JSON.parse(content)
                parsed = Array.isArray(data) ? data : (data && Array.isArray(data.records) ? data.records : null)
              } catch (e) { parsed = null }
            }
            if (!parsed || !Array.isArray(parsed)) return fail('文件内容不是可识别的用量数据（支持 JSON 或 CSV）')
            let imported = 0, skipped = 0, invalid = 0
            const existing = {}
            for (const r of records) existing[r.time] = true
            for (const raw of parsed) {
              const rec = normalizeRecord(raw)
              if (!rec) { invalid++; continue }
              if (existing[rec.time]) { skipped++; continue }
              existing[rec.time] = true
              records.push(rec)
              imported++
            }
            if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS)
            records.sort((a, b) => a.time - b.time)
            persistNow()
            return { ok: true, imported, skipped, invalid, total: records.length }
          }
          case 'reveal': {
            const dirArg = body && body.dir ? String(body.dir) : 'data'
            return revealDir(dirArg)
          }
          default:
            return fail('未知操作：' + action)
        }
      }

      function parseCsvLine(line) {
        const cells = []
        let cur = ''
        let inQ = false
        for (let i = 0; i < line.length; i++) {
          const ch = line[i]
          if (inQ) {
            if (ch === '"') {
              if (line[i + 1] === '"') { cur += '"'; i++ } else inQ = false
            } else cur += ch
          } else if (ch === '"') inQ = true
          else if (ch === ',') { cells.push(cur); cur = '' }
          else cur += ch
        }
        cells.push(cur)
        return cells
      }

      function readBody(req) {
        return new Promise((resolve) => {
          let d = ''
          req.on('data', (c) => { d += c })
          req.on('end', () => { try { resolve(JSON.parse(d)) } catch (e) { resolve({}) } })
          req.on('error', () => resolve({}))
        })
      }

      function sendJson(res, obj) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify(obj))
      }

      const webServer = ctx.get('webServer')
      push('webServer=' + (webServer ? 'present' : 'undefined'))
      if (webServer && typeof webServer.register === 'function') {
        try {
          webServer.register({
            kind: 'exact',
            path: '/usage/api',
            handler: async (req, res) => {
              try {
                const body = await readBody(req)
                sendJson(res, await routeApi(body))
              } catch (e) {
                sendJson(res, { ok: false, error: msg(e) })
              }
            }
          })
          push('route-registered')
        } catch (e) {
          push('route-register-threw: ' + (e && e.stack ? e.stack : msg(e)))
        }
      } else {
        push('route-not-registered (no webServer)')
      }

      push('apply-end')
      try {
        if (!ctx.logger) {
          try { ctx.logger = { warn() {}, info() {}, error() {}, debug() {} } } catch (e) {}
        }
        await applyStats(ctx, rawConfig)
        push('stats-ok')
      } catch (e) {
        push('stats-failed: ' + (e && e.stack ? e.stack : msg(e)))
      }
      diag.ok = true
    } catch (e) {
      diag.ok = false
      diag.error = (e && e.stack) ? e.stack : String(e)
    }
    flushDiag()
  }
}
