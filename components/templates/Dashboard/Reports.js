"use client";
import { useState, useEffect } from "react";

const statusColor = {
  Confirmed: { bg: "#E1F5EE", text: "#0F6E56" },
  Pending: { bg: "#FAEEDA", text: "#854F0B" },
  Cancelled: { bg: "#FCEBEB", text: "#A32D2D" },
};

const TYPE_MAP = {
  "private-tour": "Private",
  "walking-tour": "Walking",
  tours: "Tour",
  "book-now-page": "Book Now",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatType(t) {
  return TYPE_MAP[t] || t;
}

const ALL_STATUSES = ["All", "Pending", "Confirmed", "Cancelled"];
const ALL_TYPES = ["All Types", "private-tour", "walking-tour", "tours", "book-now-page"];

const LIMIT = 10;

export default function Reports() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  async function fetchData(currentPage) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-section-api?from=${currentPage}&to=${LIMIT}`, {
        method: "GET",
        cache: "no-store",
      });
      const json = await res.json();
      console.log("json", json)
      const result = json?.data || [];
      console.log("result")
      setBookings(result);
      setTotalCount(json?.totalcount || 0);
      setHasMore(result.length === LIMIT);
    } catch (err) {
      console.error(err);
      setError("API se data nahi aaya. Server check karein.");
    } finally {
      setLoading(false);
    }
  }

  // Filters (client-side on current page data)
  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "All" || b.bookingStatus === statusFilter;
    const matchType = typeFilter === "All Types" || b.bookingType === typeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.name?.toLowerCase().includes(q) ||
      b.tour?.toLowerCase().includes(q) ||
      b.bookingId?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.mobile?.includes(q);
    return matchStatus && matchType && matchSearch;
  });

  const totalRevenue = filtered.reduce((s, b) => s + (b.totalAmount || 0), 0);

  function toggleRow(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const from = (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, totalCount);

  return (
    <div style={{ padding: 30, background: "#0b1520", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Reports</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "4px 0 0" }}>
            {loading
              ? "Loading..."
              : `${filtered.length} bookings · ₹${totalRevenue.toLocaleString("en-IN")} revenue`}
          </p>
        </div>
        <button
          onClick={() => fetchData(page)}
          style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>

        {/* Filters */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {ALL_STATUSES.map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
              background: statusFilter === f ? "#D4A847" : "transparent",
              color: statusFilter === f ? "#1a1200" : "rgba(255,255,255,0.5)",
              fontSize: 11, cursor: "pointer", fontWeight: statusFilter === f ? 600 : 400,
            }}>{f}</button>
          ))}
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)", height: 20, margin: "0 2px" }} />
          {ALL_TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(55,138,221,0.2)",
              background: typeFilter === t ? "rgba(55,138,221,0.2)" : "rgba(55,138,221,0.06)",
              color: typeFilter === t ? "#85B7EB" : "rgba(55,138,221,0.6)",
              fontSize: 11, cursor: "pointer",
            }}>{t === "All Types" ? t : formatType(t)}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tour, mobile, email, booking ID..."
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#fff", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "32px 110px minmax(0,1fr) minmax(0,1fr) 68px 80px 82px",
          padding: "9px 14px", fontSize: 10, color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 6,
        }}>
          <span></span>
          <span>BOOKING ID</span>
          <span>NAME</span>
          <span>TOUR</span>
          <span>DATE</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Koi booking nahi mili
          </div>
        ) : (
          filtered.map((b) => {
            const isOpen = expandedId === b._id;
            return (
              <div key={b._id}>
                <div
                  onClick={() => toggleRow(b._id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 110px minmax(0,1fr) minmax(0,1fr) 68px 80px 82px",
                    padding: "12px 14px", fontSize: 12, color: "#fff", alignItems: "center", gap: 6,
                    borderBottom: isOpen ? "none" : "1px solid rgba(255,255,255,0.04)",
                    background: isOpen ? "rgba(212,168,71,0.05)" : "transparent",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    color: isOpen ? "#D4A847" : "rgba(255,255,255,0.3)",
                    fontSize: 14, display: "flex", alignItems: "center",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>▾</span>

                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.bookingId}
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.tour}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{formatDate(b.date)}</span>
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

                {isOpen && (
                  <div style={{
                    background: "rgba(255,255,255,0.025)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "16px 16px 16px 52px",
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px 24px" }}>
                      {[
                        { label: "Booking type", value: <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(55,138,221,0.15)", color: "#85B7EB" }}>{formatType(b.bookingType)}</span> },
                        { label: "Mobile", value: b.mobile || "—" },
                        { label: "Email", value: b.email || "—" },
                        { label: "Adults", value: b.adults ?? "—" },
                        { label: "Children", value: b.children ?? "—" },
                        { label: "Total guests", value: (b.adults || 0) + (b.children || 0) },
                        { label: "Time", value: b.time || b.timeslot || "—" },
                        { label: "Duration", value: b.duration || "—" },
                        { label: "Booked on", value: formatDate(b.createdAt) },
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{item.label}</span>
                          <span style={{ fontSize: 12, color: "#e8edf2", wordBreak: "break-all" }}>{item.value}</span>
                        </div>
                      ))}

                      {b.highlights?.length > 0 && (
                        <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: 5 }}>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Highlights</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {b.highlights.map((h, hi) => (
                              <span key={hi} style={{
                                fontSize: 11, padding: "3px 10px", borderRadius: 4,
                                background: "rgba(212,168,71,0.12)", color: "#D4A847",
                              }}>{h}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Footer with Pagination */}
        {!loading && (
          <div style={{
            padding: "11px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
          }}>
            {/* Pagination controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "6px 14px", borderRadius: 7, border: "none",
                  background: "#D4A847", color: "#1a1000", fontSize: 12, fontWeight: 600,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >
                ← Previous
              </button>

              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {totalCount > 0 ? `${from}–${to} of ${totalCount}` : `Page ${page}`}
              </span>

              <button
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "6px 14px", borderRadius: 7, border: "none",
                  background: "#D4A847", color: "#1a1000", fontSize: 12, fontWeight: 600,
                  cursor: !hasMore ? "not-allowed" : "pointer",
                  opacity: !hasMore ? 0.4 : 1,
                }}
              >
                Next →
              </button>
            </div>

            <span style={{ fontSize: 12, color: "#D4A847", fontWeight: 600 }}>
              Total: ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
