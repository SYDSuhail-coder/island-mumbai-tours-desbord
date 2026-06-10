"use client";
import { useState, useEffect } from "react";

const TYPE_COLORS = {
  "private-tour": "#1a3a5c",
  "walking-tour": "#4a1a6e",
  tours: "#1D6E5A",
  "book-now-page": "#8B3a3a",
};

function formatType(t) {
  const map = {
    "private-tour": "Private",
    "walking-tour": "Walking",
    tours: "Tour",
    "book-now-page": "Book Now",
  };
  return map[t] || t;
}

export default function Packages() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  fetchData();
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

  // Group by tour name
  const tourMap = {};
  bookings.forEach((b) => {
    const key = b.tour;
    if (!tourMap[key]) {
      tourMap[key] = {
        name: b.tour,
        slug: b.slug,
        bookingType: b.bookingType,
        count: 0,
        revenue: 0,
        guests: 0,
      };
    }
    tourMap[key].count += 1;
    tourMap[key].revenue += b.totalAmount || 0;
    tourMap[key].guests += (b.adults || 0) + (b.children || 0);
  });

  const tours = Object.values(tourMap).sort((a, b) => b.revenue - a.revenue);
  const maxCount = Math.max(...tours.map((t) => t.count), 1);

  return (
    <div style={{ padding: 30, background: "#0b1520", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Tour Packages</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "4px 0 0" }}>
            {loading ? "Loading..." : `${tours.length} unique tours`}
          </p>
        </div>
        <button
          onClick={fetchData}
          style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer",
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

      {/* Summary stats */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Tours", value: tours.length, icon: "🗺️" },
            { label: "Total Bookings", value: bookings.length, icon: "🎟️" },
            { label: "Total Revenue", value: `₹${bookings.reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString("en-IN")}`, icon: "💰" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 60, fontSize: 14 }}>
          Loading packages...
        </div>
      )}

      {/* Tour Cards Grid */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {tours.map((tour, i) => {
            const color = TYPE_COLORS[tour.bookingType] || "#1a3a5c";
            const pct = (tour.count / maxCount) * 100;
            return (
              <div
                key={i}
                style={{
                  background: "#0d1b2a",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {/* Color top strip */}
                <div style={{ height: 70, background: color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#D4A847", color: "#1a1200", fontWeight: 600 }}>
                    {formatType(tour.bookingType)}
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                    #{i + 1} by revenue
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tour.name}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Bookings</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#D4A847" }}>{tour.count}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Guests</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{tour.guests}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Revenue</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                        ₹{tour.revenue.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#D4A847", borderRadius: 6, transition: "width 0.5s ease" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 5 }}>
                    {Math.round(pct)}% of top tour
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && tours.length === 0 && (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 60, fontSize: 14 }}>
          Koi tour nahi mila
        </div>
      )}
    </div>
  );
}
