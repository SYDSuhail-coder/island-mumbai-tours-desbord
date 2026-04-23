"use client";
export default function Reports() {
  const data = {
  bookings: [
    { id: "#B1041", name: "Priya Sharma", tour: "Elephanta", date: "Apr 17", amount: "₹1,998", status: "Confirmed" },
    { id: "#B1040", name: "Aarav Kumar", tour: "Alibaug", date: "Apr 18", amount: "₹2,998", status: "Pending" },
    { id: "#B1039", name: "Sneha & Mihir", tour: "Sunset Cruise", date: "Apr 19", amount: "₹2,398", status: "Confirmed" },
    { id: "#B1038", name: "Rohit Mehta", tour: "Mandwa", date: "Apr 20", amount: "₹1,598", status: "Confirmed" },
    { id: "#B1041", name: "Priya Sharma", tour: "Elephanta", date: "Apr 17", amount: "₹1,998", status: "Confirmed" },
    { id: "#B1040", name: "Aarav Kumar", tour: "Alibaug", date: "Apr 18", amount: "₹2,998", status: "Pending" },
    { id: "#B1039", name: "Sneha & Mihir", tour: "Sunset Cruise", date: "Apr 19", amount: "₹2,398", status: "Confirmed" },
    { id: "#B1038", name: "Rohit Mehta", tour: "Mandwa", date: "Apr 20", amount: "₹1,598", status: "Confirmed" },
  ],
};
const statusColor = {
    Confirmed: { bg: "#E1F5EE", text: "#0F6E56" },
    Pending: { bg: "#FAEEDA", text: "#854F0B" },
    Cancelled: { bg: "#FCEBEB", text: "#A32D2D" },
  };
  return (
    <div style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
        {["All", "Confirmed", "Pending", "Cancelled"].map(f => (
          <button key={f} style={{
            padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
            background: f === "All" ? "#D4A847" : "transparent",
            color: f === "All" ? "#1a1200" : "rgba(255,255,255,0.5)",
            fontSize: 11, cursor: "pointer",
          }}>{f}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 80px 90px 90px", padding: "10px 20px", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 8 }}>
        <span>ID</span><span>CUSTOMER</span><span>TOUR</span><span>DATE</span><span>AMOUNT</span><span>STATUS</span>
      </div>
      {data.bookings.map((b, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "80px 1fr 1fr 80px 90px 90px",
          padding: "14px 20px", alignItems: "center", fontSize: 13,
          borderBottom: i < data.bookings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          gap: 8,
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 11 }}>{b.id}</span>
          <span style={{ color: "#e8edf2" }}>{b.name}</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{b.tour}</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>{b.date}</span>
          <span style={{ color: "#D4A847", fontWeight: 600 }}>{b.amount}</span>
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
            background: statusColor[b.status].bg, color: statusColor[b.status].text, textAlign: "center",
          }}>{b.status}</span>
        </div>
      ))}
    </div>
  );
}