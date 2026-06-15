"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const statusColor = {
  Confirmed: { bg: "#E1F5EE", text: "#0F6E56" },
  Pending: { bg: "#FAEEDA", text: "#854F0B" },
  Cancelled: { bg: "#FCEBEB", text: "#A32D2D" },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatType(t) {
  const map = {
    "private-tour": "Private",
    "walking-tour": "Walking",
    "tours": "Tour",
    "book-now-page": "Book Now",
  };
  return map[t] || t;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("revenue");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchData();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-section-api`, {
        method: "GET",
        cache: "no-store",
      });
      const json = await res.json();
      setBookings(json?.data || []);
    } catch (err) {
      setError("API se data nahi aaya. Server check karein.");
    } finally {
      setLoading(false);
    }
  }

  // Stats
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const pendingCount = bookings.filter((b) => b.bookingStatus === "Pending").length;
  const totalGuests = bookings.reduce((s, b) => s + (b.adults || 0) + (b.children || 0), 0);

  // Chart: group by date
  const dateMap = {};
  bookings.forEach((b) => {
    const key = formatDate(b.date);
    if (!dateMap[key]) dateMap[key] = { revenue: 0, count: 0 };
    dateMap[key].revenue += b.totalAmount || 0;
    dateMap[key].count += 1;
  });
  const chartDates = Object.keys(dateMap);
  const chartVals = chartDates.map((d) =>
    chartType === "revenue" ? dateMap[d].revenue : dateMap[d].count
  );
  const maxVal = Math.max(...chartVals, 1);

  // Recent bookings: last 5 sorted by createdAt
  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: "🎟️", badge: "Live" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰" },
    { label: "Pending", value: pendingCount, icon: "⏳" },
    { label: "Total Guests", value: totalGuests, icon: "👥" },
  ];

  return (
    <div style={{ padding: isMobile ? 16 : 30, background: "#0b1520", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: isMobile ? 17 : 20, fontWeight: 600, margin: 0 }}>Dashboard</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "4px 0 0" }}>Mumbai Tours Admin</p>
        </div>
        <button
          onClick={fetchData}
          style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Stats — 2x2 on mobile, 4 columns on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
        gap: isMobile ? 10 : 14,
        marginBottom: 24
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: isMobile ? "14px 14px" : "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              {s.badge && (
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(29,158,117,0.15)", color: "#1D9E75" }}>
                  {s.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#fff", marginTop: 10 }}>
              {loading ? "—" : s.value}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: isMobile ? "16px 14px" : "20px 22px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: "#fff" }}>Revenue by Date</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["revenue", "bookings"].map((t) => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                style={{
                  padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: chartType === t ? "#D4A847" : "transparent",
                  color: chartType === t ? "#1a1200" : "rgba(255,255,255,0.5)",
                  fontSize: 11, fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Loading...
          </div>
        ) : chartDates.length === 0 ? (
          <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            No data
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 5 : 10, height: 140, overflowX: isMobile ? "auto" : "visible" }}>
            {chartDates.map((date, i) => {
              const pct = (chartVals[i] / maxVal) * 100;
              return (
                <div key={i} style={{ flex: "0 0 auto", minWidth: isMobile ? 28 : undefined, flex: isMobile ? "0 0 auto" : 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                    <div
                      style={{
                        width: isMobile ? 22 : "100%",
                        height: `${pct}%`, minHeight: 4,
                        background: i === chartDates.length - 1 ? "#D4A847" : "rgba(212,168,71,0.25)",
                        borderRadius: "4px 4px 0 0", transition: "height 0.4s ease",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{date}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>Recent Bookings</div>
          <Link href="/reports" style={{ color: "#D4A847", fontSize: 13 }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading...</div>
        ) : recent.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No bookings found</div>
        ) : isMobile ? (
          /* MOBILE: Card layout instead of table */
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {recent.map((b, i) => (
              <div key={i} style={{
                padding: "14px 16px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}>
                {/* Row 1: Name + Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{b.name}</span>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
                    background: statusColor[b.bookingStatus]?.bg || "#eee",
                    color: statusColor[b.bookingStatus]?.text || "#333",
                  }}>
                    {b.bookingStatus}
                  </span>
                </div>
                {/* Row 2: Tour name */}
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {b.tour}
                </div>
                {/* Row 3: ID / Type / Date / Amount */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }}>{b.bookingId}</span>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "rgba(55,138,221,0.15)", color: "#85B7EB" }}>
                    {formatType(b.bookingType)}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{formatDate(b.date)}</span>
                  <span style={{ color: "#D4A847", fontWeight: 700, fontSize: 13, marginLeft: "auto" }}>
                    ₹{(b.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DESKTOP: Original table layout */
          <>
            <div style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1fr) minmax(0,1fr) 65px 75px 80px 80px", padding: "10px 20px", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: 8 }}>
              <span>ID</span><span>NAME</span><span>TOUR</span><span>TYPE</span><span>DATE</span><span>AMOUNT</span><span>STATUS</span>
            </div>
            {recent.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "grid", gridTemplateColumns: "90px minmax(0,1fr) minmax(0,1fr) 65px 75px 80px 80px",
                  padding: "13px 20px", fontSize: 12, borderTop: "1px solid rgba(255,255,255,0.04)",
                  color: "#fff", alignItems: "center", gap: 8,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "monospace" }}>
                  {b.bookingId}
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                <span style={{ color: "rgba(255,255,255,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.tour}</span>
                <span>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "rgba(55,138,221,0.15)", color: "#85B7EB" }}>
                    {formatType(b.bookingType)}
                  </span>
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{formatDate(b.date)}</span>
                <span style={{ color: "#D4A847", fontWeight: 600 }}>₹{(b.totalAmount || 0).toLocaleString("en-IN")}</span>
                <span>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
                    background: statusColor[b.bookingStatus]?.bg || "#eee",
                    color: statusColor[b.bookingStatus]?.text || "#333",
                  }}>
                    {b.bookingStatus}
                  </span>
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
