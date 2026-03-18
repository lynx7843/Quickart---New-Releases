import { useState, useEffect } from "react";
import {
  Home, Globe, Wallet, TrendingUp, Bell, Plus, X,
  Activity, Clock, BarChart3, Search, Zap, Info,
  Trash2, FileText, AlertCircle, CheckCircle
} from "lucide-react";

const CATS = ["Food", "Fuel", "Transport", "Health", "Shopping", "Bills", "Data", "Other"];
const INC_CATS = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];
const CAT_COLORS = {
  Food: "#f59e0b", Fuel: "#ef4444", Transport: "#3b82f6",
  Health: "#10b981", Shopping: "#8b5cf6", Bills: "#f97316",
  Data: "#06b6d4", Other: "#6b7280",
  Salary: "#10b981", Freelance: "#3b82f6", Business: "#8b5cf6",
  Investment: "#f59e0b", Gift: "#ec4899"
};

const fmt = (n) => Number(n).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentTime, setCurrentTime] = useState(new Date());
  const dayStartTime = new Date(new Date().setHours(6, 0, 0, 0));

  const [expenses, setExpenses] = useState([
    { id: 1, time: new Date(new Date().setHours(7, 30, 0, 0)), cat: "Food", desc: "Breakfast", amt: 450 },
    { id: 2, time: new Date(new Date().setHours(8, 45, 0, 0)), cat: "Fuel", desc: "Petrol fill", amt: 2500 },
    { id: 3, time: new Date(new Date().setHours(11, 20, 0, 0)), cat: "Data", desc: "Data Bundle", amt: 990 },
  ]);
  const [incomes, setIncomes] = useState([
    { id: 1, time: new Date(new Date().setHours(9, 0, 0, 0)), cat: "Salary", desc: "Daily wages", amt: 5000 },
    { id: 2, time: new Date(new Date().setHours(14, 0, 0, 0)), cat: "Freelance", desc: "Design work", amt: 2500 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState("expense");
  const [newEntry, setNewEntry] = useState({ cat: "", desc: "", amt: "" });
  const [showReport, setShowReport] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("day");
  const [notifications, setNotifications] = useState([
    { id: 1, msg: "Daily spend crossed LKR 3,500", type: "warn", read: false },
    { id: 2, msg: "Income logged: LKR 5,000 (Salary)", type: "success", read: false },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const [walletSubTab, setWalletSubTab] = useState("today");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hoursElapsed = Math.max((currentTime - dayStartTime) / 3600000, 0.01);
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amt, 0);
  const netBalance = totalIncome - totalSpent;
  const burnRate = totalSpent / hoursElapsed;
  const unreadNotif = notifications.filter((n) => !n.read).length;

  const monthExpenses = [
    ...expenses,
    { id: 10, time: new Date(new Date().setDate(1)), cat: "Bills", desc: "Electricity", amt: 14500 },
    { id: 11, time: new Date(new Date().setDate(5)), cat: "Food", desc: "Groceries", amt: 8200 },
    { id: 12, time: new Date(new Date().setDate(10)), cat: "Health", desc: "Pharmacy", amt: 3200 },
    { id: 13, time: new Date(new Date().setDate(15)), cat: "Shopping", desc: "Clothing", amt: 6500 },
  ];
  const monthIncomes = [
    ...incomes,
    { id: 20, time: new Date(new Date().setDate(1)), cat: "Salary", desc: "Monthly salary", amt: 120000 },
    { id: 21, time: new Date(new Date().setDate(10)), cat: "Freelance", desc: "Project payment", amt: 35000 },
  ];
  const monthTotalExp = monthExpenses.reduce((s, e) => s + e.amt, 0);
  const monthTotalInc = monthIncomes.reduce((s, i) => s + i.amt, 0);

  const handleAdd = () => {
    if (!newEntry.cat || !newEntry.amt) return;
    const entry = {
      id: Date.now(),
      time: new Date(),
      cat: newEntry.cat,
      desc: newEntry.desc || newEntry.cat,
      amt: parseFloat(newEntry.amt),
    };
    if (addType === "expense") {
      setExpenses((p) => [...p, entry]);
      setNotifications((p) => [
        { id: Date.now(), msg: `Expense: Rs.${entry.amt} on ${entry.cat}`, type: totalSpent + entry.amt > 4000 ? "warn" : "info", read: false },
        ...p,
      ]);
    } else {
      setIncomes((p) => [...p, entry]);
      setNotifications((p) => [
        { id: Date.now(), msg: `Income added: Rs.${entry.amt} (${entry.cat})`, type: "success", read: false },
        ...p,
      ]);
    }
    setNewEntry({ cat: "", desc: "", amt: "" });
    setShowAddModal(false);
  };

  const economicRates = { fuel: 345.5, fuelChg: 12.0, gold: "215k", goldChg: -450, usd: 312.45, usdChg: 0.25 };
  const globalCrises = [
    { id: 1, event: "Red Sea Maritime Tensions", impact: "High", govtEffect: 18.5, desc: "Increased freight costs leading to 12% rise in import duties.", category: "Logistics" },
    { id: 2, event: "Global Semiconductor Shortage", impact: "Medium", govtEffect: 7.2, desc: "Tech export slowdown affecting tax revenue from IT sector.", category: "Trade" },
    { id: 3, event: "Oil Production Cuts (OPEC+)", impact: "Critical", govtEffect: 24.1, desc: "Direct pressure on CPC subsidies and foreign reserves.", category: "Energy" },
  ];
  const investmentRates = [
    { entity: "Sampath Bank", type: "FD (1yr)", rate: 11.5, safety: "High" },
    { entity: "Commercial Bank", type: "FD (1yr)", rate: 11.2, safety: "High" },
    { entity: "HNB", type: "Savings", rate: 8.5, safety: "High" },
    { entity: "AIA Insurance", type: "Wealth", rate: 14.2, safety: "Moderate" },
    { entity: "SLIC", type: "Life Plus", rate: 13.8, safety: "High" },
    { entity: "Softlogic Life", type: "Invest", rate: 15.1, safety: "Moderate" },
  ];

  const C = {
    bg: "#050d1a",
    card: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.07)",
    glowCard: "rgba(100,255,218,0.04)",
    glowBorder: "rgba(100,255,218,0.13)",
    teal: "#64ffda",
    pink: "#ff6b9d",
    text: "rgba(255,255,255,0.85)",
    muted: "rgba(255,255,255,0.35)",
    faint: "rgba(255,255,255,0.06)",
  };

  // ── REPORT ──
  const ReportView = () => {
    const d = reportPeriod === "day"
      ? { exps: expenses, incs: incomes, totalE: totalSpent, totalI: totalIncome }
      : { exps: monthExpenses, incs: monthIncomes, totalE: monthTotalExp, totalI: monthTotalInc };
    const net = d.totalI - d.totalE;
    const allEntries = [
      ...d.exps.map((e) => ({ ...e, kind: "expense" })),
      ...d.incs.map((i) => ({ ...i, kind: "income" })),
    ].sort((a, b) => b.time - a.time);
    const expByCat = {};
    d.exps.forEach((e) => { expByCat[e.cat] = (expByCat[e.cat] || 0) + e.amt; });

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "linear-gradient(160deg,#050d1a,#071525)" }}>
        <div className="flex items-center justify-between px-5 pt-10 pb-4">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-0.5" style={{ color: C.teal }}>Financial Report</p>
            <h2 className="text-2xl font-black text-white">{reportPeriod === "day" ? "Today's Summary" : "Monthly Overview"}</h2>
          </div>
          <button onClick={() => setShowReport(false)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.faint }}>
            <X size={18} color="white" />
          </button>
        </div>

        <div className="px-5 mb-4">
          <div className="flex rounded-2xl p-1" style={{ background: C.faint }}>
            {["day", "month"].map((p) => (
              <button key={p} onClick={() => setReportPeriod(p)}
                className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                style={reportPeriod === p ? { background: C.teal, color: "#0a0f1e" } : { color: C.muted }}>
                {p === "day" ? "Daily" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10" style={{ scrollbarWidth: "none" }}>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Income", val: d.totalI, color: C.teal },
              { label: "Expense", val: d.totalE, color: C.pink },
              { label: "Net", val: net, color: net >= 0 ? C.teal : C.pink },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl p-3" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: C.muted }}>{card.label}</p>
                <p className="text-xs font-black leading-tight" style={{ color: card.color }}>
                  {net < 0 && card.label === "Net" ? "-" : ""}Rs.{fmt(Math.abs(card.val))}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] p-5 mb-4" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: C.teal }}>Expense Breakdown</p>
            <div className="space-y-3">
              {Object.entries(expByCat).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[cat] || "#6b7280" }}></div>
                      <span className="text-xs font-bold text-white">{cat}</span>
                    </div>
                    <span className="text-xs font-black" style={{ color: C.pink }}>Rs.{fmt(amt)}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(amt / d.totalE) * 100}%`, background: CAT_COLORS[cat] || "#6b7280" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: C.teal }}>Transaction Log</p>
            <div className="space-y-2">
              {allEntries.map((entry) => (
                <div key={`${entry.id}-${entry.kind}`} className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                      style={{ background: entry.kind === "income" ? "rgba(100,255,218,0.1)" : "rgba(255,107,157,0.1)", color: entry.kind === "income" ? C.teal : C.pink }}>
                      {entry.kind === "income" ? "+" : "-"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{entry.desc}</p>
                      <p className="text-[9px]" style={{ color: C.muted }}>{entry.cat} · {entry.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black" style={{ color: entry.kind === "income" ? C.teal : C.pink }}>
                    {entry.kind === "income" ? "+" : "-"}Rs.{fmt(entry.amt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── ADD MODAL ──
  const AddModal = () => (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-[400px] rounded-t-[2.5rem] p-6 pb-10" style={{ background: "#0d1a2e", border: "1px solid rgba(100,255,218,0.15)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white">Add Entry</h3>
          <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.faint }}>
            <X size={16} color="white" />
          </button>
        </div>
        <div className="flex rounded-2xl p-1 mb-5" style={{ background: C.faint }}>
          {["expense", "income"].map((t) => (
            <button key={t} onClick={() => { setAddType(t); setNewEntry({ cat: "", desc: "", amt: "" }); }}
              className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              style={addType === t ? { background: t === "expense" ? C.pink : C.teal, color: "#0a0f1e" } : { color: C.muted }}>
              {t === "expense" ? "💸 Expense" : "💰 Income"}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: C.muted }}>Category</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(addType === "expense" ? CATS : INC_CATS).map((c) => (
            <button key={c} onClick={() => setNewEntry((p) => ({ ...p, cat: c }))}
              className="py-2.5 rounded-xl text-[10px] font-black transition-all"
              style={newEntry.cat === c ? { background: CAT_COLORS[c], color: "white" } : { background: "rgba(255,255,255,0.06)", color: C.muted }}>
              {c}
            </button>
          ))}
        </div>
        <input value={newEntry.desc} onChange={(e) => setNewEntry((p) => ({ ...p, desc: e.target.value }))}
          placeholder="Description (optional)"
          className="w-full rounded-xl px-4 py-3 text-sm text-white mb-3 outline-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }} />
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-sm font-black" style={{ color: addType === "expense" ? C.pink : C.teal }}>Rs.</span>
          <input type="number" value={newEntry.amt} onChange={(e) => setNewEntry((p) => ({ ...p, amt: e.target.value }))}
            placeholder="0.00" className="flex-1 text-sm font-black text-white outline-none bg-transparent" />
        </div>
        <button onClick={handleAdd} className="w-full py-4 rounded-2xl font-black text-sm"
          style={{ background: addType === "expense" ? C.pink : C.teal, color: "#0a0f1e" }}>
          Add {addType === "expense" ? "Expense" : "Income"}
        </button>
      </div>
    </div>
  );

  // ── NOTIF PANEL ──
  const NotifPanel = () => (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16" style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => setShowNotif(false)}>
      <div className="w-full max-w-[390px] mx-4 rounded-[2rem] p-5" style={{ background: "#0d1a2e", border: "1px solid rgba(100,255,218,0.15)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-white">Notifications</h3>
          <button onClick={() => { setNotifications((p) => p.map((n) => ({ ...n, read: true }))); setShowNotif(false); }}
            className="text-[10px] font-black uppercase tracking-wider" style={{ color: C.teal }}>Mark all read</button>
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {notifications.length === 0 && <p className="text-xs text-center py-4" style={{ color: C.muted }}>No notifications</p>}
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: n.read ? "rgba(255,255,255,0.02)" : "rgba(100,255,218,0.06)", border: n.read ? "1px solid transparent" : "1px solid rgba(100,255,218,0.12)" }}>
              {n.type === "warn" ? <AlertCircle size={14} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                : n.type === "success" ? <CheckCircle size={14} color={C.teal} className="flex-shrink-0 mt-0.5" />
                : <Info size={14} color="#60a5fa" className="flex-shrink-0 mt-0.5" />}
              <p className="text-xs font-medium" style={{ color: n.read ? C.muted : C.text }}>{n.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-4" style={{ background: "#020810" }}>
      <div className="fixed pointer-events-none" style={{ top: "5%", left: "8%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(100,255,218,0.05) 0%,transparent 70%)", filter: "blur(40px)" }} />
      <div className="fixed pointer-events-none" style={{ bottom: "8%", right: "5%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)", filter: "blur(40px)" }} />

      <div className="w-full max-w-[400px] h-[860px] rounded-[3rem] relative overflow-hidden flex flex-col"
        style={{ background: "linear-gradient(160deg,#050d1a 0%,#071525 50%,#060f1d 100%)", border: "8px solid #0d1f35", boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)" }}>

        {/* Status */}
        <div className="flex justify-between items-center px-7 pt-3 pb-1">
          <span className="text-xs font-black text-white">{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-1.5 rounded-full" style={{ background: C.teal }} />
            <div className="w-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>

        {/* Header */}
        <header className="px-5 py-3 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h1 className="text-xl font-black tracking-tight italic" style={{ color: "white" }}>
              ECONO<span style={{ color: C.teal }}>SMART</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.teal, animation: "pulse 2s infinite" }} />
              <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: C.muted }}>Live · Colombo</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.faint }}>
              <Search size={16} color={C.muted} />
            </button>
            <div className="relative">
              <button onClick={() => setShowNotif(true)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.faint }}>
                <Bell size={16} color={C.muted} />
              </button>
              {unreadNotif > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white" style={{ background: C.pink }}>{unreadNotif}</span>
              )}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto px-4 pb-28" style={{ scrollbarWidth: "none" }}>

          {/* HOME */}
          {activeTab === "home" && (
            <div className="pt-4 space-y-5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "92 Octane", val: `${economicRates.fuel}`, chg: `+${economicRates.fuelChg}%`, up: true },
                  { label: "Gold 24k", val: economicRates.gold, chg: `${economicRates.goldChg}`, up: false },
                  { label: "USD/LKR", val: `${economicRates.usd}`, chg: `+${economicRates.usdChg}`, up: true },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl p-3" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: C.muted }}>{item.label}</p>
                    <p className="text-sm font-black text-white">{item.val}</p>
                    <span className="text-[9px] font-bold" style={{ color: item.up ? C.pink : C.teal }}>{item.chg} {item.up ? "↑" : "↓"}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] p-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,rgba(100,255,218,0.07),rgba(99,102,241,0.05))", border: `1px solid ${C.glowBorder}` }}>
                <div className="absolute top-0 right-0 opacity-5"><Clock size={90} color="white" /></div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: C.teal }}>Today's Net Burn</p>
                <h2 className="text-3xl font-black text-white mb-4">LKR {fmt(totalSpent)}</h2>
                <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Avg/Hour</p>
                    <p className="text-sm font-black text-white">LKR {burnRate.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Elapsed</p>
                    <p className="text-sm font-black text-white">{hoursElapsed.toFixed(1)} hrs</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-white text-base">Fiscal Vulnerability</h3>
                  <Zap size={14} color="#f59e0b" fill="#f59e0b" />
                </div>
                <div className="rounded-[2rem] p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                  <p className="text-[10px] mb-5" style={{ color: C.muted }}>Govt Expense Pressure by Crisis (%)</p>
                  <div className="space-y-5">
                    {globalCrises.map((c) => (
                      <div key={c.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black text-white">{c.event}</span>
                          <span className="text-xs font-black" style={{ color: c.govtEffect > 20 ? C.pink : "#f59e0b" }}>{c.govtEffect}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${c.govtEffect}%`, background: c.govtEffect > 20 ? C.pink : C.teal }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 p-3 rounded-2xl flex gap-2" style={{ background: "rgba(99,102,241,0.1)" }}>
                    <Info size={14} color="#818cf8" className="flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed" style={{ color: "#a5b4fc" }}>Energy sector pressure suggests policy adjustments in Q2 2026 budget cycle.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CRISIS */}
          {activeTab === "crisis" && (
            <div className="pt-5 space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white">Global Crisis Lab</h2>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>World events mapped to SL economy</p>
              </div>
              {globalCrises.map((n) => (
                <div key={n.id} className="rounded-[2rem] p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.06)", color: C.muted }}>{n.category}</span>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black" style={n.impact === "Critical" ? { background: "rgba(255,107,157,0.15)", color: C.pink } : { background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>{n.impact}</span>
                  </div>
                  <h3 className="font-black text-white text-base mb-2 leading-tight">{n.event}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{n.desc}</p>
                  <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Reserve Impact</p>
                      <p className="text-xs font-black" style={{ color: C.pink }}>-$450M Est.</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Response</p>
                      <p className="text-xs font-black" style={{ color: C.teal }}>Active Monitor</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INVEST */}
          {activeTab === "invest" && (
            <div className="pt-5">
              <h2 className="text-2xl font-black text-white mb-1">Investment Matrix</h2>
              <p className="text-xs mb-5" style={{ color: C.muted }}>Banks vs Insurance Comparison</p>
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {["All", "Banks", "Insurance", "Treasury"].map((cat) => (
                  <button key={cat} className="px-4 py-2 rounded-full text-xs font-black whitespace-nowrap"
                    style={cat === "All" ? { background: C.teal, color: "#0a0f1e" } : { background: C.faint, color: C.muted, border: `1px solid ${C.cardBorder}` }}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-3 mb-6">
                {investmentRates.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl flex items-center justify-between" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                    <div>
                      <h4 className="font-black text-white text-sm">{item.entity}</h4>
                      <p className="text-[9px] font-bold uppercase tracking-tighter mt-0.5" style={{ color: C.muted }}>{item.type} · {item.safety}</p>
                    </div>
                    <p className="text-xl font-black" style={{ color: C.teal }}>{item.rate}%</p>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-[2rem]" style={{ background: "linear-gradient(135deg,rgba(100,255,218,0.07),rgba(99,102,241,0.05))", border: `1px solid ${C.glowBorder}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(100,255,218,0.12)" }}>
                    <BarChart3 size={18} color={C.teal} />
                  </div>
                  <h4 className="font-black text-white">Smart Allocator AI</h4>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Conditions favor <span className="text-white font-bold">Insurance Wealth Plans</span> this month due to stabilizing inflation in SL.
                </p>
                <button className="w-full py-3.5 rounded-xl font-black text-sm" style={{ background: C.teal, color: "#0a0f1e" }}>
                  Generate Portfolio Plan
                </button>
              </div>
            </div>
          )}

          {/* WALLET */}
          {activeTab === "wallet" && (
            <div className="pt-4 space-y-4">
              {/* Time Bar */}
              <div className="rounded-[2rem] p-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,rgba(100,255,218,0.07),rgba(99,102,241,0.04))", border: `1px solid ${C.glowBorder}` }}>
                <div className="grid grid-cols-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Day Start</p>
                    <p className="text-sm font-black text-white">{dayStartTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Now</p>
                    <p className="text-sm font-black" style={{ color: C.teal }}>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Elapsed</p>
                    <p className="text-sm font-black text-white">{hoursElapsed.toFixed(1)}h</p>
                  </div>
                </div>
                {/* Progress bar for day */}
                <div className="mt-4 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((hoursElapsed / 18) * 100, 100)}%`, background: `linear-gradient(90deg,${C.teal},#3b82f6)` }} />
                </div>
                <p className="text-[9px] mt-1 text-center font-bold" style={{ color: C.muted }}>{Math.min(((hoursElapsed / 18) * 100), 100).toFixed(0)}% of day used</p>
              </div>

              {/* Balance Row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Income", val: totalIncome, color: C.teal },
                  { label: "Spent", val: totalSpent, color: C.pink },
                  { label: "Net", val: Math.abs(netBalance), color: netBalance >= 0 ? C.teal : C.pink },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: C.muted }}>{card.label}</p>
                    <p className="text-[11px] font-black leading-tight" style={{ color: card.color }}>
                      Rs.{(card.val / 1000).toFixed(1)}k
                    </p>
                  </div>
                ))}
              </div>

              {/* Sub Tabs */}
              <div className="flex rounded-2xl p-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                {[{ id: "today", label: "Today" }, { id: "month", label: "Month" }].map((t) => (
                  <button key={t.id} onClick={() => setWalletSubTab(t.id)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    style={walletSubTab === t.id ? { background: C.teal, color: "#0a0f1e" } : { color: C.muted }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Add Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setAddType("expense"); setShowAddModal(true); }}
                  className="py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs"
                  style={{ background: "rgba(255,107,157,0.1)", border: "1px solid rgba(255,107,157,0.2)", color: C.pink }}>
                  <Plus size={14} /> Add Expense
                </button>
                <button onClick={() => { setAddType("income"); setShowAddModal(true); }}
                  className="py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs"
                  style={{ background: "rgba(100,255,218,0.07)", border: `1px solid ${C.glowBorder}`, color: C.teal }}>
                  <Plus size={14} /> Add Income
                </button>
              </div>

              {/* TODAY */}
              {walletSubTab === "today" && (
                <div className="space-y-5">
                  {/* Expenses List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.pink }}>💸 Expenses</p>
                      <p className="text-xs font-black text-white">Rs. {fmt(totalSpent)}</p>
                    </div>
                    {expenses.length === 0 && <p className="text-xs text-center py-4" style={{ color: C.muted }}>No expenses yet</p>}
                    <div className="space-y-2">
                      {expenses.map((e) => (
                        <div key={e.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0"
                            style={{ background: `${CAT_COLORS[e.cat] || "#6b7280"}22`, color: CAT_COLORS[e.cat] || "#6b7280" }}>
                            {e.cat[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{e.desc}</p>
                            <p className="text-[9px] font-bold" style={{ color: C.muted }}>{e.cat} · {e.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <p className="text-xs font-black" style={{ color: C.pink }}>-Rs.{fmt(e.amt)}</p>
                          <button onClick={() => setExpenses((p) => p.filter((x) => x.id !== e.id))} className="opacity-25 hover:opacity-60 ml-1">
                            <Trash2 size={12} color={C.pink} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Income List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.teal }}>💰 Income</p>
                      <p className="text-xs font-black text-white">Rs. {fmt(totalIncome)}</p>
                    </div>
                    {incomes.length === 0 && <p className="text-xs text-center py-4" style={{ color: C.muted }}>No income yet</p>}
                    <div className="space-y-2">
                      {incomes.map((i) => (
                        <div key={i.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0"
                            style={{ background: `${CAT_COLORS[i.cat] || C.teal}22`, color: CAT_COLORS[i.cat] || C.teal }}>
                            {i.cat[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{i.desc}</p>
                            <p className="text-[9px] font-bold" style={{ color: C.muted }}>{i.cat} · {i.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <p className="text-xs font-black" style={{ color: C.teal }}>+Rs.{fmt(i.amt)}</p>
                          <button onClick={() => setIncomes((p) => p.filter((x) => x.id !== i.id))} className="opacity-25 hover:opacity-60 ml-1">
                            <Trash2 size={12} color={C.teal} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Burn Rate Card */}
                  <div className="p-4 rounded-2xl grid grid-cols-2 gap-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Burn Rate</p>
                      <p className="text-sm font-black text-white">Rs. {burnRate.toFixed(0)}<span className="text-[9px] font-bold" style={{ color: C.muted }}>/hr</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Projected Day</p>
                      <p className="text-sm font-black" style={{ color: "#f59e0b" }}>Rs. {(burnRate * 18 / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MONTH */}
              {walletSubTab === "month" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl grid grid-cols-2 gap-4 mb-2" style={{ background: "linear-gradient(135deg,rgba(100,255,218,0.06),rgba(99,102,241,0.04))", border: `1px solid ${C.glowBorder}` }}>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Month Income</p>
                      <p className="text-base font-black" style={{ color: C.teal }}>Rs. {(monthTotalInc / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.muted }}>Month Spent</p>
                      <p className="text-base font-black" style={{ color: C.pink }}>Rs. {(monthTotalExp / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                  {[
                    { label: "Energy & Utility", spent: 14500, limit: 20000, color: "#f59e0b" },
                    { label: "Food & Essentials", spent: 42000, limit: 50000, color: "#10b981" },
                    { label: "Financial / Debt", spent: 8000, limit: 10000, color: "#ef4444" },
                    { label: "Transport", spent: 5500, limit: 8000, color: "#3b82f6" },
                    { label: "Health", spent: 3200, limit: 6000, color: "#8b5cf6" },
                  ].map((b, i) => {
                    const pct = (b.spent / b.limit) * 100;
                    return (
                      <div key={i} className="p-4 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black text-white">{b.label}</span>
                          <span className="text-[10px] font-black" style={{ color: pct > 85 ? C.pink : C.muted }}>
                            Rs.{(b.spent / 1000).toFixed(0)}k / {(b.limit / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 85 ? C.pink : b.color }} />
                        </div>
                        <p className="text-[9px] mt-1 font-bold" style={{ color: C.muted }}>{pct.toFixed(0)}% used</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Report Button */}
              <button onClick={() => setShowReport(true)}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm"
                style={{ background: "linear-gradient(135deg,rgba(100,255,218,0.1),rgba(99,102,241,0.08))", border: `1px solid ${C.glowBorder}`, color: C.teal }}>
                <FileText size={16} /> Generate Full Report
              </button>
            </div>
          )}
        </main>

        {/* NAV */}
        <nav className="h-20 flex justify-around items-center px-4 pb-3"
          style={{ background: "rgba(5,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {[
            { id: "home", icon: Home, label: "Market" },
            { id: "crisis", icon: Globe, label: "Crisis" },
            { id: "wallet", icon: Wallet, label: "Wallet" },
            { id: "invest", icon: TrendingUp, label: "Invest" },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={activeTab === item.id ? { background: "rgba(100,255,218,0.12)" } : { background: "transparent" }}>
                <item.icon size={20} color={activeTab === item.id ? C.teal : "rgba(255,255,255,0.3)"} strokeWidth={activeTab === item.id ? 2.5 : 1.8} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter"
                style={{ color: activeTab === item.id ? C.teal : "rgba(255,255,255,0.3)" }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* FAB for wallet */}
        {activeTab === "wallet" && (
          <div className="absolute bottom-24 right-4">
            <button onClick={() => setShowAddModal(true)} className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${C.teal},#3b82f6)`, boxShadow: `0 8px 30px rgba(100,255,218,0.25)` }}>
              <Plus size={22} color="#0a0f1e" strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {showAddModal && <AddModal />}
      {showNotif && <NotifPanel />}
      {showReport && <ReportView />}
    </div>
  );
}
