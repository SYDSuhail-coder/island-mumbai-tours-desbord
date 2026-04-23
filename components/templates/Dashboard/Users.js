"use client";
export default function Users() {
  const data = {
  stats: [
    { label: "Total Users", value: "1,284", change: "+12%", trend: "up", icon: "👥" },
    { label: "Packages Sold", value: "847", change: "+8%", trend: "up", icon: "🎟️" },
    { label: "Revenue", value: "₹8,42,300", change: "+21%", trend: "up", icon: "💰" },
    { label: "Avg. Rating", value: "4.9★", change: "+0.2", trend: "up", icon: "⭐" },
  ],
  monthly: [
    { month: "Nov", users: 62, revenue: 48200 },
    { month: "Dec", users: 88, revenue: 72100 },
    { month: "Jan", users: 104, revenue: 91300 },
    { month: "Feb", users: 96, revenue: 83500 },
    { month: "Mar", users: 143, revenue: 124500 },
    { month: "Apr", users: 118, revenue: 102700 },
  ],
  packages: [
    { name: "Elephanta Island Tour", sold: 312, revenue: "₹3,10,488", badge: "Bestseller", color: "#1a3a5c" },
    { name: "Alibaug Beach Tour", sold: 224, revenue: "₹3,35,776", badge: "Popular", color: "#8B5E3C" },
    { name: "Mandwa Coastal Getaway", sold: 187, revenue: "₹1,49,413", badge: "", color: "#1D6E5A" },
    { name: "Sunset Harbour Cruise", sold: 124, revenue: "₹1,48,876", badge: "New", color: "#4a1a6e" },
  ],
  bookings: [
    { id: "#B1041", name: "Priya Sharma", tour: "Elephanta", date: "Apr 17", amount: "₹1,998", status: "Confirmed" },
    { id: "#B1040", name: "Aarav Kumar", tour: "Alibaug", date: "Apr 18", amount: "₹2,998", status: "Pending" },
    { id: "#B1039", name: "Sneha & Mihir", tour: "Sunset Cruise", date: "Apr 19", amount: "₹2,398", status: "Confirmed" },
    { id: "#B1038", name: "Rohit Mehta", tour: "Mandwa", date: "Apr 20", amount: "₹1,598", status: "Confirmed" },
    { id: "#B1037", name: "Anita Desai", tour: "Elephanta", date: "Apr 21", amount: "₹999", status: "Cancelled" },
    { id: "#B1036", name: "Vikram Singh", tour: "Alibaug", date: "Apr 22", amount: "₹4,497", status: "Confirmed" },
  ],
}
const statusColor = {
  Confirmed: { bg: "#E1F5EE", text: "#0F6E56" },
  Pending: { bg: "#FAEEDA", text: "#854F0B" },
  Cancelled: { bg: "#FCEBEB", text: "#A32D2D" },
}
  return (
    <div style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Total 1,284 registered users</span>
        <input placeholder="Search user..." style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 12, outline: "none",
        }} />
      </div>
      {data.bookings.map((b, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 20px", borderBottom: i < data.bookings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#D4A847",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: "#1a1200", flexShrink: 0,
          }}>{b.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#e8edf2" }}>{b.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{b.tour} · {b.date}</div>
          </div>
          <div style={{ fontSize: 13, color: "#D4A847", fontWeight: 500 }}>{b.amount}</div>
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
            background: statusColor[b.status].bg, color: statusColor[b.status].text,
          }}>{b.status}</span>
        </div>
      ))}
    </div>
  );
}