"use client";
export default function Packages() {
  const data = {
    packages: [
      { name: "Elephanta Island Tour", sold: 312, revenue: "₹3,10,488", badge: "Bestseller", color: "#1a3a5c" },
      { name: "Alibaug Beach Tour", sold: 224, revenue: "₹3,35,776", badge: "Popular", color: "#8B5E3C" },
      { name: "Mandwa Coastal Getaway", sold: 187, revenue: "₹1,49,413", badge: "", color: "#1D6E5A" },
      { name: "Sunset Harbour Cruise", sold: 124, revenue: "₹1,48,876", badge: "New", color: "#4a1a6e" },
      { name: "Elephanta Island Tour", sold: 312, revenue: "₹3,10,488", badge: "Bestseller", color: "#1a3a5c" },
      { name: "Alibaug Beach Tour", sold: 224, revenue: "₹3,35,776", badge: "Popular", color: "#8B5E3C" },
      { name: "Mandwa Coastal Getaway", sold: 187, revenue: "₹1,49,413", badge: "", color: "#1D6E5A" },
      { name: "Sunset Harbour Cruise", sold: 124, revenue: "₹1,48,876", badge: "New", color: "#4a1a6e" },
    ],
  }
  return (
    <div style={{
      background: "#0d1b2a",
      border: "2px solid rgba(255,255,255,0.07)",
      borderRadius: 12,
      padding: "24px",
      maxWidth: 900,
      margin: "0 auto"   // ✅ center
    }}>

      {/* Heading */}
      <h1 style={{
        color: "#fff",
        textAlign: "center",   // ✅ center text
        marginBottom: 30,      // ✅ gap below
        fontWeight: 600
      }}>
        Tour Packages
      </h1>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20              // ✅ better gap
      }}>
        {data.packages.map((p, i) => (
          <div key={i} style={{
            background: "#0d1b2a",
            border: "2px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            overflow: "hidden",
            minHeight: 180   // ✅ card height improve
          }}>

            {/* Top color strip */}
            <div style={{
              height: 70,
              background: p.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px"
            }}>
              {p.badge && (
                <span style={{
                  background: "#D4A847",
                  color: "#1a1200",
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontWeight: 600
                }}>
                  {p.badge}
                </span>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: "16px" }}>
              <div style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#fff",
                marginBottom: 12
              }}>
                {p.name}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                    Packages Sold
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#D4A847" }}>
                    {p.sold}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                    Revenue
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                    {p.revenue}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                marginTop: 14,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 6,
                height: 6,
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${(p.sold / 312) * 100}%`,
                  background: "#D4A847",
                  borderRadius: 6
                }} />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}