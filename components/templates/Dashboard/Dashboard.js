"use client";
import { useState } from "react";
import Link from "next/link";

const data = {
  stats: [
    { label: "Total Users", value: "1,284", change: "+12%", icon: "👥" },
    { label: "Packages Sold", value: "847", change: "+8%", icon: "🎟️" },
    { label: "Revenue", value: "₹8,42,300", change: "+21%", icon: "💰" },
    { label: "Avg. Rating", value: "4.9★", change: "+0.2", icon: "⭐" },
  ],
  monthly: [
    { month: "Nov", users: 62, revenue: 48200 },
    { month: "Dec", users: 88, revenue: 72100 },
    { month: "Jan", users: 104, revenue: 91300 },
    { month: "Feb", users: 96, revenue: 83500 },
    { month: "Mar", users: 143, revenue: 124500 },
    { month: "Apr", users: 118, revenue: 102700 },
  ],
  bookings: [
    { id: "#B1041", name: "Priya Sharma", tour: "Elephanta", date: "Apr 17", amount: "₹1,998", status: "Confirmed" },
    { id: "#B1040", name: "Aarav Kumar", tour: "Alibaug", date: "Apr 18", amount: "₹2,998", status: "Pending" },
    { id: "#B1039", name: "Sneha & Mihir", tour: "Sunset Cruise", date: "Apr 19", amount: "₹2,398", status: "Confirmed" },
    { id: "#B1038", name: "Rohit Mehta", tour: "Mandwa", date: "Apr 20", amount: "₹1,598", status: "Confirmed" },
  ],
};

export default function Dashboard() {
  const [chartType, setChartType] = useState("revenue");

  const maxRevenue = Math.max(...data.monthly.map(m => m.revenue));
  const maxUsers = Math.max(...data.monthly.map(m => m.users));

  const statusColor = {
    Confirmed: { bg: "#E1F5EE", text: "#0F6E56" },
    Pending: { bg: "#FAEEDA", text: "#854F0B" },
    Cancelled: { bg: "#FCEBEB", text: "#A32D2D" },
  };

  return (
    <div style={{ padding: 30, background: "#0b1520", minHeight: "100vh" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {data.stats.map((s, i) => (
          <div key={i} style={{
            background: "#0d1b2a",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "16px 18px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <span style={{
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 20,
                background: "rgba(29,158,117,0.15)",
                color: "#1D9E75",
              }}>
                {s.change}
              </span>
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 10 }}>
              {s.value}
            </div>

            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12, padding: "20px 22px", marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Monthly Performance</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["revenue", "users"].map(t => (
              <button key={t} onClick={() => setChartType(t)} style={{
                padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                background: chartType === t ? "#D4A847" : "transparent",
                color: chartType === t ? "#1a1200" : "rgba(255,255,255,0.5)",
                fontSize: 11, fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
          {data.monthly.map((m, i) => {
            const val = chartType === "revenue" ? m.revenue : m.users
            const max = chartType === "revenue" ? maxRevenue : maxUsers
            const pct = (val / max) * 100
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{
                    width: "100%", height: `${pct}%`, minHeight: 4,
                    background: i === data.monthly.length - 2
                      ? "#D4A847"
                      : "rgba(212,168,71,0.25)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.4s ease",
                  }} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{m.month}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{
        background: "#0d1b2a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
      }}>
        <div style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <div style={{ color: "#fff" }}>Recent Bookings</div>

          {/* ✅ FIX */}
          <Link href="/reports" style={{ color: "#D4A847" }}>
            View all →
          </Link>
        </div>

        {data.bookings.map((b, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 1fr 80px 90px 90px",
            padding: "13px 20px",
            fontSize: 12,
            borderTop: "1px solid rgba(255,255,255,0.04)",
            color: "#fff"
          }}>
            <span>{b.id}</span>
            <span>{b.name}</span>
            <span>{b.tour}</span>
            <span>{b.date}</span>
            <span style={{ color: "#D4A847" }}>{b.amount}</span>

            <span style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 10,
              background: statusColor[b.status].bg,
              color: statusColor[b.status].text,
              textAlign: "center",
            }}>
              {b.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}