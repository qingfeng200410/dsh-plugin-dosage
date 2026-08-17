window.__ModuleLoader__.load({
  id: "dsh-plugin-dosage",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var React = require("react");
    var el = React.createElement;

    // ── inline styles (replaces a stylesheet; portable across client plugins) ──
    // 字号用 em 表示，随宿主“显示大小”设置的字体基准自动缩放（继承应用字号）；
    // 间距保持 px，仅微调以适配更大的字号。标注的 px 是默认 13px 基准下的设计值。
    var BASE_FS = 13;
    var fs = function (n) { return (Math.round((n + 2) / BASE_FS * 100) / 100).toFixed(2) + "em"; };
    var hair = "rgba(128,128,128,.22)";
    var hairStrong = "rgba(128,128,128,.32)";
    var fill = "rgba(128,128,128,.06)";
    var st = {
      root: { display: "flex", flexDirection: "column", gap: 20, padding: "2px 0 8px", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" },
      tab: { padding: "12px 20px 24px", maxWidth: "min(960px, calc(100vw - 24px))", margin: "0 auto", width: "100%", minWidth: 0, boxSizing: "border-box" },
      head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
      headleft: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 },
      title: { fontSize: fs(15), fontWeight: 600, letterSpacing: "-0.01em" },
      kicker: { fontSize: fs(11), opacity: 0.5, fontWeight: 500, letterSpacing: "0.04em" },
      sub: { fontSize: fs(12), opacity: 0.5, lineHeight: 1.45 },
      actions: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
      btn: { border: "1px solid " + hairStrong, background: "transparent", borderRadius: 8, padding: "6px 12px", fontSize: fs(12), cursor: "pointer", color: "inherit", minHeight: 32 },
      btnPrimary: { border: "1px solid rgba(90,140,255,.5)", background: "rgba(90,140,255,.16)", borderRadius: 8, padding: "6px 12px", fontSize: fs(12), cursor: "pointer", color: "inherit", minHeight: 32, fontWeight: 600 },
      btnGhost: { border: 0, background: "transparent", borderRadius: 8, padding: "6px 10px", fontSize: fs(12), cursor: "pointer", color: "inherit", opacity: 0.7, minHeight: 32 },
      btnDisabled: { border: "1px solid " + hair, background: "transparent", borderRadius: 8, padding: "6px 12px", fontSize: fs(12), cursor: "default", color: "inherit", opacity: 0.45, minHeight: 32 },
      input: { border: "1px solid " + hairStrong, background: fill, borderRadius: 8, padding: "6px 10px", fontSize: fs(12), color: "inherit", minWidth: 220, flex: "1 1 220px" },
      dateInput: { border: "1px solid " + hairStrong, background: fill, borderRadius: 8, padding: "5px 8px", fontSize: fs(12), color: "inherit" },
      seg: { display: "inline-flex", border: "1px solid " + hair, borderRadius: 8, overflow: "hidden", flexWrap: "wrap" },
      segBtn: { border: 0, background: "transparent", padding: "6px 12px", fontSize: fs(12), cursor: "pointer", color: "inherit" },
      segBtnOn: { border: 0, background: "rgba(90,140,255,.18)", padding: "6px 12px", fontSize: fs(12), cursor: "pointer", color: "inherit", fontWeight: 600 },
      cards: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 },
      card: { border: "1px solid " + hair, borderRadius: 10, padding: "12px 14px", minWidth: 0, background: fill },
      cardL: { fontSize: fs(11), opacity: 0.5, marginBottom: 6 },
      cardV: { fontSize: fs(18), fontWeight: 600, overflowWrap: "anywhere", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" },
      cardH: { fontSize: fs(11), opacity: 0.45, marginTop: 4, overflowWrap: "anywhere" },
      sec: { fontSize: fs(13), fontWeight: 600, margin: 0 },
      sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 4 },
      subtabBar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderBottom: "1px solid " + hair, marginTop: -4 },
      subtabs: { display: "flex", gap: 2, flexWrap: "wrap", minWidth: 0 },
      subtab: { border: 0, background: "transparent", padding: "10px 12px", fontSize: fs(13), cursor: "pointer", color: "inherit", opacity: 0.5, borderBottom: "2px solid transparent", marginBottom: -1, borderRadius: 0 },
      subtabOn: { border: 0, background: "transparent", padding: "10px 12px", fontSize: fs(13), cursor: "pointer", color: "inherit", opacity: 1, fontWeight: 600, borderBottom: "2px solid rgba(90,140,255,.85)", marginBottom: -1, borderRadius: 0 },
      scroll: { overflowX: "auto", overflowY: "hidden", width: "100%", maxWidth: "100%", minWidth: 0, border: "1px solid " + hair, borderRadius: 10 },
      tbl: { width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: fs(12) },
      th: { textAlign: "right", padding: "10px 14px", borderBottom: "1px solid " + hair, whiteSpace: "nowrap", opacity: 0.45, fontWeight: 500 },
      thFirst: { textAlign: "left", padding: "10px 14px", borderBottom: "1px solid " + hair, whiteSpace: "nowrap", opacity: 0.45, fontWeight: 500 },
      td: { textAlign: "right", padding: "10px 14px", borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
      tdFirst: { textAlign: "left", padding: "10px 14px", borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap" },
      tdWrap: { textAlign: "left", padding: "10px 14px", borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "normal", wordBreak: "break-word", minWidth: 120, maxWidth: 260 },
      tdTotal: { textAlign: "right", padding: "10px 14px", fontWeight: 600, borderTop: "1px solid " + hairStrong, fontVariantNumeric: "tabular-nums", background: fill },
      tdTotalFirst: { textAlign: "left", padding: "10px 14px", fontWeight: 600, borderTop: "1px solid " + hairStrong, background: fill },
      tdClick: { textAlign: "left", padding: "10px 14px", borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap", cursor: "pointer" },
      tdClickSel: { textAlign: "left", padding: "10px 14px", borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap", cursor: "pointer", fontWeight: 600 },
      tdGroup: { textAlign: "left", padding: "10px 14px", fontWeight: 600, background: fill, borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap" },
      tdGroupR: { textAlign: "right", padding: "10px 14px", fontWeight: 600, background: fill, borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
      badgeHit: { display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: fs(11), fontWeight: 500, background: "rgba(61,186,122,.14)", whiteSpace: "nowrap" },
      badgePeak: { display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: fs(11), fontWeight: 500, background: "rgba(212,137,42,.14)", whiteSpace: "nowrap" },
      badgeValley: { display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: fs(11), fontWeight: 500, background: "rgba(90,140,255,.14)", whiteSpace: "nowrap" },
      costPeak: { whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
      costOff: { whiteSpace: "nowrap", opacity: 0.75, fontVariantNumeric: "tabular-nums" },
      err: { color: "#e36b6b", fontSize: fs(12) },
      empty: { fontSize: fs(13), opacity: 0.5, padding: "28px 8px", textAlign: "center" },
      note: { fontSize: fs(11), opacity: 0.45, lineHeight: 1.5 },
      errbox: { border: "1px solid rgba(227,107,107,.35)", background: "rgba(227,107,107,.08)", borderRadius: 10, padding: 14, fontSize: fs(12), lineHeight: 1.5 },
      errboxTitle: { fontWeight: 600, marginBottom: 4 },
      heroBox: { display: "flex", flexWrap: "wrap", gap: 20, alignItems: "stretch", border: "1px solid " + hair, borderRadius: 12, padding: "18px 20px", background: fill },
      heroMain: { flex: "1 1 220px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" },
      heroNum: { fontSize: fs(34), fontWeight: 650, letterSpacing: "-0.03em", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" },
      heroMeta: { fontSize: fs(12), opacity: 0.55, lineHeight: 1.5 },
      splitTrack: { display: "flex", height: 6, borderRadius: 99, overflow: "hidden", background: "rgba(128,128,128,.12)", marginTop: 8, maxWidth: 280 },
      metricGrid: { flex: "1 1 260px", minWidth: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px", alignContent: "center" },
      metricL: { fontSize: fs(11), opacity: 0.45, marginBottom: 4 },
      metricV: { fontSize: fs(15), fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" },
      wallet: { border: "1px solid " + hair, borderRadius: 12, padding: "22px 24px", background: fill, display: "flex", flexDirection: "column", gap: 8 },
      walletValue: { fontSize: fs(40), fontWeight: 650, letterSpacing: "-0.03em", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" },
      walletRow: { display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: fs(13), opacity: 0.7 },
      path: { fontSize: fs(11), opacity: 0.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
      ioBox: { display: "flex", flexDirection: "column", gap: 10, paddingTop: 4, borderTop: "1px solid " + hair },
      calBar: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
      calGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginTop: 4 },
      calWk: { textAlign: "center", fontSize: fs(11), opacity: 0.4, padding: "4px 0" },
      calCell: { border: "1px solid transparent", borderRadius: 10, padding: "8px 2px", textAlign: "center", fontSize: fs(12), cursor: "pointer", minHeight: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 },
      calCellBlank: { border: "1px solid transparent", padding: "8px 2px", minHeight: 48 },
      calCellOn: { outline: "2px solid rgba(90,140,255,.75)", outlineOffset: -2 },
      calCellVal: { fontSize: fs(11), opacity: 0.85, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
      legend: { display: "flex", alignItems: "center", gap: 6, fontSize: fs(11), opacity: 0.5, marginTop: 8, flexWrap: "wrap" },
      legendBar: { display: "inline-block", width: 88, height: 6, borderRadius: 4, background: "linear-gradient(90deg, rgba(128,128,128,.12), var(--dsw-alias-state-business-primary, #679efe))" },
      numInput: { border: "1px solid " + hairStrong, background: fill, borderRadius: 6, padding: "4px 6px", fontSize: fs(12), color: "inherit", width: 78, textAlign: "right" },
      selDayTitle: { fontSize: fs(13), fontWeight: 600 },
      priceGrid: { display: "flex", flexDirection: "column", gap: 12, width: "100%" },
      priceCard: { border: "1px solid " + hair, borderRadius: 12, padding: "16px 18px", background: fill, display: "flex", flexDirection: "column", gap: 10 },
      priceName: { fontSize: fs(14), fontWeight: 600, letterSpacing: "-0.01em" },
      thPeak: { textAlign: "right", padding: "10px 14px", borderBottom: "1px solid " + hair, whiteSpace: "nowrap", opacity: 0.75, fontWeight: 600 },
      tdPeak: { textAlign: "right", padding: "10px 14px", borderBottom: "1px solid rgba(128,128,128,.12)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontWeight: 600 }
    };

    // ── helpers ──
    var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
    var fmtInt = function (n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
    var fmtTime = function (ts) { var d = new Date(ts + 8 * 3600 * 1000); return pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate()) + " " + pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds()); };
    var fmtMoney = function (n) { if (!n) return "¥0.00"; if (n < 0.01) return "¥" + n.toFixed(4); return "¥" + n.toFixed(2); };
    var fmtCompact = function (n) {
      n = Math.round(n || 0);
      if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.0$/, "") + "M";
      if (n >= 10000) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
      return fmtInt(n);
    };
    var fmtPrice = function (n) { if (n == null || isNaN(n)) return "—"; return String(parseFloat(Number(n).toFixed(4))); };
    var modelLabel = function (mk) { if (mk === "deepseek-v4-flash") return "deepseek-v4-flash"; if (mk === "deepseek-v4-pro") return "deepseek-v4-pro"; return "未知模型"; };
    // 模型显示名：以请求参数里的真实模型名为准（非 DeepSeek 模型也如实显示），
    // 空模型名时退回已知档位名 / provider / 未知。
    var modelName = function (r) {
      var m = String((r && r.model) || "").trim();
      if (m) return m;
      var mv = r && r.modelKey;
      if (mv && mv !== "unknown") return modelLabel(mv);
      var p = String((r && r.provider) || "").trim();
      return p ? p : "未知模型";
    };
    // 模型分组键：真实模型名小写（用于把同名的记录归为一组展示）
    var modelGroupKey = function (r) {
      var m = String((r && r.model) || "").trim();
      if (m) return m.toLowerCase();
      var mv = r && r.modelKey;
      if (mv && mv !== "unknown") return mv;
      var p = String((r && r.provider) || "").trim();
      return p ? p.toLowerCase() : "unknown";
    };
    // API 服务商显示名 / 分组键
    var providerName = function (p) {
      var s = String(p == null ? "" : p).trim();
      return s || "未知服务商";
    };
    var providerGroupKey = function (p) {
      var s = String(p == null ? "" : p).trim();
      return s ? s.toLowerCase() : "unknown";
    };
    var finishLabel = function (f) { if (f === "stop") return "完成"; if (f === "tool-calls") return "工具调用"; if (f === "max-tokens") return "超长"; if (f === "error") return "错误"; return f || "—"; };
    var pct = function (a, b) { return b > 0 ? (a / b * 100).toFixed(1) + "%" : "—"; };
    var isPeakNow = function (ts) { var d = new Date(ts + 8 * 3600 * 1000); var t = d.getUTCHours() * 60 + d.getUTCMinutes(); return (t >= 9 * 60 && t < 12 * 60) || (t >= 14 * 60 && t < 18 * 60); };
    // 计费档位选择：auto 用 autoCost（按生效日期自动切换），base 用 baseCost，其余用 peakValleyCost
    // 计费档位显示文案
    var regimeLabel = function (regime) {
      if (regime === "auto") return "自动（生效前基础价 · 生效后峰谷价）";
      if (regime === "base") return "基础价格";
      return "峰谷价格";
    };
    var costHint = function (regime) {
      if (regime === "auto") return "自动";
      if (regime === "base") return "基础价格";
      return "峰谷价格";
    };
    var costOf = function (r, regime) {
      if (!r) return 0;
      if (regime === "base") return r.baseCost || 0;
      if (regime === "auto") return r.autoCost != null ? r.autoCost : (r.baseCost || 0);
      return r.peakValleyCost || 0;
    };
    // 一组记录的消耗按高峰/空闲时段拆分（regime 决定用哪个档位的 cost）
    var splitTotals = function (list, regime) {
      var peak = 0, off = 0;
      for (var i = 0; i < list.length; i++) {
        var c = costOf(list[i], regime);
        if (list[i].peak) peak += c; else off += c;
      }
      return { peak: peak, off: off };
    };
    // 单日高峰/空闲消耗：优先取 host 汇总的 days 字段；缺失（旧 host）时用按记录算好的 fallback
    var daySplit = function (d, regime, fallback) {
      var peak, off;
      if (d) {
        if (regime === "base") { peak = d.basePeakCost; off = d.baseOffPeakCost; }
        else if (regime === "peakValley") { peak = d.pvPeakCost; off = d.pvOffPeakCost; }
        else { peak = d.autoPeakCost; off = d.autoOffPeakCost; }
        if (peak != null && off != null) return { peak: peak, off: off };
      }
      if (fallback) return fallback;
      return { peak: 0, off: 0 };
    };
    var bjKey = function (ts) { var d = new Date(ts + 8 * 3600 * 1000); return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate()); };
    var bjStartMs = function (key) { var p = String(key).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]) - 8 * 3600 * 1000; };
    var dayLabel = function (key) { var p = String(key).split("-"); return p[0] + "年" + (+p[1]) + "月" + (+p[2]) + "日"; };
    var monthDays = function (y, m) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); };
    var monthOffset = function (y, m) { var ms = bjStartMs(y + "-" + pad2(m + 1) + "-01"); var wd = new Date(ms).getUTCDay(); return (wd + 6) % 7; };
    var fmtBalance = function (s) {
      var str = String(s == null ? "0" : s);
      var num = parseFloat(str);
      if (isNaN(num)) return str;
      var parts = str.split(".");
      var dec = parts[1] ? parts[1].slice(0, 2) : "00";
      return fmtInt(parseInt(parts[0], 10)) + "." + (dec.length === 1 ? dec + "0" : dec);
    };
    var api = function (payload) {
      return fetch("/usage/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(function (r) { return r.json(); });
    };
    var PRICE_MODELS = ["deepseek-v4-flash", "deepseek-v4-pro"];

    // ── Card ──
    function Card(props) {
      return el("div", { style: st.card },
        el("div", { style: st.cardL }, props.label),
        el("div", { style: st.cardV }, props.value),
        props.hint ? el("div", { style: st.cardH }, props.hint) : null
      );
    }
    function Metric(props) {
      return el("div", null,
        el("div", { style: st.metricL }, props.label),
        el("div", { style: st.metricV }, props.value)
      );
    }

    // ── long-image report ──
    function drawReport(canvas, records) {
      records = records.slice();
      records.sort(function (a, b) { return b.time - a.time; }); // newest first
      var totalIn = records.length;
      if (records.length > 2000) records = records.slice(0, 2000); // canvas height guard
      var W = 1520, P = 40, count = records.length;
      var scale = count <= 200 ? 2 : 1;
      var rowH = count <= 200 ? 28 : count <= 800 ? 20 : 14;
      var fBase = count <= 200 ? 12 : count <= 800 ? 11 : 10;
      var headH = count <= 200 ? 26 : count <= 800 ? 20 : 16;

      var totalHit = 0, totalMiss = 0, totalWrite = 0, totalOut = 0, totalReason = 0, totalCost = 0, totalPeakCost = 0, totalOffCost = 0;
      for (var i = 0; i < count; i++) {
        var r = records[i];
        totalHit += r.cacheReadTokens || 0; totalMiss += r.inputTokens || 0; totalWrite += r.cacheWriteTokens || 0;
        totalOut += r.outputTokens || 0; totalReason += r.reasoningTokens || 0;
        var cst = r.peakValleyCost || 0;
        totalCost += cst;
        if (r.peak) totalPeakCost += cst; else totalOffCost += cst;
      }
      var hitRate = (totalHit + totalMiss + totalWrite) > 0 ? (totalHit / (totalHit + totalMiss + totalWrite) * 100).toFixed(1) + "%" : "—";
      var byModel = {}, byProvider = {}, byProviderModel = {};
      for (var i2 = 0; i2 < count; i2++) {
        var r2 = records[i2];
        var gk2 = modelGroupKey(r2);
        if (!byModel[gk2]) byModel[gk2] = { key: gk2, name: modelName(r2), calls: 0, hit: 0, miss: 0, out: 0, reason: 0, cost: 0, peakCost: 0, offCost: 0, peakCalls: 0, offCalls: 0 };
        var c2v = r2.peakValleyCost || 0;
        byModel[gk2].calls += 1; byModel[gk2].hit += r2.cacheReadTokens || 0; byModel[gk2].miss += r2.inputTokens || 0;
        byModel[gk2].out += r2.outputTokens || 0; byModel[gk2].reason += r2.reasoningTokens || 0; byModel[gk2].cost += c2v;
        var pk2 = providerGroupKey(r2.provider);
        if (!byProvider[pk2]) byProvider[pk2] = { key: pk2, name: providerName(r2.provider), calls: 0, cost: 0, peakCost: 0, offCost: 0, peakCalls: 0, offCalls: 0 };
        byProvider[pk2].calls += 1; byProvider[pk2].cost += c2v;
        var pmk2 = pk2 + "||" + gk2;
        if (!byProviderModel[pmk2]) byProviderModel[pmk2] = { key: pmk2, providerKey: pk2, providerName: providerName(r2.provider), modelKey: gk2, modelName: modelName(r2), calls: 0, cost: 0, peakCost: 0, offCost: 0, peakCalls: 0, offCalls: 0 };
        byProviderModel[pmk2].calls += 1; byProviderModel[pmk2].cost += c2v;
        if (r2.peak) {
          byModel[gk2].peakCost += c2v; byModel[gk2].peakCalls += 1;
          byProvider[pk2].peakCost += c2v; byProvider[pk2].peakCalls += 1;
          byProviderModel[pmk2].peakCost += c2v; byProviderModel[pmk2].peakCalls += 1;
        } else {
          byModel[gk2].offCost += c2v; byModel[gk2].offCalls += 1;
          byProvider[pk2].offCost += c2v; byProvider[pk2].offCalls += 1;
          byProviderModel[pmk2].offCost += c2v; byProviderModel[pmk2].offCalls += 1;
        }
      }
      var modelRows = [];
      for (var k in byModel) modelRows.push(byModel[k]);
      modelRows.sort(function (a, b) { return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });
      var providerRows = [];
      for (var kp in byProvider) providerRows.push(byProvider[kp]);
      providerRows.sort(function (a, b) { return b.cost - a.cost || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0); });
      var providerGroups = [];
      for (var pg = 0; pg < providerRows.length; pg++) {
        var gprov = providerRows[pg];
        var gmodels = [];
        for (var kgm in byProviderModel) {
          if (byProviderModel[kgm].providerKey === gprov.key) gmodels.push(byProviderModel[kgm]);
        }
        gmodels.sort(function (a, b) { return b.cost - a.cost || (a.modelKey < b.modelKey ? -1 : 1); });
        providerGroups.push({ provider: gprov, models: gmodels });
      }
      // 服务商×模型明细的总行数（组头 + 组内模型 + 合计行）
      var pmRowTotal = 1;
      for (var pgt = 0; pgt < providerGroups.length; pgt++) pmRowTotal += 1 + providerGroups[pgt].models.length;

      var H = 244 + headH + count * rowH + 24 + 18 + headH + (modelRows.length + 1) * rowH + 24 + 18 + headH + pmRowTotal * rowH + 26 + 44;
      if (H > 30000 && rowH > 12) { rowH = 12; fBase = 10; headH = 14; H = 244 + headH + count * rowH + 24 + 18 + headH + (modelRows.length + 1) * rowH + 24 + 18 + headH + pmRowTotal * rowH + 26 + 44; }
      canvas.width = W * scale;
      canvas.height = H * scale;
      var ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas 2d 不可用");
      ctx.scale(scale, scale);
      ctx.textBaseline = "alphabetic";
      var font = function (size, weight) { ctx.font = (weight || "400") + " " + size + 'px "Segoe UI","Microsoft YaHei",sans-serif'; };

      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#3a7bd5"; ctx.fillRect(0, 0, W, 64);
      ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; font(20, "700");
      ctx.fillText("用量与消耗报告", P, 40);
      ctx.fillStyle = "#7a8699"; font(13, "400");
      ctx.fillText("生成时间 " + fmtTime(Date.now()) + "（北京） · 共 " + count + " 条调用 · 缓存命中率 " + hitRate +
        " · 高峰价消耗 " + fmtMoney(totalPeakCost) + " · 空闲价消耗 " + fmtMoney(totalOffCost) + " · 合计 " + fmtMoney(totalCost) +
        (totalIn > count ? " · 报告仅含最近 " + count + " 条" : ""), P, 92);

      var cardW = (W - 2 * P - 6 * 10) / 7;
      var cards = [
        { l: "调用次数", v: fmtInt(count) }, { l: "输入 · 未命中", v: fmtInt(totalMiss) },
        { l: "输入 · 缓存命中", v: fmtInt(totalHit) }, { l: "输出", v: fmtInt(totalOut) },
        { l: "高峰消耗", v: fmtMoney(totalPeakCost) }, { l: "空闲消耗", v: fmtMoney(totalOffCost) },
        { l: "总消耗 (峰谷价)", v: fmtMoney(totalCost) }
      ];
      for (var c = 0; c < cards.length; c++) {
        var x = P + c * (cardW + 10);
        ctx.fillStyle = "#f5f7fa"; ctx.fillRect(x, 112, cardW, 70);
        ctx.strokeStyle = "#e4e8ee"; ctx.strokeRect(x, 112, cardW, 70);
        ctx.fillStyle = "#7a8699"; font(12, "400"); ctx.fillText(cards[c].l, x + 14, 138);
        ctx.fillStyle = "#1c2733"; font(19, "600"); ctx.fillText(cards[c].v, x + 14, 166);
      }

      var c1 = { time: P, model: P + 150, missR: P + 440, hitR: P + 540, writeR: P + 630, outR: P + 720, reasonR: P + 810, rateR: P + 900, periodR: P + 990, endR: P + 1080, costR: P + 1440 };
      var y = 226;
      ctx.fillStyle = "#1c2733"; font(15, "600"); ctx.fillText("缓存命中列表（共 " + count + " 条）", P, y);
      y = 244;
      ctx.fillStyle = "#eef1f5"; ctx.fillRect(P, y, W - 2 * P, headH);
      ctx.fillStyle = "#55617a"; font(fBase + 1, "600");
      var hty = y + Math.round(headH * 0.65);
      ctx.textAlign = "left"; ctx.fillText("时间(北京)", c1.time, hty); ctx.fillText("模型", c1.model, hty);
      ctx.textAlign = "right";
      ctx.fillText("输入·未命中", c1.missR, hty); ctx.fillText("缓存命中", c1.hitR, hty); ctx.fillText("缓存写入", c1.writeR, hty);
      ctx.fillText("输出", c1.outR, hty); ctx.fillText("推理", c1.reasonR, hty); ctx.fillText("命中率", c1.rateR, hty);
      ctx.fillText("时段", c1.periodR, hty); ctx.fillText("结束", c1.endR, hty); ctx.fillText("消耗(峰谷)", c1.costR, hty);
      y += headH;
      for (var r3 = 0; r3 < count; r3++) {
        var rec = records[r3];
        var hit = rec.cacheReadTokens || 0, miss = rec.inputTokens || 0, cost = rec.peakValleyCost || 0;
        ctx.fillStyle = r3 % 2 === 1 ? "#fafbfc" : "#ffffff"; ctx.fillRect(P, y, W - 2 * P, rowH);
        var ty = y + Math.round(rowH * 0.68);
        ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(fBase, "400");
        ctx.fillText(fmtTime(rec.time), c1.time, ty); ctx.fillText(modelName(rec), c1.model, ty);
        ctx.textAlign = "right";
        ctx.fillText(fmtInt(miss), c1.missR, ty);
        ctx.fillStyle = "#22a45d"; ctx.fillText(fmtInt(hit), c1.hitR, ty);
        ctx.fillStyle = "#1c2733";
        ctx.fillText(rec.cacheWriteTokens ? fmtInt(rec.cacheWriteTokens) : "—", c1.writeR, ty);
        ctx.fillText(fmtInt(rec.outputTokens || 0), c1.outR, ty);
        ctx.fillText(rec.reasoningTokens ? fmtInt(rec.reasoningTokens) : "—", c1.reasonR, ty);
        ctx.fillStyle = "#55617a"; ctx.fillText(pct(hit, hit + miss), c1.rateR, ty);
        ctx.fillStyle = rec.peak ? "#e08700" : "#3d6bd6"; ctx.fillText(rec.peak ? "峰" : "谷", c1.periodR, ty);
        ctx.fillStyle = "#55617a"; ctx.fillText(finishLabel(rec.finishReason), c1.endR, ty);
        ctx.fillStyle = rec.peak ? "#e08700" : "#3d6bd6"; ctx.fillText(fmtMoney(cost), c1.costR, ty);
        y += rowH;
      }

      y += 24;
      ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(15, "600");
      ctx.fillText("消耗表（按模型 · 峰谷价 · 高峰/空闲分列）", P, y);
      y += 18;
      var c2 = { model: P, callsR: P + 330, missR: P + 470, hitR: P + 590, outR: P + 710, reasonR: P + 840, peakR: P + 1010, offR: P + 1140, costR: P + 1440 };
      ctx.fillStyle = "#eef1f5"; ctx.fillRect(P, y, W - 2 * P, headH);
      ctx.fillStyle = "#55617a"; font(fBase + 1, "600");
      var hty2 = y + Math.round(headH * 0.65);
      ctx.textAlign = "left"; ctx.fillText("模型", c2.model, hty2);
      ctx.textAlign = "right";
      ctx.fillText("调用", c2.callsR, hty2); ctx.fillText("输入·未命中", c2.missR, hty2); ctx.fillText("缓存命中", c2.hitR, hty2);
      ctx.fillText("输出", c2.outR, hty2); ctx.fillText("推理", c2.reasonR, hty2);
      ctx.fillText("高峰消耗", c2.peakR, hty2); ctx.fillText("空闲消耗", c2.offR, hty2); ctx.fillText("总消耗", c2.costR, hty2);
      y += headH;
      var t2rows = modelRows.concat([{ key: "合计", name: "合计", calls: count, miss: totalMiss, hit: totalHit, out: totalOut, reason: totalReason, cost: totalCost, peakCost: totalPeakCost, offCost: totalOffCost }]);
      for (var m = 0; m < t2rows.length; m++) {
        var row = t2rows[m];
        var isTotal = row.key === "合计";
        ctx.fillStyle = isTotal ? "#eef1f5" : (m % 2 === 1 ? "#fafbfc" : "#ffffff"); ctx.fillRect(P, y, W - 2 * P, rowH);
        var ty2 = y + Math.round(rowH * 0.68);
        ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(fBase, isTotal ? "600" : "400");
        ctx.fillText(row.name || row.key, c2.model, ty2);
        ctx.textAlign = "right";
        ctx.fillText(fmtInt(row.calls), c2.callsR, ty2); ctx.fillText(fmtInt(row.miss), c2.missR, ty2);
        ctx.fillStyle = "#22a45d"; ctx.fillText(fmtInt(row.hit), c2.hitR, ty2);
        ctx.fillStyle = "#1c2733"; font(fBase, isTotal ? "600" : "400");
        ctx.fillText(fmtInt(row.out), c2.outR, ty2); ctx.fillText(row.reason ? fmtInt(row.reason) : "—", c2.reasonR, ty2);
        ctx.fillStyle = "#e08700"; ctx.fillText(fmtMoney(row.peakCost), c2.peakR, ty2);
        ctx.fillStyle = "#3d6bd6"; ctx.fillText(fmtMoney(row.offCost), c2.offR, ty2);
        ctx.fillStyle = "#1c2733"; ctx.fillText(fmtMoney(row.cost), c2.costR, ty2);
        y += rowH;
      }
      y += 24;
      ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(15, "600");
      ctx.fillText("消耗表（按 API 服务商 × 模型 · 峰谷价）", P, y);
      y += 18;
      ctx.fillStyle = "#eef1f5"; ctx.fillRect(P, y, W - 2 * P, headH);
      ctx.fillStyle = "#55617a"; font(fBase + 1, "600");
      var hty3 = y + Math.round(headH * 0.65);
      ctx.textAlign = "left"; ctx.fillText("API 服务商 / 模型", c2.model, hty3);
      ctx.textAlign = "right";
      ctx.fillText("调用", c2.callsR, hty3);
      ctx.fillText("高峰消耗", c2.peakR, hty3); ctx.fillText("空闲消耗", c2.offR, hty3); ctx.fillText("总消耗", c2.costR, hty3);
      y += headH;
      var p3n = 0;
      for (var p3g = 0; p3g < providerGroups.length; p3g++) {
        var pgrp = providerGroups[p3g];
        var gpr = pgrp.provider;
        ctx.fillStyle = "#e8edf5"; ctx.fillRect(P, y, W - 2 * P, rowH);
        var ty3 = y + Math.round(rowH * 0.68);
        ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(fBase, "600");
        ctx.fillText(gpr.name + "（" + pgrp.models.length + " 个模型）", c2.model, ty3);
        ctx.textAlign = "right"; ctx.fillStyle = "#1c2733"; font(fBase, "600");
        ctx.fillText(fmtInt(gpr.calls), c2.callsR, ty3);
        ctx.fillStyle = "#e08700"; ctx.fillText(fmtMoney(gpr.peakCost), c2.peakR, ty3);
        ctx.fillStyle = "#3d6bd6"; ctx.fillText(fmtMoney(gpr.offCost), c2.offR, ty3);
        ctx.fillStyle = "#1c2733"; ctx.fillText(fmtMoney(gpr.cost), c2.costR, ty3);
        y += rowH;
        for (var p3m = 0; p3m < pgrp.models.length; p3m++) {
          var pmd = pgrp.models[p3m];
          ctx.fillStyle = (p3n++ % 2 === 1) ? "#fafbfc" : "#ffffff"; ctx.fillRect(P, y, W - 2 * P, rowH);
          var ty4 = y + Math.round(rowH * 0.68);
          ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(fBase, "400");
          ctx.fillText("    " + pmd.modelName, c2.model, ty4);
          ctx.textAlign = "right"; ctx.fillStyle = "#1c2733"; font(fBase, "400");
          ctx.fillText(fmtInt(pmd.calls), c2.callsR, ty4);
          ctx.fillStyle = "#e08700"; ctx.fillText(fmtMoney(pmd.peakCost), c2.peakR, ty4);
          ctx.fillStyle = "#3d6bd6"; ctx.fillText(fmtMoney(pmd.offCost), c2.offR, ty4);
          ctx.fillStyle = "#1c2733"; ctx.fillText(fmtMoney(pmd.cost), c2.costR, ty4);
          y += rowH;
        }
      }
      ctx.fillStyle = "#eef1f5"; ctx.fillRect(P, y, W - 2 * P, rowH);
      var ty5 = y + Math.round(rowH * 0.68);
      ctx.textAlign = "left"; ctx.fillStyle = "#1c2733"; font(fBase, "600");
      ctx.fillText("总费用合计", c2.model, ty5);
      ctx.textAlign = "right"; ctx.fillStyle = "#1c2733"; font(fBase, "600");
      ctx.fillText(fmtInt(count), c2.callsR, ty5);
      ctx.fillStyle = "#e08700"; ctx.fillText(fmtMoney(totalPeakCost), c2.peakR, ty5);
      ctx.fillStyle = "#3d6bd6"; ctx.fillText(fmtMoney(totalOffCost), c2.offR, ty5);
      ctx.fillStyle = "#1c2733"; ctx.fillText(fmtMoney(totalCost), c2.costR, ty5);
      y += rowH;
      y += 26;
      ctx.textAlign = "left"; ctx.fillStyle = "#98a2b3"; font(11, "400");
      ctx.fillText("价格：统一按 DeepSeek 官方 API 价格计费 · 高峰时段（北京 9:00–12:00、14:00–18:00）· 单位：元 / 百万 tokens · 高峰/空闲消耗分列统计 · 由 dsh-plugin-dosage 生成", P, y);
    }

    // ── Overview view ──
    function OverviewView(props) {
      var records = props.records, regime = props.regime;
      var modeState = React.useState("model");
      var mode = modeState[0], setMode = modeState[1];
      var totalCalls = records.length;
      var totalHit = 0, totalMiss = 0, totalWrite = 0, totalOut = 0, totalCost = 0, peakTotal = 0, offTotal = 0, peakCalls = 0, offCalls = 0;
      var byModel = {}, byProvider = {}, byProviderModel = {};
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        totalHit += r.cacheReadTokens || 0; totalMiss += r.inputTokens || 0; totalWrite += r.cacheWriteTokens || 0;
        totalOut += r.outputTokens || 0;
        var cost = costOf(r, regime);
        totalCost += cost;
        var gk = modelGroupKey(r);
        if (!byModel[gk]) byModel[gk] = { key: gk, name: modelName(r), calls: 0, hit: 0, miss: 0, cost: 0, peakCost: 0, offCost: 0 };
        byModel[gk].calls += 1; byModel[gk].hit += r.cacheReadTokens || 0; byModel[gk].miss += r.inputTokens || 0; byModel[gk].cost += cost;
        var pk = providerGroupKey(r.provider);
        if (!byProvider[pk]) byProvider[pk] = { key: pk, name: providerName(r.provider), calls: 0, cost: 0, peakCost: 0, offCost: 0, hit: 0, miss: 0 };
        byProvider[pk].calls += 1; byProvider[pk].cost += cost;
        byProvider[pk].miss += r.inputTokens || 0; byProvider[pk].hit += r.cacheReadTokens || 0;
        var pmKey = pk + "||" + gk;
        if (!byProviderModel[pmKey]) byProviderModel[pmKey] = { key: pmKey, providerKey: pk, providerName: providerName(r.provider), modelKey: gk, modelName: modelName(r), calls: 0, cost: 0, peakCost: 0, offCost: 0, hit: 0, miss: 0 };
        byProviderModel[pmKey].calls += 1; byProviderModel[pmKey].cost += cost;
        byProviderModel[pmKey].miss += r.inputTokens || 0; byProviderModel[pmKey].hit += r.cacheReadTokens || 0;
        if (r.peak) {
          byModel[gk].peakCost += cost;
          byProvider[pk].peakCost += cost;
          byProviderModel[pmKey].peakCost += cost;
          peakTotal += cost; peakCalls += 1;
        } else {
          byModel[gk].offCost += cost;
          byProvider[pk].offCost += cost;
          byProviderModel[pmKey].offCost += cost;
          offTotal += cost; offCalls += 1;
        }
      }
      var hitRate = (totalHit + totalMiss + totalWrite) > 0 ? (totalHit / (totalHit + totalMiss + totalWrite) * 100).toFixed(1) + "%" : "—";
      var peakShare = totalCost > 0 ? Math.round(peakTotal / totalCost * 100) : 0;
      var modelRows = [];
      for (var k in byModel) modelRows.push(byModel[k]);
      modelRows.sort(function (a, b) { return b.cost - a.cost || (a.key < b.key ? -1 : 1); });
      var providerRows = [];
      for (var kp in byProvider) providerRows.push(byProvider[kp]);
      providerRows.sort(function (a, b) { return b.cost - a.cost || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0); });
      var providerGroups = [];
      for (var pg = 0; pg < providerRows.length; pg++) {
        var gprov = providerRows[pg];
        var models = [];
        for (var km in byProviderModel) {
          if (byProviderModel[km].providerKey === gprov.key) models.push(byProviderModel[km]);
        }
        models.sort(function (a, b) { return b.cost - a.cost || (a.modelKey < b.modelKey ? -1 : 1); });
        providerGroups.push({ provider: gprov, models: models });
      }
      var showProvider = mode === "provider" && providerRows.length > 1;
      var pmRows = [];
      for (var gi = 0; gi < providerGroups.length; gi++) {
        var g = providerGroups[gi];
        var gprov2 = g.provider;
        pmRows.push(el("tr", { key: "g-" + gprov2.key },
          el("td", { style: st.tdGroup, colSpan: 2 }, gprov2.name),
          el("td", { style: st.tdGroupR }, fmtInt(gprov2.calls)),
          el("td", { style: st.tdGroupR }, pct(gprov2.hit, gprov2.hit + gprov2.miss)),
          el("td", { style: st.tdGroupR }, fmtMoney(gprov2.peakCost)),
          el("td", { style: st.tdGroupR }, fmtMoney(gprov2.offCost)),
          el("td", { style: st.tdGroupR }, fmtMoney(gprov2.cost))
        ));
        for (var mi = 0; mi < g.models.length; mi++) {
          var md = g.models[mi];
          pmRows.push(el("tr", { key: "pm-" + md.key },
            el("td", { style: st.tdFirst }, ""),
            el("td", { style: st.tdWrap }, md.modelName),
            el("td", { style: st.td }, fmtInt(md.calls)),
            el("td", { style: st.td }, pct(md.hit, md.hit + md.miss)),
            el("td", { style: st.td }, fmtMoney(md.peakCost)),
            el("td", { style: st.td }, fmtMoney(md.offCost)),
            el("td", { style: st.td }, fmtMoney(md.cost))
          ));
        }
      }
      pmRows.push(el("tr", { key: "g-total" },
        el("td", { style: st.tdTotalFirst, colSpan: 2 }, "合计"),
        el("td", { style: st.tdTotal }, fmtInt(totalCalls)),
        el("td", { style: st.tdTotal }, hitRate),
        el("td", { style: st.tdTotal }, fmtMoney(peakTotal)),
        el("td", { style: st.tdTotal }, fmtMoney(offTotal)),
        el("td", { style: st.tdTotal }, fmtMoney(totalCost))
      ));

      if (!totalCalls) {
        return el("div", { style: st.empty }, "还没有用量记录。发一条消息后会显示在这里。");
      }

      return el("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
        el("div", { style: st.heroBox },
          el("div", { style: st.heroMain },
            el("div", { style: st.kicker }, "总消耗"),
            el("div", { style: st.heroNum }, fmtMoney(totalCost)),
            el("div", { style: st.heroMeta },
              "高峰 " + fmtMoney(peakTotal) + " · 空闲 " + fmtMoney(offTotal) + " · " + fmtInt(totalCalls) + " 次调用"
            ),
            el("div", { style: st.splitTrack, title: "高峰 " + peakShare + "%" },
              el("div", { style: { width: peakShare + "%", background: "rgba(212,137,42,.55)", minWidth: peakShare > 0 ? 2 : 0 } }),
              el("div", { style: { flex: 1, background: "rgba(90,140,255,.28)" } })
            )
          ),
          el("div", { style: st.metricGrid },
            el(Metric, { label: "缓存命中率", value: hitRate }),
            el(Metric, { label: "调用次数", value: fmtInt(totalCalls) }),
            el(Metric, { label: "缓存命中", value: fmtCompact(totalHit) }),
            el(Metric, { label: "输出 token", value: fmtCompact(totalOut) })
          )
        ),
        el("div", { style: st.sectionHead },
          el("div", { style: st.sec }, "消耗明细"),
          providerRows.length > 1
            ? el("div", { style: st.seg },
                el("button", { style: !showProvider ? st.segBtnOn : st.segBtn, onClick: function () { setMode("model"); } }, "按模型"),
                el("button", { style: showProvider ? st.segBtnOn : st.segBtn, onClick: function () { setMode("provider"); } }, "按服务商")
              )
            : el("div", { style: st.note }, providerRows.length === 1 ? providerRows[0].name : "")
        ),
        showProvider
          ? el("div", { style: st.scroll },
              el("table", { style: st.tbl },
                el("thead", null, el("tr", null,
                  el("th", { style: st.thFirst }, "服务商"), el("th", { style: st.thFirst }, "模型"),
                  el("th", { style: st.th }, "调用"), el("th", { style: st.th }, "命中率"),
                  el("th", { style: st.th }, "高峰"), el("th", { style: st.th }, "空闲"), el("th", { style: st.th }, "合计")
                )),
                el("tbody", null, pmRows)
              )
            )
          : el("div", { style: st.scroll },
              el("table", { style: st.tbl },
                el("thead", null, el("tr", null,
                  el("th", { style: st.thFirst }, "模型"), el("th", { style: st.th }, "调用"), el("th", { style: st.th }, "命中率"),
                  el("th", { style: st.th }, "高峰"), el("th", { style: st.th }, "空闲"), el("th", { style: st.th }, "合计")
                )),
                el("tbody", null,
                  modelRows.map(function (m) {
                    return el("tr", { key: m.key },
                      el("td", { style: st.tdWrap }, m.name),
                      el("td", { style: st.td }, fmtInt(m.calls)),
                      el("td", { style: st.td }, pct(m.hit, m.hit + m.miss)),
                      el("td", { style: st.td }, fmtMoney(m.peakCost)),
                      el("td", { style: st.td }, fmtMoney(m.offCost)),
                      el("td", { style: st.td }, fmtMoney(m.cost))
                    );
                  }),
                  el("tr", null,
                    el("td", { style: st.tdTotalFirst }, "合计"),
                    el("td", { style: st.tdTotal }, fmtInt(totalCalls)),
                    el("td", { style: st.tdTotal }, hitRate),
                    el("td", { style: st.tdTotal }, fmtMoney(peakTotal)),
                    el("td", { style: st.tdTotal }, fmtMoney(offTotal)),
                    el("td", { style: st.tdTotal }, fmtMoney(totalCost))
                  )
                )
              )
            ),
        el("div", { style: st.note }, "高峰 9:00–12:00、14:00–18:00（北京时间）· 按 DeepSeek 官方价 · 无官方价的模型记 ¥0")
      );
    }

    // ── Calendar view ──
    function CalendarView(props) {
      var records = props.records, regime = props.regime, days = props.days || [];
      var nowB = new Date(Date.now() + 8 * 3600 * 1000);
      var nowY = nowB.getUTCFullYear(), nowM = nowB.getUTCMonth();
      var ymState = React.useState({ y: nowY, m: nowM });
      var ym = ymState[0], setYm = ymState[1];
      var selState = React.useState(null);
      var selectedDay = selState[0], setSelectedDay = selState[1];
      var dimState = React.useState("cost");
      var dimMode = dimState[0], setDim = dimState[1];

      var y = ym.y, m = ym.m;
      var nDays = monthDays(y, m);
      var offset = monthOffset(y, m);
      var dayMap = {};
      for (var di = 0; di < days.length; di++) dayMap[days[di].day] = days[di];

      // 高峰/空闲消耗拆分：优先取 host 汇总的 days 字段，字段缺失时用记录回退计算
      var splitMap = {};
      for (var sr = 0; sr < records.length; sr++) {
        var rec0 = records[sr];
        var k0 = bjKey(rec0.time);
        var c0 = costOf(rec0, regime);
        if (!splitMap[k0]) splitMap[k0] = { peak: 0, off: 0 };
        if (rec0.peak) splitMap[k0].peak += c0; else splitMap[k0].off += c0;
      }

      function dayTokens(d) {
        if (!d) return 0;
        return (d.miss || 0) + (d.hit || 0) + (d.write || 0) + (d.out || 0) + (d.reason || 0);
      }
      function dayCost(d) { return costOf(d, regime); }
      function dayVal(d) {
        if (dimMode === "calls") return d ? d.calls : 0;
        if (dimMode === "tokens") return dayTokens(d);
        return dayCost(d);
      }
      function dayValLabel(d) {
        if (dimMode === "calls") return fmtInt(d.calls) + " 次";
        if (dimMode === "tokens") return fmtCompact(dayTokens(d));
        return fmtMoney(dayCost(d));
      }

      var maxV = 0, monthCalls = 0, monthMiss = 0, monthHit = 0, monthOut = 0, monthCost = 0, monthPeak = 0, monthOff = 0, monthPeakCalls = 0, monthOffCalls = 0;
      for (var d2 = 1; d2 <= nDays; d2++) {
        var key2 = y + "-" + pad2(m + 1) + "-" + pad2(d2);
        var r2 = dayMap[key2];
        var v2 = r2 ? dayVal(r2) : 0;
        if (v2 > maxV) maxV = v2;
        if (r2) {
          monthCalls += r2.calls; monthMiss += r2.miss; monthHit += r2.hit; monthOut += r2.out;
          monthPeakCalls += r2.peakCalls || 0; monthOffCalls += r2.offPeakCalls || 0;
          var ds2 = daySplit(r2, regime, splitMap[key2]);
          monthPeak += ds2.peak; monthOff += ds2.off;
        }
      }
      monthCost = monthPeak + monthOff;

      var weeks = ["一", "二", "三", "四", "五", "六", "日"];
      var cells = [];
      for (var b = 0; b < offset; b++) cells.push(el("div", { key: "b" + b, style: st.calCellBlank }, ""));
      for (var d3 = 1; d3 <= nDays; d3++) {
        var key3 = y + "-" + pad2(m + 1) + "-" + pad2(d3);
        var r3 = dayMap[key3];
        var v3 = r3 ? dayVal(r3) : 0;
        var inten = maxV > 0 ? v3 / maxV : 0;
        var hasVal = !!(r3 && v3 > 0);
        var bg = hasVal ? "color-mix(in srgb, var(--dsw-alias-state-business-primary, #679efe) " + Math.round(18 + 72 * inten) + "%, transparent)" : "transparent";
        var fg = hasVal && inten > 0.55 ? "#fff" : "inherit";
        var tip = r3
          ? (function () {
              var ds3 = daySplit(r3, regime, splitMap[key3]);
              return dayLabel(key3) + "\n调用 " + r3.calls + " 次（高峰 " + r3.peakCalls + " / 空闲 " + r3.offPeakCalls + "）\n输入·未命中 " + fmtInt(r3.miss) + " · 缓存命中 " + fmtInt(r3.hit) + " · 输出 " + fmtInt(r3.out) + " · 推理 " + fmtInt(r3.reason) + "\n高峰消耗 " + fmtMoney(ds3.peak) + " · 空闲消耗 " + fmtMoney(ds3.off) + " · 合计 " + fmtMoney(ds3.peak + ds3.off) + "（" + costHint(regime) + "）";
            })()
          : dayLabel(key3) + "\n无记录";
        var isSel = selectedDay === key3;
        cells.push(el("div", {
          key: key3,
          title: tip,
          onClick: (function (k) { return function () { setSelectedDay(selectedDay === k ? null : k); }; })(key3),
          style: Object.assign({ background: bg, color: fg, opacity: hasVal ? 1 : 0.42 }, st.calCell, isSel ? st.calCellOn : null)
        },
          el("div", null, String(d3)),
          hasVal ? el("div", { style: st.calCellVal }, dayValLabel(r3)) : null
        ));
      }

      // selected day detail (newest first)
      var selRecords = [];
      var selPeakCalls = 0, selOffCalls = 0, selPeakCost = 0, selOffCost = 0;
      if (selectedDay) {
        for (var si = 0; si < records.length; si++) {
          if (bjKey(records[si].time) === selectedDay) selRecords.push(records[si]);
        }
        selRecords.sort(function (a, b) { return b.time - a.time; });
        for (var sj = 0; sj < selRecords.length; sj++) {
          var srec = selRecords[sj];
          var scost = costOf(srec, regime);
          if (srec.peak) { selPeakCalls++; selPeakCost += scost; }
          else { selOffCalls++; selOffCost += scost; }
        }
      }

      // month daily stats (desc)
      var monthRows = [];
      for (var dd = 1; dd <= nDays; dd++) {
        var kd = y + "-" + pad2(m + 1) + "-" + pad2(dd);
        if (dayMap[kd]) monthRows.push(dayMap[kd]);
      }
      monthRows.sort(function (a, b) { return a.day < b.day ? 1 : a.day > b.day ? -1 : 0; });

      function prevMonth() { setYm({ y: m === 0 ? y - 1 : y, m: m === 0 ? 11 : m - 1 }); setSelectedDay(null); }
      function nextMonth() { setYm({ y: m === 11 ? y + 1 : y, m: m === 11 ? 0 : m + 1 }); setSelectedDay(null); }
      function goToday() { setYm({ y: nowY, m: nowM }); setSelectedDay(bjKey(Date.now())); }

      return el("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
        el("div", { style: st.heroBox },
          el("div", { style: st.heroMain },
            el("div", { style: st.kicker }, y + "年" + (m + 1) + "月消耗"),
            el("div", { style: st.heroNum }, fmtMoney(monthCost)),
            el("div", { style: st.heroMeta }, "高峰 " + fmtMoney(monthPeak) + " · 空闲 " + fmtMoney(monthOff) + " · " + fmtInt(monthCalls) + " 次")
          ),
          el("div", { style: st.metricGrid },
            el(Metric, { label: "缓存命中", value: fmtCompact(monthHit) }),
            el(Metric, { label: "未命中", value: fmtCompact(monthMiss) }),
            el(Metric, { label: "输出", value: fmtCompact(monthOut) }),
            el(Metric, { label: "高峰 / 空闲", value: fmtInt(monthPeakCalls) + " / " + fmtInt(monthOffCalls) })
          )
        ),
        el("div", { style: st.calBar },
          el("button", { style: st.btn, onClick: prevMonth }, "‹ 上月"),
          el("span", { style: { fontSize: fs(14), fontWeight: 600, minWidth: 88, textAlign: "center" } }, y + "年" + (m + 1) + "月"),
          el("button", { style: st.btn, onClick: nextMonth }, "下月 ›"),
          el("button", { style: st.btnGhost, onClick: goToday }, "今天"),
          el("div", { style: st.seg },
            el("button", { style: dimMode === "cost" ? st.segBtnOn : st.segBtn, onClick: function () { setDim("cost"); } }, "按消耗"),
            el("button", { style: dimMode === "calls" ? st.segBtnOn : st.segBtn, onClick: function () { setDim("calls"); } }, "按次数"),
            el("button", { style: dimMode === "tokens" ? st.segBtnOn : st.segBtn, onClick: function () { setDim("tokens"); } }, "按 Token")
          )
        ),
        el("div", { style: st.calGrid },
          weeks.map(function (w) { return el("div", { key: w, style: st.calWk }, w); }),
          cells
        ),
        el("div", { style: st.legend },
          el("span", { style: st.legendBar }),
          el("span", null, "点击日期查看当天调用")
        ),
        monthRows.length > 1
          ? el("div", { style: st.scroll },
              el("table", { style: st.tbl },
                el("thead", null, el("tr", null,
                  el("th", { style: st.thFirst }, "日期"), el("th", { style: st.th }, "调用"),
                  el("th", { style: st.th }, "高峰"), el("th", { style: st.th }, "空闲"), el("th", { style: st.th }, "合计")
                )),
                el("tbody", null, monthRows.map(function (drow) {
                  var sel = selectedDay === drow.day;
                  var ds4 = daySplit(drow, regime, splitMap[drow.day]);
                  return el("tr", { key: drow.day },
                    el("td", { style: sel ? st.tdClickSel : st.tdClick, onClick: (function (k) { return function () { setSelectedDay(selectedDay === k ? null : k); }; })(drow.day) }, dayLabel(drow.day)),
                    el("td", { style: st.td }, fmtInt(drow.calls)),
                    el("td", { style: st.td }, fmtMoney(ds4.peak)),
                    el("td", { style: st.td }, fmtMoney(ds4.off)),
                    el("td", { style: st.td }, fmtMoney(ds4.peak + ds4.off))
                  );
                }))
              )
            )
          : null,
        selectedDay
          ? el("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
              el("div", { style: st.selDayTitle }, dayLabel(selectedDay)),
              el("div", { style: st.note },
                selPeakCalls + " 次高峰 " + fmtMoney(selPeakCost) + " · " +
                selOffCalls + " 次空闲 " + fmtMoney(selOffCost)
              ),
              selRecords.length === 0
                ? el("div", { style: st.empty }, "该日无记录。")
                : el("div", { style: st.scroll },
                    el("table", { style: st.tbl },
                      el("thead", null, el("tr", null,
                        el("th", { style: st.thFirst }, "时间"), el("th", { style: st.thFirst }, "模型"),
                        el("th", { style: st.th }, "命中率"), el("th", { style: st.th }, "结束"), el("th", { style: st.th }, "消耗")
                      )),
                      el("tbody", null, selRecords.map(function (rr) {
                        var hit2 = rr.cacheReadTokens || 0, miss2 = rr.inputTokens || 0;
                        var cost2 = costOf(rr, regime);
                        return el("tr", { key: rr.time, title: "未命中 " + fmtInt(miss2) + " · 命中 " + fmtInt(hit2) + " · 输出 " + fmtInt(rr.outputTokens || 0) },
                          el("td", { style: st.tdFirst }, fmtTime(rr.time)),
                          el("td", { style: st.tdWrap }, modelName(rr)),
                          el("td", { style: st.td }, pct(hit2, hit2 + miss2)),
                          el("td", { style: st.td }, finishLabel(rr.finishReason)),
                          el("td", { style: st.td }, fmtMoney(cost2))
                        );
                      }))
                    )
                  )
            )
          : null
      );
    }

    // ── Cache hit list view (newest first + time filters) ──
    function CacheListView(props) {
      var records = props.records, regime = props.regime;
      var presetState = React.useState("all");
      var preset = presetState[0], setPreset = presetState[1];
      var fromState = React.useState("");
      var fromDate = fromState[0], setFromDate = fromState[1];
      var toState = React.useState("");
      var toDate = toState[0], setToDate = toState[1];
      var pageState = React.useState(1);
      var page = pageState[0], setPage = pageState[1];

      var nowKey = bjKey(Date.now());
      var fromMs = null, toMs = null;
      if (preset === "today") { fromMs = bjStartMs(nowKey); toMs = Date.now(); }
      else if (preset === "7d") { fromMs = bjStartMs(nowKey) - 6 * 86400000; toMs = Date.now(); }
      else if (preset === "30d") { fromMs = bjStartMs(nowKey) - 29 * 86400000; toMs = Date.now(); }
      else if (preset === "custom") {
        if (fromDate) fromMs = bjStartMs(fromDate);
        if (toDate) toMs = bjStartMs(toDate) + 86400000 - 1;
      }

      var filtered = [];
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (fromMs != null && r.time < fromMs) continue;
        if (toMs != null && r.time > toMs) continue;
        filtered.push(r);
      }
      filtered.sort(function (a, b) { return b.time - a.time; }); // newest first

      var sumHit = 0, sumMiss = 0, sumOut = 0, sumCost = 0, sumWrite = 0, sumReason = 0;
      for (var s = 0; s < filtered.length; s++) {
        var rr2 = filtered[s];
        sumHit += rr2.cacheReadTokens || 0; sumMiss += rr2.inputTokens || 0; sumOut += rr2.outputTokens || 0;
        sumWrite += rr2.cacheWriteTokens || 0; sumReason += rr2.reasoningTokens || 0;
        sumCost += costOf(rr2, regime);
      }

      // 分页渲染：只渲染当前页，避免上千行 DOM 导致卡顿
      var PAGE_SIZE = 100;
      var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      var curPage = Math.min(Math.max(1, page), totalPages);
      var pageRows = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

      function setCustomFrom(v) { setFromDate(v); setPreset("custom"); setPage(1); }
      function setCustomTo(v) { setToDate(v); setPreset("custom"); setPage(1); }
      function presetBtn(k, label) {
        return el("button", { style: preset === k ? st.segBtnOn : st.segBtn, onClick: function () { setPreset(k); setPage(1); } }, label);
      }
      function pageBtn(kind, label, disabled, onClick) {
        return el("button", { style: disabled ? st.btnDisabled : st.btn, onClick: onClick }, label);
      }
      var sums = splitTotals(filtered, regime);
      var hitRate = pct(sumHit, sumHit + sumMiss);

      return el("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
        el("div", { style: st.heroBox },
          el("div", { style: st.heroMain },
            el("div", { style: st.kicker }, "区间消耗"),
            el("div", { style: st.heroNum }, fmtMoney(sumCost)),
            el("div", { style: st.heroMeta },
              "高峰 " + fmtMoney(sums.peak) + " · 空闲 " + fmtMoney(sums.off) + " · " + fmtInt(filtered.length) + " 条"
            )
          ),
          el("div", { style: st.metricGrid },
            el(Metric, { label: "命中率", value: hitRate }),
            el(Metric, { label: "缓存命中", value: fmtCompact(sumHit) }),
            el(Metric, { label: "未命中", value: fmtCompact(sumMiss) }),
            el(Metric, { label: "输出", value: fmtCompact(sumOut) })
          )
        ),
        el("div", { style: st.calBar },
          el("div", { style: st.seg },
            presetBtn("today", "今天"), presetBtn("7d", "7天"), presetBtn("30d", "30天"), presetBtn("all", "全部"), presetBtn("custom", "自定义")
          ),
          preset === "custom"
            ? el("div", { style: st.calBar },
                el("input", { type: "date", style: st.dateInput, value: fromDate, onChange: function (e) { setCustomFrom(e.target.value); } }),
                el("span", { style: st.note }, "至"),
                el("input", { type: "date", style: st.dateInput, value: toDate, onChange: function (e) { setCustomTo(e.target.value); } }),
                (fromDate || toDate) ? el("button", { style: st.btnGhost, onClick: function () { setFromDate(""); setToDate(""); setPreset("all"); setPage(1); } }, "清除") : null
              )
            : null,
          totalPages > 1
            ? el("span", { style: Object.assign({}, st.note, { marginLeft: "auto" }) }, "第 " + curPage + " / " + totalPages + " 页")
            : null
        ),
        filtered.length === 0
          ? el("div", { style: st.empty }, "该时间范围内没有记录。")
          : el("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              el("div", { style: st.scroll },
                el("table", { style: st.tbl },
                  el("thead", null, el("tr", null,
                    el("th", { style: st.thFirst }, "时间"), el("th", { style: st.thFirst }, "模型"),
                    el("th", { style: st.th }, "命中率"), el("th", { style: st.th }, "结束"), el("th", { style: st.th }, "消耗")
                  )),
                  el("tbody", null,
                    pageRows.map(function (rr3, idx) {
                      var hit3 = rr3.cacheReadTokens || 0, miss3 = rr3.inputTokens || 0;
                      var cost3 = costOf(rr3, regime);
                      return el("tr", {
                        key: rr3.time + "-" + idx,
                        title: (rr3.peak ? "高峰" : "空闲") + " · 未命中 " + fmtInt(miss3) + " · 命中 " + fmtInt(hit3) + " · 输出 " + fmtInt(rr3.outputTokens || 0)
                      },
                        el("td", { style: st.tdFirst }, fmtTime(rr3.time)),
                        el("td", { style: st.tdWrap },
                          el("div", null, modelName(rr3)),
                          el("div", { style: st.sub }, (rr3.provider || "") + (rr3.peak ? " · 高峰" : " · 空闲"))
                        ),
                        el("td", { style: st.td }, pct(hit3, hit3 + miss3)),
                        el("td", { style: st.td }, finishLabel(rr3.finishReason)),
                        el("td", { style: st.td }, fmtMoney(cost3))
                      );
                    }),
                    el("tr", null,
                      el("td", { style: st.tdTotalFirst }, "合计"),
                      el("td", { style: st.tdTotal }, fmtInt(filtered.length) + " 条"),
                      el("td", { style: st.tdTotal }, hitRate),
                      el("td", { style: st.tdTotal }, ""),
                      el("td", { style: st.tdTotal }, fmtMoney(sumCost))
                    )
                  )
                )
              ),
              totalPages > 1
                ? el("div", { style: st.calBar },
                    pageBtn("prev", "‹ 上一页", curPage <= 1, function () { setPage(curPage - 1); }),
                    pageBtn("next", "下一页 ›", curPage >= totalPages, function () { setPage(curPage + 1); })
                  )
                : null
            )
      );
    }

    // ── Price table view ──
    // 价格表按官方固定，不可编辑。顶部可切换查看「自动 / 峰谷价 / 基础价」三档；
    // 自动档展示当前生效价格（生效前=基础价，生效后=峰谷价）。
    function PriceView(props) {
      var pricing = props.pricing || { base: {}, peakValley: {} };
      var effectiveAt = props.effectiveAt || 0;
      var regimeState = React.useState("auto");
      var regime = regimeState[0], setRegime = regimeState[1];
      var effectiveIn = function () {
        if (!effectiveAt) return "新价格表生效时间未知";
        var now = Date.now();
        return now < effectiveAt ? "峰谷价将于 " + fmtTime(effectiveAt) + "（北京时间）生效，此前按基础价计费" : "峰谷价已于 " + fmtTime(effectiveAt) + " 生效";
      };
      var showRegime = function (r) {
        if (r === "auto") return Date.now() < effectiveAt ? "base" : "peakValley";
        return r;
      };
      // auto 档：显示当前生效的价格表（生效前=基础价 base，生效后=峰谷价 peakValley）
      var table = pricing && pricing[showRegime(regime)] || {};
      var cell = function (mk, a, b) {
        var row = table && table[mk];
        if (!row) return "—";
        if (showRegime(regime) === "base") return fmtPrice(row[a]);
        var sub = row[a];
        return sub ? fmtPrice(sub[b]) : "—";
      };
      var rows = PRICE_MODELS.map(function (mk) {
        if (showRegime(regime) === "base") {
          return el("div", { key: mk, style: st.priceCard },
            el("div", { style: st.priceName }, modelLabel(mk)),
            el("div", { style: st.note }, "元 / 百万 tokens"),
            el("table", { style: st.tbl },
                el("thead", null, el("tr", null,
                  el("th", { style: st.thFirst }, "项目"),
                  el("th", { style: st.th }, "单价")
                )),
                el("tbody", null,
                  el("tr", null, el("td", { style: st.tdFirst }, "缓存命中"), el("td", { style: st.td }, cell(mk, "cacheHit"))),
                  el("tr", null, el("td", { style: st.tdFirst }, "输入"), el("td", { style: st.td }, cell(mk, "cacheMiss"))),
                  el("tr", null, el("td", { style: st.tdFirst }, "输出"), el("td", { style: st.td }, cell(mk, "output")))
                )
              )
          );
        }
        return el("div", { key: mk, style: st.priceCard },
          el("div", { style: st.priceName }, modelLabel(mk)),
          el("div", { style: st.note }, "元 / 百万 tokens"),
          el("table", { style: st.tbl },
            el("thead", null, el("tr", null,
              el("th", { style: st.thFirst }, "项目"),
              el("th", { style: st.th }, "空闲"),
              el("th", { style: st.thPeak }, "高峰")
            )),
            el("tbody", null,
              el("tr", null, el("td", { style: st.tdFirst }, "缓存命中"), el("td", { style: st.td }, cell(mk, "offPeak", "cacheHit")), el("td", { style: st.tdPeak }, cell(mk, "peak", "cacheHit"))),
              el("tr", null, el("td", { style: st.tdFirst }, "输入"), el("td", { style: st.td }, cell(mk, "offPeak", "cacheMiss")), el("td", { style: st.tdPeak }, cell(mk, "peak", "cacheMiss"))),
              el("tr", null, el("td", { style: st.tdFirst }, "输出"), el("td", { style: st.td }, cell(mk, "offPeak", "output")), el("td", { style: st.tdPeak }, cell(mk, "peak", "output")))
            )
          )
        );
      });

      return el("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
        el("div", { style: st.sectionHead },
          el("div", { style: st.sec }, "官方价格"),
          el("div", { style: st.seg },
            el("button", { style: regime === "auto" ? st.segBtnOn : st.segBtn, onClick: function () { setRegime("auto"); } }, "当前"),
            el("button", { style: regime === "peakValley" ? st.segBtnOn : st.segBtn, onClick: function () { setRegime("peakValley"); } }, "峰谷"),
            el("button", { style: regime === "base" ? st.segBtnOn : st.segBtn, onClick: function () { setRegime("base"); } }, "基础")
          )
        ),
        el("div", { style: st.note }, effectiveIn()),
        el("div", { style: st.priceGrid }, rows),
        el("div", { style: st.note }, "高峰 9:00–12:00、14:00–18:00（北京时间）· 其它模型没有官方价，记 ¥0")
      );
    }
    // ── Usage panel ──
    var SUBTABS = [
      { k: "overview", t: "概览" },
      { k: "calendar", t: "用量" },
      { k: "cache", t: "调用记录" },
      { k: "prices", t: "价格" }
    ];

    function UsagePanel(props) {
      var state = React.useState({ records: [], count: 0, dataPath: "", persistOk: false, persistError: "", pricing: null, days: [] });
      var data = state[0], setData = state[1];
      var controlled = props.tab != null;
      var tabState = React.useState(controlled ? props.tab : "overview");
      var tab = controlled ? props.tab : tabState[0], setTab = tabState[1];
      var errState = React.useState("");
      var error = errState[0], setError = errState[1];
      var expState = React.useState("");
      var exportMsg = expState[0], setExportMsg = expState[1];
      var impState = React.useState("");
      var importMsg = impState[0], setImportMsg = impState[1];
      var destState = React.useState("");
      var destDir = destState[0], setDestDir = destState[1];
      var ioState = React.useState(false);
      var ioOpen = ioState[0], setIoOpen = ioState[1];
      var canvasNode = null, fileInputNode = null;
      var timer = props.timer;

      function refresh() {
        api({ action: "list" }).then(function (res) {
          setData(res || { records: [], count: 0, dataPath: "", persistOk: false, persistError: "", pricing: null, days: [] });
          setError("");
        }).catch(function (e) { setError(String((e && e.message) || e)); });
      }

      React.useEffect(function () {
        refresh();
        // 每 10 秒自动刷新（列表已分页渲染，避免 3 秒全量重取 + 全量重渲染导致的卡顿）
        if (timer && timer.interval) return timer.interval(refresh, 10000);
        return undefined;
      }, []);

      function showExport(res) {
        if (res && res.ok) {
          setExportMsg("已导出：" + res.path);
          if (res.dir) api({ action: "reveal", dir: res.dir }).catch(function () {});
        } else {
          setExportMsg("导出失败：" + ((res && res.error) || "未知错误"));
        }
      }

      function doExport(kind) {
        setExportMsg("导出中…");
        api({ action: "export", kind: kind, dir: destDir || undefined }).then(showExport).catch(function (e) { setExportMsg("导出失败：" + String((e && e.message) || e)); });
      }

      function doExportImage() {
        setExportMsg("生成图片中…");
        if (!canvasNode) { setExportMsg("画布不可用"); return; }
        try {
          drawReport(canvasNode, (data.records || []).slice());
          var dataUrl = canvasNode.toDataURL("image/png");
          api({ action: "exportPng", dataUrl: dataUrl, dir: destDir || undefined }).then(showExport).catch(function (e) { setExportMsg("导出失败：" + String((e && e.message) || e)); });
        } catch (e) {
          setExportMsg("生成图片失败：" + String((e && e.message) || e));
        }
      }

      function pickDestDir() {
        setExportMsg("打开目录选择…");
        api({ action: "pickDir" }).then(function (res) {
          if (res && res.ok) { setDestDir(res.path); setExportMsg("导出目标：" + res.path); }
          else if (res && res.cancelled) { setExportMsg(""); }
          else { setExportMsg("选择目录失败：" + ((res && res.error) || "")); }
        }).catch(function (e) { setExportMsg("选择目录失败：" + String((e && e.message) || e)); });
      }

      function doReveal() {
        api({ action: "reveal", dir: destDir || "data" }).then(function (res) {
          if (!res || !res.ok) setExportMsg("打开文件夹失败：" + ((res && res.error) || ""));
        }).catch(function (e) { setExportMsg("打开文件夹失败：" + String((e && e.message) || e)); });
      }

      function doClear() {
        if (typeof window !== "undefined" && window.confirm && !window.confirm("确定清空全部用量记录？此操作不可撤销。")) return;
        api({ action: "clear" }).then(refresh).catch(function (e) { setError(String((e && e.message) || e)); });
      }

      function pickFile() { if (fileInputNode) fileInputNode.click(); }

      function onFileChange(e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        setImportMsg("读取文件…");
        var readPromise = typeof f.text === "function"
          ? f.text()
          : new Promise(function (resolve, reject) { var r = new FileReader(); r.onload = function () { resolve(r.result); }; r.onerror = reject; r.readAsText(f); });
        readPromise.then(function (content) {
          try { e.target.value = ""; } catch (err) {}
          api({ action: "import", content: String(content), filename: f.name }).then(function (res) {
            if (res && res.ok) {
              setImportMsg("导入成功：新增 " + res.imported + " 条，跳过重复 " + res.skipped + " 条，忽略无效 " + res.invalid + " 条，现有共 " + res.total + " 条");
              refresh();
            } else {
              setImportMsg("导入失败：" + ((res && res.error) || "未知错误"));
            }
          }).catch(function (err) { setImportMsg("导入失败：" + String((err && err.message) || err)); });
        }).catch(function () { setImportMsg("读取文件失败"); });
      }

      var records = data.records || [];
      var dataPath = data.dataPath || "";
      var nowPeak = isPeakNow(Date.now());
      return el("div", { style: props.hideSubtabs ? Object.assign({}, st.root, { gap: 12, padding: "4px 0 8px" }) : st.root },
        el("canvas", { ref: function (n) { canvasNode = n; }, style: { display: "none" } }),
        el("div", { style: props.hideSubtabs ? Object.assign({}, st.subtabBar, { justifyContent: "flex-end" }) : st.subtabBar },
          props.hideSubtabs
            ? null
            : el("div", { style: st.subtabs },
            SUBTABS.map(function (t) {
              return el("button", {
                key: t.k,
                style: tab === t.k ? st.subtabOn : st.subtab,
                onClick: function () { setTab(t.k); }
              }, t.t);
            })
          ),
          el("div", { style: st.actions },
            el("span", { style: nowPeak ? st.badgePeak : st.badgeValley }, nowPeak ? "高峰时段" : "空闲时段"),
            el("button", { style: st.btnGhost, onClick: refresh }, "刷新"),
            el("button", { style: st.btnGhost, onClick: doClear }, "清空")
          )
        ),
        tab === "overview" ? el(OverviewView, { records: records, regime: "auto" }) : null,
        tab === "calendar" ? el(CalendarView, { records: records, regime: "auto", days: data.days || [] }) : null,
        tab === "cache" ? el(CacheListView, { records: records, regime: "auto" }) : null,
        tab === "prices" ? el(PriceView, { pricing: data.pricing, effectiveAt: data.effectiveAt, onChanged: refresh }) : null,
        el("div", { style: st.ioBox },
          el("div", { style: st.actions },
            el("button", { style: st.btn, onClick: function () { doExport("csv"); } }, "导出 CSV"),
            el("button", { style: st.btn, onClick: function () { doExport("json"); } }, "导出 JSON"),
            el("button", { style: st.btn, onClick: doExportImage }, "导出 PNG"),
            el("input", { type: "file", accept: ".json,.csv", style: { display: "none" }, ref: function (n) { fileInputNode = n; }, onChange: onFileChange }),
            el("button", { style: st.btn, onClick: pickFile }, "导入"),
            el("button", { style: st.btnGhost, onClick: function () { setIoOpen(!ioOpen); } }, ioOpen ? "收起目录" : "导出目录…"),
            el("button", { style: st.btnGhost, onClick: doReveal }, "打开目录")
          ),
          ioOpen
            ? el("div", { style: st.actions },
                el("input", { style: st.input, placeholder: "留空则写入 ~/.dsh/dsh-usage", value: destDir, onChange: function (e) { setDestDir(e.target.value); } }),
                el("button", { style: st.btn, onClick: pickDestDir }, "选择…"),
                destDir ? el("button", { style: st.btnGhost, onClick: function () { setDestDir(""); setExportMsg("已恢复默认目录"); } }, "重置") : null
              )
            : null,
          exportMsg ? el("div", { style: st.sub }, exportMsg) : null,
          importMsg ? el("div", { style: st.sub }, importMsg) : null,
          error ? el("div", { style: st.err }, error) : null,
          dataPath
            ? el("div", { style: st.path, title: dataPath }, dataPath)
            : el("div", { style: st.err }, "持久化未启用：" + (data.persistError || "未知原因"))
        )
      );
    }

    // ── Sidebar usage/balance panel (vendored from dsh-usage-stats, MIT) ──
        let react = require("react");
        let react_jsx_runtime = require("react/jsx-runtime");
        let primitives = require("@deepseek-ai/dsh-client-ui-primitives");

        //#region css
        const css = [
            ".usg_layer{flex:none;align-items:center;width:100%;height:49px;margin:8px 0 0;display:flex;position:relative}",
            ".usg_footerButtons{align-items:center;width:100%;display:flex}",
            ".usg_badge{width:100%;height:49px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:10px;padding:0 8px 0 6px;font-family:inherit;font-size:16px;display:inline-flex;overflow:hidden}",
            ".usg_badge:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}",
            ".usg_badge[data-active]{background:var(--dsw-alias-interactive-bg-hover)}",
            ".usg_badgeLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}",
            ".usg_badgeCount{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;flex:none;margin-left:auto;font-size:14px;line-height:20px}",
            ".usg_layer.usg_rail{width:36px;height:36px;margin:0}",
            ".usg_layer.usg_rail .usg_badge{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;padding:0}",
            ".usg_layer.usg_rail .usg_footerButtons{flex-direction:column;gap:2px}",
            ".usg_panel{z-index:30;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-button-floating-fill,var(--dsw-alias-bg-layer-2,var(--dsw-alias-bg-base)));color:var(--dsw-alias-label-primary);isolation:isolate;width:640px;max-width:calc(100vw - 24px);height:var(--usg-lock-h,auto);max-height:80vh;transform:scale(calc(6 / 7));transform-origin:bottom left;box-shadow:var(--dsw-shadow-lv2);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);--usg-blue:var(--dsw-alias-state-business-primary,#679efe);--usg-cellEmpty:var(--dsw-alias-fill-l2,rgba(128,128,128,0.16));border-radius:12px;flex-direction:column;display:flex;position:fixed;bottom:128px;left:12px;overflow:hidden}",
            ".usg_header{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l2);background:transparent;flex:none;justify-content:space-between;align-items:center;min-height:44px;padding:10px 12px;display:flex}",
            ".usg_headerLeft{align-items:center;gap:8px;display:flex}",
            ".usg_title{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:500;line-height:24px}",
            ".usg_headerActions{align-items:center;gap:2px;display:flex}",
            ".usg_iconButton{cursor:pointer;width:26px;height:26px;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;display:inline-flex}",
            ".usg_iconButton:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}",
            ".usg_body{flex:1;min-height:0;padding:4px 14px 14px;overflow-y:auto;overflow-x:hidden}",
            ".usg_measure{position:absolute;left:0;top:0;width:100%;visibility:hidden;pointer-events:none;padding:4px 14px 14px;box-sizing:border-box;z-index:-1}",
            ".usg_tabs{display:flex;flex-wrap:nowrap;gap:0;flex:none;padding:0 8px;border-bottom:1px solid var(--dsw-alias-border-l2);overflow-x:auto}",
            ".usg_tab{border:0;background:transparent;padding:8px 12px;font-size:14px;line-height:22px;cursor:pointer;color:var(--dsw-alias-label-primary);opacity:.5;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:inherit;flex:none;white-space:nowrap}",
            ".usg_tabOn{opacity:1;font-weight:600;border-bottom-color:var(--usg-blue)}",
            ".usg_section{margin-top:12px}",
            ".usg_sectionTitle{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;margin:0 0 6px}",
            ".usg_note{color:var(--dsw-alias-label-tertiary);margin:4px 0;font-size:14px;line-height:22px}",
            ".usg_error{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:8px;justify-content:space-between;align-items:flex-start;gap:8px;margin:4px 0;padding:7px 8px;font-size:14px;line-height:22px;display:flex}",
            ".usg_retry{color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;flex:none;padding:0}",
            ".usg_balanceCard{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-fill-l1, transparent);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:6px}",
            ".usg_balanceMain{align-items:baseline;gap:8px;display:flex}",
            ".usg_balanceAmount{color:var(--dsw-alias-label-primary);font-size:26px;font-weight:600;line-height:36px;font-variant-numeric:tabular-nums}",
            ".usg_balanceStatus{align-items:center;gap:5px;font-size:14px;line-height:22px;display:inline-flex}",
            ".usg_balanceOk{color:var(--dsw-alias-state-success-primary)}",
            ".usg_balanceBad{color:var(--dsw-alias-state-error-primary)}",
            ".usg_balanceRows{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;font-size:14px;line-height:22px;display:flex}",
            ".usg_balanceRow{justify-content:space-between;display:flex}",
            ".usg_providerPicker{align-items:center;gap:10px;margin:6px 0 8px;font-size:14px;line-height:22px;display:flex}",
            ".usg_providerPickerLabel{color:var(--dsw-alias-label-tertiary);flex:none}",
            ".usg_providerSelect{box-sizing:border-box;min-width:0;flex:1;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:4px 6px;font:inherit;font-size:14px;line-height:22px}",
            ".usg_accountGrid{flex-direction:column;gap:8px;display:flex}",
            ".usg_accountCard{--usg-providerAccent:var(--dsw-alias-state-business-primary,#679efe);box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:linear-gradient(135deg,color-mix(in srgb,var(--usg-providerAccent) 8%,transparent),transparent 42%);border-radius:12px;padding:10px 11px;display:flex;flex-direction:column;gap:9px}",
            ".usg_accountCard[data-provider=deepseek],.usg_accountCard[data-provider=deepseek-official]{--usg-providerAccent:var(--dsw-static-deepseek-400,#679efe)}",
            ".usg_accountCard[data-provider=opencode-go]{--usg-providerAccent:#00a67d}",
            ".usg_accountCard[data-provider=zai],.usg_accountCard[data-provider=zai-coding-cn]{--usg-providerAccent:#7656e8}",
            ".usg_accountCard[data-provider=openrouter]{--usg-providerAccent:#6366f1}",
            ".usg_accountCard[data-provider=moonshotai],.usg_accountCard[data-provider=moonshotai-cn],.usg_accountCard[data-provider=kimi],.usg_accountCard[data-provider=kimi-coding]{--usg-providerAccent:#e07a1f}",
            ".usg_accountHead{align-items:center;gap:8px;display:flex;min-width:0}",
            ".usg_accountMark{width:26px;height:26px;color:#fff;background:var(--usg-providerAccent);border-radius:7px;justify-content:center;align-items:center;font-size:11px;font-weight:700;display:flex;box-shadow:0 4px 12px color-mix(in srgb,var(--usg-providerAccent) 25%,transparent)}",
            ".usg_accountIdentity{min-width:0;flex:1;display:flex;flex-direction:column}",
            ".usg_accountName{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:22px}",
            ".usg_accountPlan{color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}",
            ".usg_accountStatus{color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-fill-l2);border-radius:999px;padding:2px 8px;font-size:12px;line-height:20px;white-space:nowrap;flex:none}",
            ".usg_accountStatus[data-status=ok]{color:var(--usg-providerAccent);background:color-mix(in srgb,var(--usg-providerAccent) 12%,transparent)}",
            ".usg_quotaList{flex-direction:column;gap:8px;display:flex}",
            ".usg_quotaRow{display:flex;flex-direction:column;gap:4px}",
            ".usg_quotaMeta{align-items:baseline;gap:8px;flex-wrap:wrap;display:flex}",
            ".usg_quotaLabel{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}",
            ".usg_quotaValue{color:var(--dsw-alias-label-primary);margin-left:auto;font-size:14px;font-weight:600;line-height:20px;font-variant-numeric:tabular-nums}",
            ".usg_quotaReset{color:var(--dsw-alias-label-caption);font-size:11px;line-height:18px;white-space:nowrap}",
            ".usg_quotaTrack{height:6px;background:var(--dsw-alias-fill-l2);border-radius:999px;overflow:hidden}",
            ".usg_quotaFill{height:100%;background:var(--usg-providerAccent);border-radius:inherit;min-width:2px;transition:width .2s ease}",
            ".usg_quotaEmpty{color:var(--dsw-alias-label-tertiary);margin:0;font-size:13px;line-height:20px}",
            ".usg_statsRow{display:flex;flex-wrap:wrap;gap:10px}",
            ".usg_stat{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;flex:1 1 148px;min-width:0;flex-direction:column;gap:2px;padding:8px 10px;display:flex}",
            ".usg_statValue{color:var(--dsw-alias-label-primary);font-size:17px;font-weight:600;line-height:26px;font-variant-numeric:tabular-nums;white-space:nowrap}",
            ".usg_statLabel{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}",
            ".usg_hitCaption{color:var(--dsw-alias-label-tertiary);margin-top:6px;font-size:13px;line-height:20px;font-variant-numeric:tabular-nums}",
            ".usg_hitCaption b{color:var(--dsw-alias-label-secondary);font-weight:600}",
            ".usg_heat{overflow-x:auto}",
            ".usg_heatHeader{justify-content:space-between;align-items:center;margin-bottom:6px;display:flex}",
            ".usg_heatHeader .usg_sectionTitle{flex:none;margin:0}",
            ".usg_monthNav{align-items:center;gap:2px;display:flex}",
            ".usg_navButton{cursor:pointer;width:24px;height:24px;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;display:inline-flex}",
            ".usg_navButton:hover:not(:disabled){color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}",
            ".usg_navButton:disabled{color:var(--dsw-alias-label-caption);cursor:default}",
            ".usg_monthTitle{color:var(--dsw-alias-label-primary);min-width:104px;font-size:14px;font-weight:500;line-height:24px;text-align:center;font-variant-numeric:tabular-nums}",
            ".usg_todayButton{cursor:pointer;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:6px;padding:0 8px;font-size:13px;line-height:24px}",
            ".usg_todayButton:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}",
            ".usg_monthGrid{flex-direction:column;gap:4px;width:100%;display:flex}",
            ".usg_weekHeader{color:var(--dsw-alias-label-tertiary);grid-template-columns:repeat(7,1fr);gap:4px;display:grid}",
            ".usg_weekLabel{font-size:12px;line-height:20px;text-align:center}",
            ".usg_heatRow{grid-template-columns:repeat(7,1fr);gap:4px;display:grid}",
            ".usg_cell{aspect-ratio:1/1;min-width:0;width:100%;border-radius:8px;background:var(--usg-cellEmpty);border:0;padding:0;cursor:pointer;justify-content:center;align-items:center;font-family:inherit;display:flex}",
            ".usg_cell:hover{box-shadow:0 0 0 1px var(--dsw-alias-label-secondary)}",
            ".usg_cellToday{box-shadow:0 0 0 1px var(--usg-blue)}",
            ".usg_cellToday:hover{box-shadow:0 0 0 1px var(--usg-blue)}",
            ".usg_cellSelected{box-shadow:0 0 0 2px var(--dsw-alias-label-primary)}",
            ".usg_cellSelected:hover{box-shadow:0 0 0 2px var(--dsw-alias-label-primary)}",
            ".usg_cellDay{font-size:14px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;pointer-events:none}",
            ".usg_emptyCell{aspect-ratio:1/1;min-width:0;width:100%}",
            ".usg_legend{align-items:center;gap:6px;margin-top:6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);display:flex;flex-wrap:wrap}",
            ".usg_legendSwatch{width:10px;height:10px;border-radius:2px;background:var(--dsw-alias-fill-l2)}",
            ".usg_days{flex-direction:column;display:flex}",
            ".usg_day{width:100%;min-height:34px;align-items:center;gap:10px;border:0;background:0 0;border-bottom:1px solid var(--dsw-alias-border-l1);padding:6px 0;font:inherit;text-align:left;cursor:pointer;display:flex}",
            ".usg_day:last-child{border-bottom:0}",
            ".usg_day:hover{background:var(--dsw-alias-interactive-bg-hover)}",
            ".usg_dayDate{color:var(--dsw-alias-label-secondary);flex:none;width:128px;font-size:14px;line-height:22px;font-variant-numeric:tabular-nums}",
            ".usg_dayTokens{color:var(--dsw-alias-label-primary);flex:none;font-size:14px;line-height:22px;font-variant-numeric:tabular-nums}",
            ".usg_dayHit{color:var(--dsw-alias-label-tertiary);flex:none;width:64px;font-size:13px;line-height:22px;font-variant-numeric:tabular-nums;text-align:right}",
            ".usg_dayBarTrack{background:var(--dsw-alias-fill-l2);border-radius:2px;height:6px;flex:1;min-width:0;overflow:hidden}",
            ".usg_dayBar{background:var(--usg-blue);border-radius:inherit;height:6px;min-width:2px}",
            ".usg_detailHeader{align-items:center;gap:8px;display:flex}",
            ".usg_back{cursor:pointer;width:26px;height:26px;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;display:inline-flex;flex:none}",
            ".usg_back:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}",
            ".usg_detailDate{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:500;line-height:24px}",
            ".usg_detailHit{color:var(--dsw-alias-label-tertiary);margin-left:auto;font-size:13px;line-height:24px;font-variant-numeric:tabular-nums}",
            ".usg_detailSummary{color:var(--dsw-alias-label-secondary);margin:6px 0 8px;font-size:14px;line-height:22px;font-variant-numeric:tabular-nums}",
            ".usg_modelRow{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin-bottom:8px;padding:8px 10px;display:flex;flex-direction:column;gap:4px}",
            ".usg_modelRow:last-child{margin-bottom:0}",
            ".usg_modelHead{align-items:center;gap:8px;display:flex}",
            ".usg_modelName{color:var(--dsw-alias-label-primary);min-width:0;text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:14px;font-weight:500;line-height:22px;overflow:hidden}",
            ".usg_modelTokens{color:var(--dsw-alias-label-primary);flex:none;font-size:14px;line-height:22px;font-variant-numeric:tabular-nums}",
            ".usg_modelHit{color:var(--dsw-alias-label-tertiary);flex:none;width:68px;font-size:13px;line-height:22px;font-variant-numeric:tabular-nums;text-align:right}",
            ".usg_modelBarTrack{background:var(--dsw-alias-fill-l2);border-radius:2px;height:5px;overflow:hidden}",
            ".usg_modelBar{background:var(--usg-blue);border-radius:2px;height:5px}",
            ".usg_modelMeta{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;font-variant-numeric:tabular-nums}",
            ".usg_footerNote{color:var(--dsw-alias-label-caption);margin-top:10px;font-size:13px;line-height:20px;font-variant-numeric:tabular-nums}"
        ].join("");
        const tagId = "dsh-plugin-dosage/UsageStats.module.css.v6";
        if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
            const tag = document.createElement("style");
            tag.dataset.plugin = "dsh-usage-stats";
            tag.dataset.pluginCss = tagId;
            tag.textContent = css;
            document.head.appendChild(tag);
        }
        const S = {
            layer: "usg_layer",
            rail: "usg_rail",
            footerButtons: "usg_footerButtons",
            badge: "usg_badge",
            badgeLabel: "usg_badgeLabel",
            badgeCount: "usg_badgeCount",
            panel: "usg_panel",
            header: "usg_header",
            headerLeft: "usg_headerLeft",
            title: "usg_title",
            headerActions: "usg_headerActions",
            iconButton: "usg_iconButton",
            body: "usg_body",
            measure: "usg_measure",
            tabs: "usg_tabs",
            tab: "usg_tab",
            tabOn: "usg_tabOn",
            section: "usg_section",
            sectionTitle: "usg_sectionTitle",
            note: "usg_note",
            error: "usg_error",
            retry: "usg_retry",
            providerPicker: "usg_providerPicker",
            providerPickerLabel: "usg_providerPickerLabel",
            providerSelect: "usg_providerSelect",
            accountGrid: "usg_accountGrid",
            accountCard: "usg_accountCard",
            accountHead: "usg_accountHead",
            accountMark: "usg_accountMark",
            accountIdentity: "usg_accountIdentity",
            accountName: "usg_accountName",
            accountPlan: "usg_accountPlan",
            accountStatus: "usg_accountStatus",
            quotaList: "usg_quotaList",
            quotaRow: "usg_quotaRow",
            quotaMeta: "usg_quotaMeta",
            quotaLabel: "usg_quotaLabel",
            quotaValue: "usg_quotaValue",
            quotaReset: "usg_quotaReset",
            quotaTrack: "usg_quotaTrack",
            quotaFill: "usg_quotaFill",
            quotaEmpty: "usg_quotaEmpty",
            balanceCard: "usg_balanceCard",
            balanceMain: "usg_balanceMain",
            balanceAmount: "usg_balanceAmount",
            balanceStatus: "usg_balanceStatus",
            balanceOk: "usg_balanceOk",
            balanceBad: "usg_balanceBad",
            balanceRows: "usg_balanceRows",
            balanceRow: "usg_balanceRow",
            statsRow: "usg_statsRow",
            stat: "usg_stat",
            statValue: "usg_statValue",
            statLabel: "usg_statLabel",
            hitCaption: "usg_hitCaption",
            heat: "usg_heat",
            heatHeader: "usg_heatHeader",
            monthNav: "usg_monthNav",
            navButton: "usg_navButton",
            monthTitle: "usg_monthTitle",
            todayButton: "usg_todayButton",
            monthGrid: "usg_monthGrid",
            weekHeader: "usg_weekHeader",
            weekLabel: "usg_weekLabel",
            heatRow: "usg_heatRow",
            cell: "usg_cell",
            cellSelected: "usg_cellSelected",
            cellToday: "usg_cellToday",
            cellDay: "usg_cellDay",
            emptyCell: "usg_emptyCell",
            legend: "usg_legend",
            legendSwatch: "usg_legendSwatch",
            days: "usg_days",
            dayBarTrack: "usg_dayBarTrack",
            day: "usg_day",
            dayDate: "usg_dayDate",
            dayTokens: "usg_dayTokens",
            dayHit: "usg_dayHit",
            dayBar: "usg_dayBar",
            detailHeader: "usg_detailHeader",
            back: "usg_back",
            detailDate: "usg_detailDate",
            detailHit: "usg_detailHit",
            detailSummary: "usg_detailSummary",
            modelRow: "usg_modelRow",
            modelHead: "usg_modelHead",
            modelName: "usg_modelName",
            modelTokens: "usg_modelTokens",
            modelHit: "usg_modelHit",
            modelBarTrack: "usg_modelBarTrack",
            modelBar: "usg_modelBar",
            modelMeta: "usg_modelMeta",
            footerNote: "usg_footerNote"
        };
        //#endregion

        //#region helpers
        /** Local `YYYY-MM-DD` for a Date. */
        function dayKeyOf(date) {
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${date.getFullYear()}-${month}-${day}`;
        }

        /** Today's local `YYYY-MM-DD`. */
        function todayKey() {
            return dayKeyOf(new Date());
        }

        /** Current month key `YYYY-MM`. */
        function currentMonthKey() {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        }

        /** Shift a `YYYY-MM` key by a signed month delta. */
        function shiftMonth(key, delta) {
            const [year, month] = key.split("-").map(Number);
            const date = new Date(year, month - 1 + delta, 1);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        }

        /** Localized `YYYY-MM` → e.g. "2026年8月" / "Aug 2026". */
        function monthLabelOf(key, translate) {
            const [year, month] = key.split("-").map(Number);
            return translate("month.year", { year, month: monthName(month - 1, translate) });
        }

        /** Group thousands. */
        function fmt(n) {
            return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        /** Compact form: 1234 → "1.2k". */
        function fmtCompact(n) {
            if (n < 1000) return String(n);
            if (n < 1000000) return `${(n / 1000).toFixed(n < 10000 ? 1 : 0)}k`;
            return `${(n / 1000000).toFixed(1)}m`;
        }

        function fmtTokCard(n) {
            n = Math.round(n || 0);
            if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.0$/, "") + "M";
            if (n >= 10000) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
            return fmt(n);
        }

        /** Hit-rate display: null/undefined → "—". */
        function fmtHit(hitRate) {
            return hitRate === null || hitRate === void 0 ? "—" : `${hitRate}%`;
        }

        /** Currency-aware amount: `¥ 36.44` / `$ 12.00` (Intl, fallback keeps the raw value). */
        function fmtCurrency(amount, currency) {
            if (amount === void 0 || amount === null) return "—";
            const numeric = Number(amount);
            if (!Number.isFinite(numeric)) return "—";
            try {
                return new Intl.NumberFormat(undefined, { style: "currency", currency: currency ?? "CNY" }).format(numeric);
            } catch {
                return `${currency ?? "CNY"} ${amount}`;
            }
        }

        /**
         * Per-request staleness guard: each `start()` bumps a private counter and
         * only the most recent start may `isCurrent()`. Usage and balance each
         * hold their OWN loader, so the two never invalidate each other (the
         * shared-counter race that dropped the first usage response).
         */
        function createLoader() {
            let current = 0;
            return {
                start: () => ++current,
                isCurrent: (id) => id === current
            };
        }

        /**
         * Normalize server-provided account metadata for the single selector.
         * Adapter/mode selection belongs to the server registry, never UI guesses.
         */
        function buildProviderChoices(providers) {
            return Array.isArray(providers) ? providers.map((provider) => ({
                ...provider,
                accountMode: provider.accountMode ?? "balance"
            })) : [];
        }

        /** Locale-safe template interpolation: `t("key", {a})` replaces `{a}`. */
        function interpolate(template, params) {
            if (params === void 0) return template;
            return template.replace(/\{(\w+)\}/g, (match, key) => (Object.hasOwn(params, key) ? String(params[key]) : match));
        }

        async function fetchJson(path) {
            const response = await fetch(path, { headers: { accept: "application/json" } });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload = await response.json();
            if (payload === null || typeof payload !== "object") throw new Error("unexpected response");
            return payload;
        }

        /**
         * Build one month's calendar heatmap: weeks as rows (Mon-first), only
         * the month's own days, padded with null placeholders. Cell tokens come
         * from the day map; `max` is the month's largest daily total, used for
         * the absolute log-scale color mapping.
         * @param dayMap - date key → day entry map.
         * @param year - calendar year.
         * @param month - zero-based month.
         * @returns `{ weeks, max }`.
         */
        function buildMonthHeatmap(dayMap, year, month) {
            const first = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const lead = (first.getDay() + 6) % 7; // Monday = 0
            const weeks = [];
            let max = 0;
            for (let w = 0; w * 7 < lead + daysInMonth; w += 1) {
                const week = [];
                for (let d = 0; d < 7; d += 1) {
                    const dayNum = w * 7 + d - lead + 1;
                    if (dayNum < 1 || dayNum > daysInMonth) {
                        week.push(null);
                        continue;
                    }
                    const date = new Date(year, month, dayNum);
                    const key = dayKeyOf(date);
                    const entry = dayMap.get(key);
                    const tokens = entry?.tokens ?? 0;
                    week.push({ key, day: dayNum, tokens, hitRate: entry?.cacheHitRate ?? null });
                    if (tokens > max) max = tokens;
                }
                weeks.push(week);
            }
            return { weeks, max };
        }

        /**
         * Theme-accent cell color: square-root mapping against the month's
         * max, mixed from --usg-blue so dark/light DSH themes stay consistent.
         * Zero is the neutral gray "empty" cell.
         */
        function cellColor(tokens, max) {
            if (tokens <= 0) {
                return {
                    background: "var(--usg-cellEmpty)",
                    color: "var(--dsw-alias-label-secondary)"
                };
            }
            const ratio = max > 0 ? Math.sqrt(tokens / max) : 1;
            const pct = Math.round(Math.min(100, 22 + 78 * ratio));
            return {
                background: `color-mix(in srgb, var(--usg-blue) ${pct}%, transparent)`,
                color: pct >= 60 ? "rgba(255,255,255,0.95)" : "var(--dsw-alias-label-primary)"
            };
        }
        //#endregion

        //#region UsageStatsPanel
        /**
         * Sidebar footer action: badge + floating panel with balance and usage.
         * @param props - `wide` from the sidebar shell, `t` bound by the slot runtime.
         */
        function UsageStatsPanel({ wide, t, timer }) {
            const translate = (key, params) => interpolate(t !== void 0 ? t(key) : key, params);
            const [open, setOpen] = react.useState(false);
            const [dockTab, setDockTab] = react.useState("balance");
            const [usage, setUsage] = react.useState(null);
            const [usageError, setUsageError] = react.useState(null);
            const [selectedDay, setSelectedDay] = react.useState(null);
            const [providers, setProviders] = react.useState([]);
            const [providersLoaded, setProvidersLoaded] = react.useState(false);
            const [selectedProvider, setSelectedProvider] = react.useState(null);
            const [account, setAccount] = react.useState(null);
            const [accountLoading, setAccountLoading] = react.useState(false);
            const [accountError, setAccountError] = react.useState(null);
            const [refreshedAt, setRefreshedAt] = react.useState(null);
            const [todayCost, setTodayCost] = react.useState(null);
            const mountedRef = react.useRef(true);
            const panelRef = react.useRef(null);
            const measureRef = react.useRef(null);
            const [lockH, setLockH] = react.useState(null);
            const usageLoaderRef = react.useRef(null);
            const accountLoaderRef = react.useRef(null);
            if (usageLoaderRef.current === null) usageLoaderRef.current = createLoader();
            if (accountLoaderRef.current === null) accountLoaderRef.current = createLoader();
            const providerChoices = react.useMemo(() => buildProviderChoices(providers), [providers]);
            const selectedProviderInfo = providerChoices.find((provider) => provider.id === selectedProvider) ?? null;

            const loadUsage = react.useCallback(() => {
                const seq = usageLoaderRef.current.start();
                setUsageError(null);
                fetchJson("/api/usage-stats/usage").then((payload) => {
                    if (!mountedRef.current || !usageLoaderRef.current.isCurrent(seq)) return;
                    if (payload.ok !== true) {
                        setUsageError(payload.message ?? "usage aggregation failed");
                        return;
                    }
                    setUsage(payload);
                    setRefreshedAt(Date.now());
                }).catch((error) => {
                    if (!mountedRef.current || !usageLoaderRef.current.isCurrent(seq)) return;
                    setUsageError(error instanceof Error ? error.message : String(error));
                });
            }, []);

            const loadProviders = react.useCallback(() => {
                fetchJson("/api/usage-stats/providers").then((payload) => {
                    if (!mountedRef.current) return;
                    if (payload.ok !== true) {
                        setProvidersLoaded(true);
                        return;
                    }
                    const list = Array.isArray(payload.providers) ? payload.providers : [];
                    setProviders(list);
                    setProvidersLoaded(true);
                }).catch(() => { setProvidersLoaded(true); });
            }, []);

            const loadAccount = react.useCallback((providerId, force = false, silent = false) => {
                const seq = accountLoaderRef.current.start();
                if (!silent) {
                    setAccountLoading(true);
                    setAccountError(null);
                }
                const target = providerId;
                if (target === null) {
                    setAccountLoading(false);
                    setAccountError("no providers");
                    return;
                }
                const query = `?provider=${encodeURIComponent(target)}${force ? "&refresh=1" : ""}`;
                fetchJson(`/api/usage-stats/account${query}`).then((payload) => {
                    if (!mountedRef.current || !accountLoaderRef.current.isCurrent(seq)) return;
                    if (payload.ok !== true) {
                        setAccountError(payload.message ?? "account fetch failed");
                        return;
                    }
                    setAccount(payload.account);
                    setRefreshedAt(payload.account?.fetchedAt ?? Date.now());
                }).catch((error) => {
                    if (!mountedRef.current || !accountLoaderRef.current.isCurrent(seq)) return;
                    setAccountError(error instanceof Error ? error.message : String(error));
                }).finally(() => {
                    if (mountedRef.current && accountLoaderRef.current.isCurrent(seq)) setAccountLoading(false);
                });
            }, []);

            const loadBilling = react.useCallback(() => {
                api({ action: "list" }).then((res) => {
                    if (!mountedRef.current) return;
                    const records = (res && res.records) || [];
                    const today = bjKey(Date.now());
                    let sum = 0;
                    for (let i = 0; i < records.length; i++) {
                        if (bjKey(records[i].time) === today) sum += costOf(records[i], "auto");
                    }
                    setTodayCost(sum);
                }).catch(() => {
                    if (mountedRef.current) setTodayCost(null);
                });
            }, []);

            react.useEffect(() => {
                mountedRef.current = true;
                return () => {
                    mountedRef.current = false;
                };
            }, []);

            // Keep exactly one valid provider selected across independent provider
            // and subscription responses. DeepSeek remains the initial preference.
            react.useEffect(() => {
                if (!providersLoaded || providerChoices.length === 0) return;
                setSelectedProvider((current) => {
                    if (current !== null && providerChoices.some((provider) => provider.id === current)) return current;
                    return providerChoices.find((provider) => provider.id === "deepseek-official" && provider.configured)?.id
                        ?? providerChoices.find((provider) => provider.id === "deepseek")?.id
                        ?? providerChoices.find((provider) => provider.configured)?.id
                        ?? providerChoices[0].id;
                });
            }, [providerChoices, providersLoaded]);

            react.useEffect(() => {
                if (!open) return;
                loadUsage();
                loadProviders();
                loadBilling();
                const usageTimer = window.setInterval(loadUsage, 10000);
                const providerTimer = window.setInterval(loadProviders, 300000);
                const billingTimer = window.setInterval(loadBilling, 10000);
                return () => {
                    window.clearInterval(usageTimer);
                    window.clearInterval(providerTimer);
                    window.clearInterval(billingTimer);
                };
            }, [open, loadUsage, loadProviders, loadBilling]);

            // 面板打开时每 10 秒强制拉一次上游余额，不走五分钟缓存。
            react.useEffect(() => {
                if (!open || selectedProvider === null) return;
                loadAccount(selectedProvider, true);
                const timer = window.setInterval(() => loadAccount(selectedProvider, true, true), 10000);
                return () => {
                    window.clearInterval(timer);
                };
            }, [open, selectedProvider, loadAccount]);

            react.useLayoutEffect(() => {
                if (!open) {
                    setLockH(null);
                    return;
                }
                const panel = panelRef.current;
                const measure = measureRef.current;
                if (!panel || !measure) return;
                const sync = () => {
                    const header = panel.querySelector(".usg_header");
                    const tabs = panel.querySelector(".usg_tabs");
                    setLockH((header ? header.offsetHeight : 0) + (tabs ? tabs.offsetHeight : 0) + measure.scrollHeight);
                };
                sync();
                const ro = new ResizeObserver(sync);
                ro.observe(measure);
                return () => ro.disconnect();
            }, [open]);

            react.useEffect(() => {
                if (!open) return;
                const onPointerDown = (event) => {
                    const target = event.target;
                    if (!(target instanceof Node)) return;
                    if (target.closest && (target.closest("[data-usage-stats-panel]") || target.closest("[data-usage-stats-badge]"))) return;
                    setOpen(false);
                };
                document.addEventListener("pointerdown", onPointerDown, true);
                return () => document.removeEventListener("pointerdown", onPointerDown, true);
            }, [open]);

            const dayMap = react.useMemo(() => {
                const map = new Map();
                if (usage !== null && Array.isArray(usage.days)) {
                    for (const day of usage.days) map.set(day.date, day);
                }
                return map;
            }, [usage]);

            // Drop a stale selection when refreshed data no longer has that day.
            react.useEffect(() => {
                if (selectedDay !== null && !dayMap.has(selectedDay)) setSelectedDay(null);
            }, [dayMap, selectedDay]);

            const stats = react.useMemo(() => {
                if (usage === null || !Array.isArray(usage.days)) return null;
                const today = todayKey();
                const month = today.slice(0, 7);
                let todayEntry = null;
                let dayTokens = 0;
                let monthTokens = 0;
                let total = usage.total?.tokens ?? 0;
                for (const day of usage.days) {
                    if (day.date === today) {
                        dayTokens = day.tokens ?? 0;
                        todayEntry = day;
                    }
                    if (day.date.startsWith(month)) monthTokens += day.tokens ?? 0;
                }
                return {
                    dayTokens,
                    monthTokens,
                    total,
                    todayHit: todayEntry?.cacheHitRate ?? null,
                    todayCacheRead: todayEntry?.cacheReadTokens ?? 0
                };
            }, [usage]);

            const recent = react.useMemo(() => {
                // Last 14 CALENDAR days (not "last 14 recorded days"): days without
                // usage inside the window are omitted from the list.
                if (usage === null || !Array.isArray(usage.days)) return [];
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - 13);
                const cutoffKey = dayKeyOf(cutoff);
                return usage.days.filter((day) => day.date >= cutoffKey && day.date <= todayKey()).reverse();
            }, [usage]);

            const selectedEntry = selectedDay !== null ? dayMap.get(selectedDay) ?? null : null;
            const badgeCount = stats !== null ? fmtCompact(stats.dayTokens) : null;

            const retry = () => {
                loadUsage();
                loadProviders();
                loadBilling();
                if (selectedProvider !== null) loadAccount(selectedProvider, true);
            };

            const updatedLabel = refreshedAt === null ? "" : translate("panel.updatedAt", {
                time: new Date(refreshedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            });

            return react_jsx_runtime.jsxs("div", {
                className: wide ? S.layer : `${S.layer} ${S.rail}`,
                children: [
                    open && react_jsx_runtime.jsxs("section", {
                        className: S.panel,
                        ref: panelRef,
                        style: lockH ? { "--usg-lock-h": lockH + "px" } : undefined,
                        "data-usage-stats-panel": true,
                        "aria-label": translate("panel.title"),
                        children: [
                            react_jsx_runtime.jsxs("header", {
                                className: S.header,
                                children: [
                                    react_jsx_runtime.jsxs("div", {
                                        className: S.headerLeft,
                                        children: [
                                            react_jsx_runtime.jsx(primitives.IconDataOutline16, { size: 16 }),
                                            react_jsx_runtime.jsx("span", { className: S.title, children: translate("panel.title") })
                                        ]
                                    }),
                                    react_jsx_runtime.jsxs("div", {
                                        className: S.headerActions,
                                        children: [
                                            react_jsx_runtime.jsx(primitives.Tooltip, {
                                                label: translate("action.refresh"),
                                                side: "bottom",
                                                delayMs: 500,
                                                children: react_jsx_runtime.jsx("button", {
                                                    type: "button",
                                                    className: S.iconButton,
                                                    "aria-label": translate("action.refresh"),
                                                    onClick: retry,
                                                    children: react_jsx_runtime.jsx(primitives.IconRefreshOutline14, { size: 14 })
                                                })
                                            }),
                                            react_jsx_runtime.jsx(primitives.Tooltip, {
                                                label: translate("action.close"),
                                                side: "bottom",
                                                delayMs: 500,
                                                children: react_jsx_runtime.jsx("button", {
                                                    type: "button",
                                                    className: S.iconButton,
                                                    "aria-label": translate("action.close"),
                                                    onClick: () => setOpen(false),
                                                    children: react_jsx_runtime.jsx(primitives.IconCloseOutline16, { size: 14 })
                                                })
                                            })
                                        ]
                                    })
                                ]
                            }),
                            react_jsx_runtime.jsx("div", {
                                className: S.tabs,
                                children: [
                                    { k: "balance", t: translate("tab.balance") },
                                    { k: "overview", t: translate("tab.overview") },
                                    { k: "calendar", t: translate("tab.usage") },
                                    { k: "cache", t: translate("tab.calls") },
                                    { k: "prices", t: translate("tab.prices") }
                                ].map((item) => react_jsx_runtime.jsx("button", {
                                    type: "button",
                                    className: dockTab === item.k ? `${S.tab} ${S.tabOn}` : S.tab,
                                    onClick: () => setDockTab(item.k),
                                    children: item.t
                                }, item.k))
                            }),
                            react_jsx_runtime.jsx("div", {
                                className: S.body,
                                children: dockTab !== "balance"
                                    ? el(UsagePanel, { timer: timer, tab: dockTab, hideSubtabs: true })
                                    : selectedEntry !== null ? react_jsx_runtime.jsx(DayDetail, {
                                        day: selectedEntry,
                                        translate,
                                        onBack: () => setSelectedDay(null)
                                    }) : react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
                                        children: [
                                            react_jsx_runtime.jsx("section", {
                                                className: S.section,
                                                children: react_jsx_runtime.jsx("h3", { className: S.sectionTitle, children: translate("account.title") })
                                            }),
                                            react_jsx_runtime.jsx(ProviderPicker, {
                                                providers: providerChoices,
                                                selectedProvider,
                                                onSelect: (id) => setSelectedProvider(id),
                                                translate
                                            }),
                                            selectedProviderInfo === null ? react_jsx_runtime.jsx("p", { className: S.note, children: translate("account.loading") }) : react_jsx_runtime.jsx("div", {
                                                className: S.accountGrid,
                                            children: react_jsx_runtime.jsx(ProviderAccountCard, {
                                                provider: selectedProviderInfo,
                                                account: account?.id === selectedProvider ? account : null,
                                                accountLoading,
                                                accountError,
                                                translate,
                                                onRetry: () => loadAccount(selectedProvider, true)
                                                }, selectedProviderInfo.id)
                                            }),
                                            react_jsx_runtime.jsx("section", {
                                                className: S.section,
                                                children: react_jsx_runtime.jsx("h3", { className: S.sectionTitle, children: translate("usage.title") })
                                            }),
                                            stats === null && usageError === null ? react_jsx_runtime.jsx("p", { className: S.note, children: translate("usage.loading") }) : null,
                                            usageError !== null ? react_jsx_runtime.jsxs("div", {
                                                className: S.error,
                                                children: [
                                                    react_jsx_runtime.jsx("span", { children: translate("usage.error", { message: usageError }) }),
                                                    react_jsx_runtime.jsx("button", {
                                                        type: "button",
                                                        className: S.retry,
                                                        onClick: loadUsage,
                                                        children: translate("action.retry")
                                                    })
                                                ]
                                            }) : null,
                                            stats !== null && react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
                                                children: [
                                                    react_jsx_runtime.jsxs("div", {
                                                        className: S.statsRow,
                                                        children: [
                                                            react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statValue, children: fmt(stats.dayTokens) }), react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.today") })] }),
                                                            react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statValue, children: fmt(stats.monthTokens) }), react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.month") })] }),
                                                            react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statValue, children: fmt(stats.total) }), react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.total") })] })
                                                        ]
                                                    }),
                                                    react_jsx_runtime.jsxs("div", {
                                                        className: S.statsRow,
                                                        style: { marginTop: 8 },
                                                        children: [
                                                            react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statValue, children: fmtTokCard(stats.todayCacheRead) }), react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.cacheHits") })] }),
                                                            react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statValue, children: fmtHit(stats.todayHit) }), react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.hitRatePct") })] }),
                                                            react_jsx_runtime.jsx("div", { className: S.stat, children: [react_jsx_runtime.jsx("span", { className: S.statValue, children: todayCost === null ? "—" : fmtMoney(todayCost) }), react_jsx_runtime.jsx("span", { className: S.statLabel, children: translate("usage.todayCost") })] })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            recent.length > 0 && react_jsx_runtime.jsxs("section", {
                                                className: S.section,
                                                children: [
                                                    react_jsx_runtime.jsx("h3", { className: S.sectionTitle, children: translate("usage.recent") }),
                                                    react_jsx_runtime.jsx("div", {
                                                        className: S.days,
                                                        children: recent.map((day) => {
                                                            const maxRecent = Math.max(...recent.map((d) => d.tokens ?? 0), 1);
                                                            return react_jsx_runtime.jsxs("button", {
                                                                type: "button",
                                                                className: S.day,
                                                                onClick: () => setSelectedDay(day.date),
                                                                children: [
                                                                    react_jsx_runtime.jsx("span", { className: S.dayDate, children: dayLabel(day.date, translate) }),
                                                                    react_jsx_runtime.jsx("span", { className: S.dayTokens, children: fmt(day.tokens ?? 0) }),
                                                                    react_jsx_runtime.jsx("span", { className: S.dayHit, children: fmtHit(day.cacheHitRate) }),
                                                                    react_jsx_runtime.jsx("div", {
                                                                        className: S.dayBarTrack,
                                                                        children: react_jsx_runtime.jsx("div", {
                                                                            className: S.dayBar,
                                                                            style: { width: `${Math.max(4, Math.round(100 * (day.tokens ?? 0) / maxRecent))}%` }
                                                                        })
                                                                    })
                                                                ]
                                                            }, day.date);
                                                        })
                                                    })
                                                ]
                                            }),
                                            updatedLabel !== "" && react_jsx_runtime.jsx("p", { className: S.footerNote, children: updatedLabel })
                                        ]
                                    })
                            }),
                            react_jsx_runtime.jsx("div", {
                                className: S.measure,
                                ref: measureRef,
                                "aria-hidden": true,
                                children: el(UsagePanel, { timer: timer, tab: "calendar", hideSubtabs: true })
                            })
                        ]
                    }),
                    react_jsx_runtime.jsx("div", {
                        className: S.footerButtons,
                        children: react_jsx_runtime.jsxs("button", {
                            type: "button",
                            className: S.badge,
                            "data-usage-stats-badge": true,
                            "aria-label": translate("panel.badge"),
                            "aria-expanded": open,
                            onClick: () => setOpen((value) => !value),
                            children: [
                                react_jsx_runtime.jsx(primitives.IconDataOutline16, { size: wide ? 14 : 18 }),
                                wide && react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
                                    children: [
                                        react_jsx_runtime.jsx("span", { className: S.badgeLabel, children: translate("panel.badge") }),
                                        badgeCount !== null && react_jsx_runtime.jsx("span", { className: S.badgeCount, children: badgeCount })
                                    ]
                                })
                            ]
                        })
                    })
                ]
            });
        }

        function providerMark(provider) {
            const known = {
                "deepseek-official": "DS",
                deepseek: "DS",
                "opencode-go": "GO",
                openrouter: "OR",
                moonshotai: "K",
                "moonshotai-cn": "K",
                kimi: "K",
                "kimi-coding": "K",
                zai: "Z",
                "zai-coding-cn": "Z"
            };
            return known[provider.id] ?? String(provider.displayName ?? provider.id).replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
        }

        /** Balance-mode body rendered inside the shared provider account frame. */
        function BalanceContent({ balance, state, message, translate, onRetry }) {
            if (state === "loading" || balance === null && state === "ok") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("balance.loading") });
            if (state === "blocked") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("account.blocked") });
            if (state === "unsupported") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("balance.unsupported") });
            if (state === "no-credential") return react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("balance.noCredential", { ref: message ?? "" }) });
            if (state === "error") return react_jsx_runtime.jsxs("div", {
                className: S.error,
                children: [
                    react_jsx_runtime.jsx("span", { children: translate("balance.error", { message: message ?? "" }) }),
                    react_jsx_runtime.jsx("button", { type: "button", className: S.retry, onClick: onRetry, children: translate("action.retry") })
                ]
            });
            return react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
                children: [
                    react_jsx_runtime.jsxs("div", {
                        className: S.balanceMain,
                        children: [
                            react_jsx_runtime.jsx("span", { className: S.balanceAmount, children: balance.unlimited ? "∞" : fmtCurrency(balance.remaining, balance.currency) }),
                            react_jsx_runtime.jsx("span", { className: S.accountPlan, children: translate("balance.remaining") })
                        ]
                    }),
                    react_jsx_runtime.jsx("div", {
                        className: S.balanceRows,
                        children: [
                            { value: balance.used, label: translate("balance.used") },
                            { value: balance.total, label: translate("balance.total") },
                            { value: balance.breakdown?.toppedUp, label: translate("balance.toppedUp") },
                            { value: balance.breakdown?.granted, label: translate("balance.granted") }
                        ].filter((row) => row.value !== null && row.value !== void 0).map((row, index) => react_jsx_runtime.jsxs("div", {
                            className: S.balanceRow,
                            children: [
                                react_jsx_runtime.jsx("span", { children: row.label }),
                                react_jsx_runtime.jsx("span", { children: fmtCurrency(row.value, balance.currency) })
                            ]
                        }, `${row.label}-${index}`))
                    })
                ]
            });
        }

        /** Provider selector shared by monetary and subscription account modes. */
        function ProviderPicker({ providers, selectedProvider, onSelect, translate }) {
            if (providers.length === 0) return null;
            return react_jsx_runtime.jsxs("label", {
                className: S.providerPicker,
                children: [
                    react_jsx_runtime.jsx("span", { className: S.providerPickerLabel, children: translate("account.provider") }),
                    react_jsx_runtime.jsx("select", {
                        className: S.providerSelect,
                        value: selectedProvider ?? "",
                        "aria-label": translate("account.provider"),
                        onChange: (event) => onSelect(event.target.value),
                        children: providers.map((provider) => react_jsx_runtime.jsx("option", {
                            value: provider.id,
                            children: provider.displayName
                        }, provider.id))
                    })
                ]
            });
        }

        function subscriptionStatusLabel(status, translate) {
            if (status === "ok") return translate("subscription.status.ok");
            if (status === "not-configured") return translate("subscription.status.notConfigured");
            if (status === "unauthorized") return translate("subscription.status.unauthorized");
            if (status === "rate-limited") return translate("subscription.status.rateLimited");
            if (status === "invalid-response") return translate("account.status.invalidResponse");
            if (status === "blocked") return translate("account.status.blocked");
            if (status === "unsupported") return translate("account.status.unsupported");
            return translate("subscription.status.unavailable");
        }

        function quotaLabel(kind, translate) {
            if (kind === "session") return translate("subscription.window.session");
            if (kind === "daily") return translate("subscription.window.daily");
            if (kind === "weekly") return translate("subscription.window.weekly");
            if (kind === "monthly") return translate("subscription.window.monthly");
            if (kind === "quota") return translate("subscription.window.quota");
            if (kind === "billing") return translate("subscription.window.mcp");
            return kind;
        }

        function resetLabel(resetsAt, translate) {
            if (typeof resetsAt !== "string") return "";
            const date = new Date(resetsAt);
            if (Number.isNaN(date.getTime())) return "";
            return translate("subscription.resets", {
                time: date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
            });
        }

        /** Percentage-window body rendered inside the shared provider account frame. */
        function SubscriptionContent({ provider, translate }) {
            const windows = Array.isArray(provider.windows) ? provider.windows : [];
            const status = typeof provider.status === "string" ? provider.status : "unavailable";
            const emptyMessage = status === "not-configured"
                ? translate("subscription.notConfigured", { refs: Array.isArray(provider.missingCredentials) ? provider.missingCredentials.join(" + ") : "" })
                : status === "unauthorized" ? translate("subscription.unauthorized")
                    : status === "rate-limited" ? translate("subscription.rateLimited")
                        : status === "invalid-response" ? translate("account.invalidResponse")
                            : status === "blocked" ? translate("account.blocked")
                                : status === "unsupported" ? translate("balance.unsupported")
                                    : translate("subscription.unavailable");
            return (status === "ok" || provider.stale === true) && windows.length > 0 ? react_jsx_runtime.jsx("div", {
                        className: S.quotaList,
                        children: windows.map((window) => {
                            const used = Math.max(0, Math.min(100, Number(window.usedPercent) || 0));
                            return react_jsx_runtime.jsxs("div", {
                                className: S.quotaRow,
                                children: [
                                    react_jsx_runtime.jsxs("div", {
                                        className: S.quotaMeta,
                                        children: [
                                            react_jsx_runtime.jsx("span", { className: S.quotaLabel, children: quotaLabel(window.kind, translate) }),
                                            react_jsx_runtime.jsx("span", { className: S.quotaReset, children: resetLabel(window.resetsAt, translate) }),
                                            react_jsx_runtime.jsx("span", { className: S.quotaValue, children: translate("subscription.used", { value: used.toFixed(used % 1 === 0 ? 0 : 1) }) })
                                        ]
                                    }),
                                    react_jsx_runtime.jsx("div", {
                                        className: S.quotaTrack,
                                        role: "progressbar",
                                        "aria-label": quotaLabel(window.kind, translate),
                                        "aria-valuemin": 0,
                                        "aria-valuemax": 100,
                                        "aria-valuenow": used,
                                        children: react_jsx_runtime.jsx("div", { className: S.quotaFill, style: { width: `${used}%` } })
                                    })
                                ]
                            }, window.kind);
                        })
                    }) : react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: emptyMessage });
        }

        /**
         * The single account-card interface. Provider identity/colour/status live
         * in the shared frame; only the inner balance/quota data varies by mode.
         */
        function ProviderAccountCard({ provider, account, accountLoading, accountError, translate, onRetry }) {
            const mode = account?.mode ?? provider.accountMode ?? "balance";
            const subscriptionMode = mode === "subscription";
            const status = accountLoading && account === null ? "loading" : account?.status ?? "unavailable";
            const statusText = status === "loading" ? translate("account.status.loading")
                : status === "blocked" ? translate("account.status.blocked")
                    : status === "unsupported" ? translate("account.status.unsupported")
                        : subscriptionStatusLabel(status, translate);
            const subtitle = account?.plan ?? (subscriptionMode ? translate("subscription.planUnknown") : translate("account.balanceMode"));
            const balanceState = accountLoading && account === null ? "loading"
                : accountError !== null ? "error"
                    : status === "not-configured" ? "no-credential"
                        : status === "blocked" ? "blocked"
                            : status === "unsupported" ? "unsupported"
                                : account?.balance !== null && account?.balance !== void 0 ? "ok" : "error";
            const balanceMessage = accountError ?? account?.missingCredentials?.[0] ?? status;
            return react_jsx_runtime.jsxs("article", {
                className: S.accountCard,
                "data-provider": provider.id,
                "data-account-mode": mode,
                children: [
                    react_jsx_runtime.jsxs("div", {
                        className: S.accountHead,
                        children: [
                            react_jsx_runtime.jsx("span", { className: S.accountMark, "aria-hidden": true, children: providerMark(provider) }),
                            react_jsx_runtime.jsxs("span", {
                                className: S.accountIdentity,
                                children: [
                                    react_jsx_runtime.jsx("span", { className: S.accountName, children: provider.displayName }),
                                    react_jsx_runtime.jsx("span", { className: S.accountPlan, children: subtitle })
                                ]
                            }),
                            react_jsx_runtime.jsx("span", { className: S.accountStatus, "data-status": status, children: statusText })
                        ]
                    }),
                    subscriptionMode
                        ? accountError !== null ? react_jsx_runtime.jsxs("div", {
                            className: S.error,
                            children: [
                                react_jsx_runtime.jsx("span", { children: translate("subscription.error", { message: accountError }) }),
                                react_jsx_runtime.jsx("button", { type: "button", className: S.retry, onClick: onRetry, children: translate("action.retry") })
                            ]
                        }) : accountLoading && account === null
                            ? react_jsx_runtime.jsx("p", { className: S.quotaEmpty, children: translate("subscription.loading") })
                            : react_jsx_runtime.jsx(SubscriptionContent, { provider: account ?? { status: "unavailable", windows: [] }, translate })
                        : react_jsx_runtime.jsx(BalanceContent, { balance: account?.balance ?? null, state: balanceState, message: balanceMessage, translate, onRetry })
                ]
            });
        }

        /**
         * One day's per-model breakdown. `day` is the wire day entry carrying
         * `tokens`, `cacheHitRate`, and `models` (descending by tokens).
         */
        function DayDetail({ day, translate, onBack }) {
            const models = Array.isArray(day.models) ? day.models : [];
            const totalTokens = day.tokens ?? 0;
            return react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
                children: [
                    react_jsx_runtime.jsxs("div", {
                        className: S.detailHeader,
                        children: [
                            react_jsx_runtime.jsx("button", {
                                type: "button",
                                className: S.back,
                                "aria-label": translate("usage.back"),
                                onClick: onBack,
                                children: react_jsx_runtime.jsx(primitives.IconChevronLeftOutline14, { size: 14 })
                            }),
                            react_jsx_runtime.jsx("span", { className: S.detailDate, children: dayLabel(day.date, translate) }),
                            react_jsx_runtime.jsx("span", { className: S.detailHit, children: `${translate("usage.hitRate")} ${fmtHit(day.cacheHitRate)}` })
                        ]
                    }),
                    react_jsx_runtime.jsx("p", {
                        className: S.detailSummary,
                        children: `${translate("usage.total")} ${fmt(totalTokens)} · ${translate("usage.input")} ${fmt(day.inputTokens ?? 0)} · ${translate("usage.output")} ${fmt(day.outputTokens ?? 0)} · ${translate("usage.cacheRead")} ${fmt(day.cacheReadTokens ?? 0)}`
                    }),
                    react_jsx_runtime.jsx("div", {
                        className: S.days,
                        children: models.length === 0 ? react_jsx_runtime.jsx("p", { className: S.note, children: translate("usage.noModels") }) : models.map((model) => {
                            const share = totalTokens > 0 ? Math.max(3, Math.round(100 * (model.tokens ?? 0) / totalTokens)) : 0;
                            return react_jsx_runtime.jsxs("div", {
                                className: S.modelRow,
                                children: [
                                    react_jsx_runtime.jsxs("div", {
                                        className: S.modelHead,
                                        children: [
                                            react_jsx_runtime.jsx("span", { className: S.modelName, title: model.model, children: modelLabelOf(model.model, translate) }),
                                            react_jsx_runtime.jsx("span", { className: S.modelTokens, children: fmt(model.tokens ?? 0) }),
                                            react_jsx_runtime.jsx("span", { className: S.modelHit, children: fmtHit(model.cacheHitRate) })
                                        ]
                                    }),
                                    react_jsx_runtime.jsx("div", {
                                        className: S.modelBarTrack,
                                        children: react_jsx_runtime.jsx("div", { className: S.modelBar, style: { width: `${share}%` } })
                                    }),
                                    react_jsx_runtime.jsx("div", {
                                        className: S.modelMeta,
                                        children: `${translate("usage.input")} ${fmt(model.inputTokens ?? 0)} · ${translate("usage.output")} ${fmt(model.outputTokens ?? 0)} · ${translate("usage.cacheRead")} ${fmt(model.cacheReadTokens ?? 0)}`
                                    })
                                ]
                            }, model.model);
                        })
                    })
                ]
            });
        }

        /**
         * Codex-style blue calendar heatmap for one month: weekday header row,
         * weeks as rows (Mon-first), padded with placeholders. Cells are buttons
         * that select a day.
         */
        function MonthHeatmap({ heat, translate, selectedKey, onSelect }) {
            const select = typeof onSelect === "function" ? onSelect : () => {};
            const weekdayLabels = [
                translate("weekday.mon"),
                translate("weekday.tue"),
                translate("weekday.wed"),
                translate("weekday.thu"),
                translate("weekday.fri"),
                translate("weekday.sat"),
                translate("weekday.sun")
            ];
            return react_jsx_runtime.jsxs("div", {
                className: S.heat,
                children: [
                    react_jsx_runtime.jsxs("div", {
                        className: S.monthGrid,
                        children: [
                            react_jsx_runtime.jsx("div", {
                                className: S.weekHeader,
                                children: weekdayLabels.map((label) => react_jsx_runtime.jsx("span", { className: S.weekLabel, children: label }, label))
                            }),
                            heat.weeks.map((week, weekIndex) => react_jsx_runtime.jsx("div", {
                                className: S.heatRow,
                                children: week.map((cell, dayIndex) => {
                                    if (cell === null) return react_jsx_runtime.jsx("span", { className: S.emptyCell, "aria-hidden": true }, `${weekIndex}-${dayIndex}`);
                                    const style = cellColor(cell.tokens, heat.max);
                                    const hit = cell.hitRate === null || cell.hitRate === void 0 ? "" : ` · ${translate("usage.hitRate")} ${cell.hitRate}%`;
                                    const isToday = cell.key === todayKey();
                                    return react_jsx_runtime.jsx("button", {
                                        type: "button",
                                        className: `${S.cell}${isToday ? ` ${S.cellToday}` : ""}${selectedKey === cell.key ? ` ${S.cellSelected}` : ""}`,
                                        style: { background: style.background, color: style.color },
                                        title: `${cell.key} · ${fmt(cell.tokens)} tokens${hit}`,
                                        "aria-label": `${cell.key} · ${fmt(cell.tokens)} tokens`,
                                        onClick: () => select(cell.key),
                                        children: react_jsx_runtime.jsx("span", { className: S.cellDay, children: cell.day })
                                    }, cell.key);
                                })
                            }, weekIndex))
                        ]
                    }),
                    react_jsx_runtime.jsxs("div", {
                        className: S.legend,
                        children: [
                            react_jsx_runtime.jsx("span", { children: translate("usage.legendLess") }),
                            [0.22, 0.42, 0.6, 0.8, 1].map((alpha, index) => react_jsx_runtime.jsx("span", {
                                className: S.legendSwatch,
                                style: { background: `color-mix(in srgb, var(--usg-blue) ${Math.round(alpha * 100)}%, transparent)` }
                            }, index)),
                            react_jsx_runtime.jsx("span", { children: translate("usage.legendMore") })
                        ]
                    })
                ]
            });
        }

        /** `YYYY-MM-DD` → `MM-DD 周X` display label. */
        function dayLabel(key, translate) {
            const [, month, day] = key.split("-");
            const date = new Date(Number(key.slice(0, 4)), Number(month) - 1, Number(day));
            const weekdays = [translate("weekday.sun"), translate("weekday.mon"), translate("weekday.tue"), translate("weekday.wed"), translate("weekday.thu"), translate("weekday.fri"), translate("weekday.sat")];
            return `${month}-${day} ${weekdays[date.getDay()]}`;
        }

        function monthName(month, translate) {
            const names = translate("month.names").split(",");
            return names[month] ?? String(month + 1);
        }

        /**
         * Display label for a `provider/model` attribution key (the same model
         * served by different providers must stay distinguishable).
         */
        function modelLabelOf(key, translate) {
            if (typeof key !== "string") return "";
            const slash = key.indexOf("/");
            if (slash === -1) return key;
            const provider = key.slice(0, slash);
            const model = key.slice(slash + 1);
            const providerLabel = provider === "unknown" ? translate("usage.unknownModel") : provider;
            const modelLabel = model === "unknown" || model === "" ? translate("usage.unknownModel") : model;
            return `${providerLabel} · ${modelLabel}`;
        }
        //#endregion

        //#region locales
        /** `usageStats` namespace dictionaries (the zh key set is the source of truth). */
        const NS = "usageStats";
        const zh = {
            "panel.title": "用量与余额",
            "panel.badge": "用量/余额",
            "tab.balance": "用量与余额",
            "tab.overview": "概览",
            "tab.usage": "用量",
            "tab.calls": "调用记录",
            "tab.prices": "价格",
            "account.title": "供应商账户",
            "account.provider": "当前供应商",
            "account.balanceMode": "API 余额",
            "account.loading": "正在加载供应商…",
            "account.status.loading": "查询中",
            "account.status.blocked": "已阻止",
            "account.status.unsupported": "不支持余额",
            "account.status.invalidResponse": "响应异常",
            "account.invalidResponse": "供应商返回了无法识别的额度数据。",
            "account.blocked": "账户查询被本地安全策略阻止，请检查 HTTPS、同源和私网访问设置。",
            "balance.title": "账户余额",
            "balance.provider": "供应商",
            "balance.noSchemeTag": "无余额接口",
            "balance.unsupported": "该供应商没有公开的余额查询接口。",
            "balance.total": "总余额",
            "balance.remaining": "可用余额",
            "balance.used": "已使用",
            "balance.toppedUp": "充值余额",
            "balance.granted": "赠送余额",
            "balance.available": "可用",
            "balance.unavailable": "不可用",
            "balance.loading": "正在查询余额…",
            "balance.noCredential": "未配置 {ref}（请编辑 ~/.dsh/.credentials.yaml）",
            "balance.error": "余额获取失败：{message}",
            "subscription.title": "订阅额度",
            "subscription.loading": "正在查询订阅额度…",
            "subscription.error": "订阅额度获取失败：{message}",
            "subscription.status.ok": "实时",
            "subscription.status.notConfigured": "未配置",
            "subscription.status.unauthorized": "需重新登录",
            "subscription.status.rateLimited": "请求受限",
            "subscription.status.unavailable": "暂不可用",
            "subscription.window.session": "5 小时窗口",
            "subscription.window.daily": "每日窗口",
            "subscription.window.weekly": "每周窗口",
            "subscription.window.monthly": "每月窗口",
            "subscription.window.quota": "总额度",
            "subscription.window.mcp": "MCP 月度额度",
            "subscription.used": "已用 {value}%",
            "subscription.resets": "{time} 重置",
            "subscription.notConfigured": "配置 {refs} 后显示真实订阅比例。",
            "subscription.unauthorized": "凭据已失效，请更新后重试。",
            "subscription.rateLimited": "供应商暂时限制查询，请稍后重试。",
            "subscription.unavailable": "供应商没有返回可识别的额度窗口。",
            "subscription.planUnknown": "订阅计划",
            "usage.title": "Token 用量",
            "usage.today": "今日",
            "usage.month": "本月",
            "usage.total": "累计",
            "usage.cacheHits": "缓存命中",
            "usage.hitRatePct": "缓存命中率",
            "usage.todayCost": "今日消耗",
            "usage.loading": "正在统计用量…",
            "usage.error": "用量统计失败：{message}",
            "usage.heatmap": "当月每日用量",
            "usage.recent": "最近 14 天",
            "usage.legendLess": "少",
            "usage.legendMore": "多",
            "usage.back": "返回",
            "usage.hitRate": "缓存命中",
            "usage.hit.today": "今日缓存命中率",
            "usage.input": "输入",
            "usage.output": "输出",
            "usage.cacheRead": "缓存读",
            "usage.unknownModel": "未知模型",
            "usage.noModels": "这一天没有分模型数据。",
            "month.year": "{year}年{month}",
            "action.refresh": "刷新",
            "action.retry": "重试",
            "action.close": "关闭",
            "action.prevMonth": "上个月",
            "action.nextMonth": "下个月",
            "action.today": "回到今天",
            "panel.updatedAt": "更新于 {time}",
            "weekday.mon": "一",
            "weekday.tue": "二",
            "weekday.wed": "三",
            "weekday.thu": "四",
            "weekday.fri": "五",
            "weekday.sat": "六",
            "weekday.sun": "日",
            "month.names": "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月"
        };
        const en = {
            "panel.title": "Usage & Balance",
            "panel.badge": "Usage/Balance",
            "tab.balance": "Usage & Balance",
            "tab.overview": "Overview",
            "tab.usage": "Usage",
            "tab.calls": "Call log",
            "tab.prices": "Prices",
            "account.title": "Provider account",
            "account.provider": "Current provider",
            "account.balanceMode": "API balance",
            "account.loading": "Loading providers…",
            "account.status.loading": "Loading",
            "account.status.blocked": "Blocked",
            "account.status.unsupported": "Balance unsupported",
            "account.status.invalidResponse": "Invalid response",
            "account.invalidResponse": "The provider returned unrecognized quota data.",
            "account.blocked": "The account query was blocked by the local security policy. Check HTTPS, same-origin, and private-network settings.",
            "balance.title": "Account balance",
            "balance.provider": "Provider",
            "balance.noSchemeTag": "no balance API",
            "balance.unsupported": "This provider has no public balance interface.",
            "balance.total": "Total balance",
            "balance.remaining": "Available balance",
            "balance.used": "Used",
            "balance.toppedUp": "Topped up",
            "balance.granted": "Granted",
            "balance.available": "available",
            "balance.unavailable": "unavailable",
            "balance.loading": "Fetching balance…",
            "balance.noCredential": "{ref} is not configured (edit ~/.dsh/.credentials.yaml)",
            "balance.error": "Balance fetch failed: {message}",
            "subscription.title": "Subscription usage",
            "subscription.loading": "Fetching subscription usage…",
            "subscription.error": "Subscription usage failed: {message}",
            "subscription.status.ok": "Live",
            "subscription.status.notConfigured": "Not configured",
            "subscription.status.unauthorized": "Sign in again",
            "subscription.status.rateLimited": "Rate limited",
            "subscription.status.unavailable": "Unavailable",
            "subscription.window.session": "5-hour window",
            "subscription.window.daily": "Daily window",
            "subscription.window.weekly": "Weekly window",
            "subscription.window.monthly": "Monthly window",
            "subscription.window.quota": "Total quota",
            "subscription.window.mcp": "Monthly MCP quota",
            "subscription.used": "{value}% used",
            "subscription.resets": "Resets {time}",
            "subscription.notConfigured": "Configure {refs} to show live subscription usage.",
            "subscription.unauthorized": "The credential has expired; update it and retry.",
            "subscription.rateLimited": "The provider is rate limiting checks; retry later.",
            "subscription.unavailable": "The provider returned no recognizable quota windows.",
            "subscription.planUnknown": "Subscription plan",
            "usage.title": "Token usage",
            "usage.today": "Today",
            "usage.month": "This month",
            "usage.total": "All time",
            "usage.cacheHits": "Cache hits",
            "usage.hitRatePct": "Hit rate",
            "usage.todayCost": "Today's cost",
            "usage.loading": "Aggregating usage…",
            "usage.error": "Usage aggregation failed: {message}",
            "usage.heatmap": "Daily usage this month",
            "usage.recent": "Last 14 days",
            "usage.legendLess": "Less",
            "usage.legendMore": "More",
            "usage.back": "Back",
            "usage.hitRate": "Cache hit",
            "usage.hit.today": "Today's cache hit rate",
            "usage.input": "Input",
            "usage.output": "Output",
            "usage.cacheRead": "Cache read",
            "usage.unknownModel": "Unknown model",
            "usage.noModels": "No per-model data for this day.",
            "month.year": "{month} {year}",
            "action.refresh": "Refresh",
            "action.retry": "Retry",
            "action.close": "Close",
            "action.prevMonth": "Previous month",
            "action.nextMonth": "Next month",
            "action.today": "Today",
            "panel.updatedAt": "Updated at {time}",
            "weekday.mon": "M",
            "weekday.tue": "T",
            "weekday.wed": "W",
            "weekday.thu": "T",
            "weekday.fri": "F",
            "weekday.sat": "S",
            "weekday.sun": "S",
            "month.names": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
        };
        //#endregion

    // ── plugin ──
    var inject = ["slots", "locale"];

    function apply(ctx) {
      var slots = (ctx.get && ctx.get("slots")) || ctx.slots;
      var locale = (ctx.get && ctx.get("locale")) || ctx.locale;
      var timer = ctx.get && ctx.get("timer");
      if (slots === undefined) return;

      if (!ctx.slots) ctx.slots = slots;
      if (locale && !ctx.locale) ctx.locale = locale;
      if (typeof ctx.effect !== "function") ctx.effect = function (fn) { return fn(); };
      if (ctx.locale) {
        ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }); }, "usage-stats: dictionaries");
      }
      ctx.slots.inject("sidebar.footer.action", function () {
        return ctx.slots.register({
          name: "sidebar.footer.action",
          id: "usage-stats",
          locale: NS,
          order: 10
        }, function (slotProps) {
          return el(UsageStatsPanel, { wide: slotProps.wide, t: slotProps.t, timer: timer });
        });
      });
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
