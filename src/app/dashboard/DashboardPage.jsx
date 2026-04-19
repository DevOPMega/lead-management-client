import { useState } from "react";
import {
  Users, RefreshCw, Trophy, DollarSign, Bell, Search,
  Clock, Calendar, Flame, BarChart2, LayoutDashboard,
  FileText, Settings, ChevronRight, MoreHorizontal,
  Power, Circle, TrendingUp, Phone, Star, LogOut,
  ChevronDown, Sun, Globe, Menu, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

// ─── DUMMY DATA ──────────────────────────────────────────────────────────────
const statsCards = [
  {
    id: 1, label: "Total Leads", value: "120",
    icon: Users, color: "from-violet-500 to-purple-600", bg: "bg-violet-50",
  },
  {
    id: 2, label: "Today Follow-ups", value: "14",
    icon: RefreshCw, color: "from-blue-400 to-indigo-500", bg: "bg-blue-50",
  },
  {
    id: 3, label: "Won Deals", value: "56",
    icon: Trophy, color: "from-teal-400 to-cyan-500", bg: "bg-teal-50",
  },
  {
    id: 4, label: "Revenue", value: "$16,840",
    icon: DollarSign, color: "from-orange-400 to-pink-500", bg: "bg-orange-50",
    sub: "Monthly",
    chart: [4, 7, 5, 9, 6, 8, 11],
  },
];

const salesData = [
  { month: "Jan", value: 10 }, { month: "Feb", value: 28 },
  { month: "Mar", value: 45 }, { month: "Apr", value: 60 },
  { month: "May", value: 55 }, { month: "May", value: 72 },
  { month: "Jun", value: 85 }, { month: "Jun", value: 100 },
];

const hotLeads = [
  { id: 1, name: "Zara Khan", score: 89, avatar: "ZK", color: "bg-rose-400" },
  { id: 2, name: "Roy Mathew", score: 92, avatar: "RM", color: "bg-indigo-400" },
];

const renewals = [
  { id: 1, policy: "Policy #123", due: "Tomorrow", urgent: true },
  { id: 2, policy: "Policy #124", due: "3 Days", urgent: false },
];

const todayTasks = [
  { id: 1, title: "Follow up with Aamir Shah", time: "10:00 AM" },
  { id: 2, title: "Prepare quote for Mr. Kapoor", time: "01:00 PM" },
  { id: 3, title: "Call back Sarah Ahmed", time: "03:00 PM" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: RefreshCw, label: "Follow-ups" },
  { icon: Trophy, label: "Deals" },
  { icon: FileText, label: "Policies" },
  { icon: BarChart2, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────
function Sparkline({ data }) {
  const max = Math.max(...data);
  const w = 60, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke="#7B2D8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ card }) {
  const Icon = card.icon;
  const isRevenue = !!card.chart;
  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-white/40 to-purple-50/20 rounded-2xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${card.color} flex items-center justify-center shadow-sm shrink-0`}>
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800 leading-tight">{card.value}</p>
          </div>
        </div>
        {isRevenue && (
          <div className="flex flex-col items-end gap-1">
            <Sparkline data={card.chart} />
            <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
              <BarChart2 size={11} /> {card.sub}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-purple-100 text-xs">
        <p className="text-gray-500">{label}</p>
        <p className="font-bold text-purple-700">{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = "w-9 h-9" }) {
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {

  return (
    <div className="font-sans"
      style={{ background: "linear-gradient(135deg, #e8e0f5 0%, #dde8f8 40%, #e4d8f0 70%, #f0e8fa 100%)" }}>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col">

        {/* ── TOPBAR ── */}
        <header className="flex items-center px-5 py-3 gap-3 border-b shrink-0"
          style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(18px)", borderColor: "rgba(255,255,255,0.7)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search..." className="pl-8 h-8 text-sm bg-white/70 border-gray-200/60 rounded-xl focus-visible:ring-violet-300" />
          </div>
          <Bell size={18} className="text-gray-500 hover:text-violet-600 cursor-pointer transition-colors ml-1" />

          <div className="ml-auto flex items-center gap-3">
            <div className="relative max-w-40">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search..." className="pl-8 h-8 text-sm bg-white/70 border-gray-200/60 rounded-xl focus-visible:ring-violet-300" />
            </div>
            <div className="flex items-center gap-1 bg-white/60 rounded-full px-2 py-1">
              <Sun size={14} className="text-yellow-500" />
              <div className="w-6 h-3 bg-gray-200 rounded-full mx-0.5 relative cursor-pointer">
                <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-600 bg-white/60 rounded-lg px-2 py-1">EN</span>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
              AK
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE BODY ── */}
        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Dashboard Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/70 text-xs font-medium text-violet-700 cursor-pointer hover:bg-white/80 transition">
                <Users size={13} />
                <span>10.44</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/70 text-xs font-medium text-gray-600 cursor-pointer hover:bg-white/80 transition">
                <BarChart2 size={13} />
                <ChevronDown size={11} />
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/70">
                <div className="w-8 h-4 bg-gray-300/70 rounded-full relative cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statsCards.map((card) => <StatCard key={card.id} card={card} />)}
          </div>

          {/* ── ROW 2: Sales Chart | Hot Leads | Renewals ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

            {/* Sales Overview — 2.5 cols */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">Sales Overview</h3>
                <button className="flex items-center gap-1 text-xs text-gray-500 bg-white/70 rounded-lg px-2.5 py-1 border border-gray-200/60 hover:border-violet-300 transition">
                  Monthly <ChevronDown size={11} />
                </button>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9B3DAB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#9B3DAB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#9B3DAB" strokeWidth={2.5}
                      fill="url(#salesGrad)" dot={{ r: 3, fill: "#9B3DAB", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#7B2D8B" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hot Leads — 1.5 cols */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={16} className="text-orange-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Hot Leads</h3>
              </div>
              <div className="space-y-2">
                {hotLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3 bg-white/50 rounded-xl p-3 border border-white/60 hover:border-violet-200 transition-all cursor-pointer group">
                    <Avatar initials={lead.avatar} color={lead.color} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{lead.name}</p>
                      <p className="text-xs text-gray-500">Scored {lead.score}%</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs font-semibold px-2 py-0.5 border-0">
                        Scored {lead.score}%
                      </Badge>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Renewals — 1 col */}
            <div className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Upcoming Renewals</h3>
              <div className="space-y-2">
                {renewals.map((r) => (
                  <div key={r.id} className="bg-white/50 rounded-xl p-3 border border-white/60 hover:border-violet-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Calendar size={13} className="text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-800">{r.policy}</p>
                          <span className={`text-xs font-medium ${r.urgent ? "text-orange-500" : "text-blue-500"}`}>{r.due}</span>
                        </div>
                        <p className="text-xs text-gray-400">{r.policy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pl-9">
                      <button className="w-5 h-5 rounded-md bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <X size={9} className="text-gray-400 hover:text-red-500" />
                      </button>
                      <button className="w-5 h-5 rounded-md bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors">
                        <Star size={9} className="text-gray-400 hover:text-green-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── ROW 3: Today's Tasks (two panels) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

            {/* Tasks Panel 1 */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">Today's Tasks</h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Circle size={14} className="cursor-pointer hover:text-violet-500 transition-colors" />
                  <Power size={14} className="cursor-pointer hover:text-violet-500 transition-colors" />
                  <MoreHorizontal size={14} className="cursor-pointer hover:text-violet-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 bg-white/50 rounded-xl px-3 py-2.5 border border-white/60 hover:border-violet-200 cursor-pointer group transition-all">
                    <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                      <Clock size={13} className="text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.time}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 font-medium">{task.time}</span>
                      <ChevronRight size={13} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks + Renewals Combined Panel */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={15} className="text-orange-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Today's Tasks</h3>
                <div className="ml-auto flex items-center gap-2 text-gray-400">
                  <Circle size={14} className="cursor-pointer hover:text-violet-500 transition-colors" />
                  <Power size={14} className="cursor-pointer hover:text-violet-500 transition-colors" />
                  <MoreHorizontal size={14} className="cursor-pointer hover:text-violet-500 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Left: tasks list */}
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 bg-white/50 rounded-xl px-2.5 py-2 border border-white/60 hover:border-violet-200 cursor-pointer group transition-all">
                      <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                        <Clock size={11} className="text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{task.title}</p>
                        <p className="text-[10px] text-gray-400">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Right: renewals */}
                <div className="space-y-2">
                  {renewals.map((r) => (
                    <div key={r.id} className="bg-white/50 rounded-xl px-2.5 py-2.5 border border-white/60 hover:border-violet-200 cursor-pointer transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                          <Calendar size={11} className="text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-800">{r.policy}</p>
                            <span className={`text-[10px] font-medium ${r.urgent ? "text-orange-500" : "text-blue-500"}`}>{r.due}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">{r.policy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 pl-8">
                        <button className="w-4 h-4 rounded-md bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                          <X size={7} className="text-gray-400" />
                        </button>
                        <button className="w-4 h-4 rounded-md bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors">
                          <Star size={7} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}