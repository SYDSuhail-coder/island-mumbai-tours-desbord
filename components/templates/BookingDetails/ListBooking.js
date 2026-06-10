"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const ListBooking = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  const getBookingDetails = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/get-booking-detail?from=${currentPage}&to=${limit}`
      );
      const result = response?.data?.data || [];
      setData(result);
      setHasMore(result.length === limit);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingDetails(page);
  }, [page]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/delete-booking-detail?id=${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/editBookingDetails/${id}`;
  };

  const styles = {
    page: {
      padding: "28px 24px",
      background: "#0b1520",
      minHeight: "100vh",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    title: {
      color: "#f1f5f9",
      fontSize: "20px",
      fontWeight: 600,
      margin: 0,
    },
    subtitle: {
      color: "#64748b",
      fontSize: "13px",
      marginTop: "4px",
      marginBottom: 0,
    },
    tableCard: {
      background: "#0d1b2a",
      border: "1px solid #1e293b",
      borderRadius: "12px",
      overflow: "hidden",
    },
    tableWrap: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "780px",
    },
    th: {
      padding: "12px 16px",
      textAlign: "left",
      fontSize: "11px",
      fontWeight: 600,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: "#111f2e",
      borderBottom: "1px solid #1e293b",
      whiteSpace: "nowrap",
    },
    tr: {
      transition: "background 0.15s",
    },
    td: {
      padding: "12px 16px",
      fontSize: "13.5px",
      color: "#cbd5e1",
      borderBottom: "1px solid #1a2a3a",
      verticalAlign: "middle",
    },
    priceBadge: {
      display: "inline-block",
      padding: "3px 9px",
      background: "#0f2d1a",
      color: "#4ade80",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 500,
      border: "1px solid #14532d",
      fontVariantNumeric: "tabular-nums",
    },
    priceBadgeChild: {
      background: "#1a2540",
      color: "#93c5fd",
      border: "1px solid #1e3a5f",
    },
    pillGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "4px",
    },
    pill: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: "1.6",
    },
    pillBlue: {
      background: "#1e3a5f",
      color: "#93c5fd",
      border: "1px solid #2563a8",
    },
    pillTeal: {
      background: "#0d2d25",
      color: "#5eead4",
      border: "1px solid #0f6e56",
    },
    pillAmber: {
      background: "#2d1f06",
      color: "#fcd34d",
      border: "1px solid #854d0e",
    },
    actionCell: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    btnEdit: {
      background: "#16a34a",
      border: "none",
      color: "#fff",
      padding: "6px 14px",
      borderRadius: "7px",
      fontSize: "12.5px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background 0.15s",
      whiteSpace: "nowrap",
    },
    btnDelete: {
      background: "#dc2626",
      border: "none",
      color: "#fff",
      padding: "6px 14px",
      borderRadius: "7px",
      fontSize: "12.5px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background 0.15s",
      whiteSpace: "nowrap",
    },
    emptyCell: {
      textAlign: "center",
      padding: "48px 20px",
    },
    emptyInner: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    pagination: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px 16px",
      borderTop: "1px solid #1e293b",
      background: "#111f2e",
    },
    pgBtn: {
      background: "#D4A847",
      border: "none",
      color: "#1a1000",
      padding: "7px 16px",
      borderRadius: "7px",
      fontSize: "13px",
      fontWeight: 600,
      transition: "opacity 0.15s",
    },
    pgInfo: {
      color: "#94a3b8",
      fontSize: "13px",
      flexGrow: 1,
      textAlign: "center",
    },
    loadingWrap: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 0",
      gap: "16px",
    },
    spinner: {
      width: "32px",
      height: "32px",
      border: "3px solid #1e293b",
      borderTop: "3px solid #D4A847",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    loadingText: {
      color: "#64748b",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Booking Details</h2>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.loadingWrap}>
          <div style={styles.spinner} />
          <span style={styles.loadingText}>Loading bookings...</span>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Tour Name", "Adult Price", "Child Price", "Duration", "Highlights", "Timeslots", "Actions"].map(
                    (col) => (
                      <th key={col} style={styles.th}>
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr
                      key={item._id}
                      style={{
                        ...styles.tr,
                        backgroundColor: idx % 2 === 0 ? "#0d1b2a" : "#0b1826",
                      }}
                    >
                      <td style={{ ...styles.td, fontWeight: 500 }}>{item.tourName}</td>
                      <td style={styles.td}>
                        <span style={styles.priceBadge}>₹{item.adultPrice?.toLocaleString("en-IN")}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.priceBadge, ...styles.priceBadgeChild }}>
                          ₹{item.childPrice?.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.pillGroup}>
                          {item.duration?.map((d, i) => (
                            <span key={i} style={{ ...styles.pill, ...styles.pillBlue }}>{d}</span>
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.pillGroup}>
                          {item.highlights?.map((h, i) => (
                            <span key={i} style={{ ...styles.pill, ...styles.pillTeal }}>{h}</span>
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.pillGroup}>
                          {item.timeslots?.map((t, i) => (
                            <span key={i} style={{ ...styles.pill, ...styles.pillAmber }}>{t}</span>
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionCell}>
                          <button
                            onClick={() => handleEdit(item._id)}
                            style={styles.btnEdit}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#166534")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            style={styles.btnDelete}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991b1b")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={styles.emptyCell}>
                      <div style={styles.emptyInner}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p style={{ marginTop: 8, color: "#6b7280" }}>No bookings found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                ...styles.pgBtn,
                opacity: page === 1 ? 0.4 : 1,
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Previous
            </button>
            <span style={styles.pgInfo}>Page {page}</span>
            <button
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              style={{
                ...styles.pgBtn,
                opacity: !hasMore ? 0.4 : 1,
                cursor: !hasMore ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default ListBooking;
