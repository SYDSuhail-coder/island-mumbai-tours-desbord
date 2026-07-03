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

//Detail Modal
function DetailModal({ booking, onClose }) {
  if (!booking) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1b2a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: 24,
          width: "100%",
          maxWidth: 360,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>Booking Info</h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)", border: "none",
              color: "rgba(255,255,255,0.5)", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* 3 fields only */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Booking ID", value: booking.bookingId, mono: true },
            { label: "Guide Name", value: booking.guideName || "—" },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "10px 14px",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {item.label}
              </span>
              <span style={{ fontSize: 13, color: "#e8edf2", fontFamily: item.mono ? "monospace" : "inherit" }}>
                {item.value}
              </span>
            </div>
          ))}

          {/* Status field */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8, padding: "10px 14px",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Status
            </span>
            <span style={{
              display: "inline-block", alignSelf: "flex-start",
              padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: statusColor[booking.bookingStatus]?.bg || "#eee",
              color: statusColor[booking.bookingStatus]?.text || "#333",
            }}>
              {booking.bookingStatus}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20, width: "100%", padding: "9px 0",
            borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Edit Status Modal ───────────────────────────────────────────────────────
function EditModal({ booking, onClose, onSaved }) {
  const [status, setStatus] = useState(booking?.bookingStatus || "Pending");
  const [guideName, setGuideName] = useState(booking?.guideName || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!booking) return null;

  async function handleSave() {
    setSaving(true);
    setErr(null);
    try {
      // Cancelled hone par guideName bhi clear karo
      const finalGuideName = status === "Cancelled" ? "" : guideName;
      const res = await fetch(`/api/update-section-booking-id/${booking.bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: status, guideName: finalGuideName }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSuccess(true);
      setTimeout(() => {
        onSaved();  // list refresh + detail modal update
        onClose();
      }, 900);
    } catch (e) {
      setErr(e.message || "Update nahi hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1b2a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: 24,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>Edit Booking</h2>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}>
              {booking.bookingId}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)", border: "none",
              color: "rgba(255,255,255,0.5)", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Customer info (readonly) */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8, padding: "10px 14px", marginBottom: 20,
        }}>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{booking.name}</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{booking.tour}</div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 4 }}>
            {formatDate(booking.date)} · ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
          </div>
        </div>

        {/* Status select */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Booking Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%", background: "#0b1520",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", borderRadius: 8,
              padding: "9px 12px", fontSize: 13,
              cursor: "pointer", outline: "none",
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Guide name input */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Guide Name
          </label>
          <input
            value={guideName}
            onChange={(e) => setGuideName(e.target.value)}
            placeholder="Guide ka naam likhein..."
            style={{
              width: "100%", background: "#0b1520",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", borderRadius: 8,
              padding: "9px 12px", fontSize: 13,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Error / Success */}
        {err && (
          <div style={{
            background: "#FCEBEB", color: "#A32D2D",
            padding: "9px 12px", borderRadius: 7,
            fontSize: 12, marginBottom: 14,
          }}>
            {err}
          </div>
        )}
        {success && (
          <div style={{
            background: "#E1F5EE", color: "#0F6E56",
            padding: "9px 12px", borderRadius: 7,
            fontSize: 12, marginBottom: 14,
          }}>
            ✓ Update ho gaya!
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "rgba(255,255,255,0.4)",
              fontSize: 13, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || success}
            style={{
              flex: 2, padding: "9px 0", borderRadius: 8, border: "none",
              background: saving || success ? "rgba(212,168,71,0.4)" : "#D4A847",
              color: "#1a1000", fontSize: 13, fontWeight: 600,
              cursor: saving || success ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : success ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Reports Component ──────────────────────────────────────────────────
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
  const [isMobile, setIsMobile] = useState(false);

  // Modal states
  const [detailBooking, setDetailBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchData(page); }, [page]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function fetchData(currentPage) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-section-api?from=${currentPage}&to=${LIMIT}`, {
        method: "GET", cache: "no-store",
      });
      const json = await res.json();
      const result = json?.data || [];
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

  // GET single booking detail
  async function handleViewDetail(e, bookingId) {
    e.stopPropagation();
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/get-section-booking-id/${bookingId}`);
      const json = await res.json();
      setDetailBooking(json?.result || json);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }

  // Open edit modal
  function handleEdit(e, booking) {
    e.stopPropagation();
    setEditBooking(booking);
  }

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

  // Shared action bar used in both mobile + desktop expanded panels
  function ActionBar({ booking }) {
    return (
      <div style={{
        marginTop: 14,
        paddingTop: 12,
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {/* View Details button */}
        <button
          onClick={(e) => handleViewDetail(e, booking.bookingId)}
          disabled={detailLoading}
          style={{
            padding: "7px 14px", borderRadius: 7,
            border: "1px solid rgba(55,138,221,0.3)",
            background: "rgba(55,138,221,0.1)", color: "#85B7EB",
            fontSize: 12, cursor: "pointer", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <span style={{ fontSize: 13 }}>👁</span> View Details
        </button>

        {/* Edit button */}
        <button
          onClick={(e) => handleEdit(e, booking)}
          style={{
            padding: "7px 14px", borderRadius: 7,
            border: "1px solid rgba(212,168,71,0.35)",
            background: "rgba(212,168,71,0.1)", color: "#D4A847",
            fontSize: 12, cursor: "pointer", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <span style={{ fontSize: 13 }}>✏️</span> Edit Status
        </button>

        {/* Quick status badge (current) */}
        <span style={{
          marginLeft: "auto",
          padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
          background: statusColor[booking.bookingStatus]?.bg || "#eee",
          color: statusColor[booking.bookingStatus]?.text || "#333",
        }}>
          {booking.bookingStatus}
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 14 : 30, background: "#0b1520", minHeight: "100vh", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>

      {/* Modals */}
      <DetailModal booking={detailBooking} onClose={() => setDetailBooking(null)} />
      <EditModal
        booking={editBooking}
        onClose={() => setEditBooking(null)}
        onSaved={() => {
          window.location.reload();
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: isMobile ? 17 : 20, fontWeight: 600, margin: 0 }}>Reports</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "4px 0 0" }}>
            {loading ? "Loading..." : `${filtered.length} bookings · ₹${totalRevenue.toLocaleString("en-IN")} revenue`}
          </p>
        </div>
        <button
          onClick={() => fetchData(page)}
          style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
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
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {ALL_STATUSES.map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
              background: statusFilter === f ? "#D4A847" : "transparent",
              color: statusFilter === f ? "#1a1200" : "rgba(255,255,255,0.5)",
              fontSize: 11, cursor: "pointer", fontWeight: statusFilter === f ? 600 : 400,
            }}>{f}</button>
          ))}
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)", height: 18, margin: "0 2px" }} />
          {ALL_TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(55,138,221,0.2)",
              background: typeFilter === t ? "rgba(55,138,221,0.2)" : "rgba(55,138,221,0.06)",
              color: typeFilter === t ? "#85B7EB" : "rgba(55,138,221,0.6)",
              fontSize: 11, cursor: "pointer",
            }}>{t === "All Types" ? t : formatType(t)}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, tour, mobile, email, ID..."
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#fff", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Koi booking nahi mili
          </div>
        ) : isMobile ? (

          /* ── MOBILE: Card layout ── */
          <div>
            {filtered.map((b) => {
              const isOpen = expandedId === b._id;
              return (
                <div key={b._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div
                    onClick={() => toggleRow(b._id)}
                    style={{
                      padding: "14px 14px",
                      background: isOpen ? "rgba(212,168,71,0.05)" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{b.name}</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
                        background: statusColor[b.bookingStatus]?.bg || "#eee",
                        color: statusColor[b.bookingStatus]?.text || "#333",
                      }}>
                        {b.bookingStatus}
                      </span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.tour}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }}>{b.bookingId}</span>
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "rgba(55,138,221,0.15)", color: "#85B7EB" }}>
                        {formatType(b.bookingType)}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{formatDate(b.date)}</span>
                      <span style={{ color: "#D4A847", fontWeight: 700, fontSize: 13, marginLeft: "auto" }}>
                        ₹{(b.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                      <span style={{
                        color: isOpen ? "#D4A847" : "rgba(255,255,255,0.3)",
                        fontSize: 14,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        display: "inline-block",
                      }}>▾</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{
                      background: "rgba(255,255,255,0.025)",
                      padding: "14px 14px 16px",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
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
                      </div>

                      {b.highlights?.length > 0 && (
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
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

                      {/*  Action Bar - Mobile */}
                      <ActionBar booking={b} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        ) : (

          /* ── DESKTOP: Table layout ── */
          <>
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

            {filtered.map((b) => {
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

                        {/*  Action Bar - Desktop (spans all 3 columns) */}
                        <div style={{ gridColumn: "span 3" }}>
                          <ActionBar booking={b} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Footer Pagination */}
        {!loading && (
          <div style={{
            padding: "11px 14px", borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "6px 12px", borderRadius: 7, border: "none",
                  background: "#D4A847", color: "#1a1000", fontSize: 12, fontWeight: 600,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >
                ← Prev
              </button>

              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {totalCount > 0 ? `${from}–${to} of ${totalCount}` : `Page ${page}`}
              </span>

              <button
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "6px 12px", borderRadius: 7, border: "none",
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
