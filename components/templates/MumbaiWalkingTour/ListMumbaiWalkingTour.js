"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PAGE_SIZE = 5;

// ── Image Preview Modal ──
const ImageModal = ({ open, onClose, images = [], title }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:"#0d1b2a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:28, maxWidth:740, width:"100%", maxHeight:"85vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:16 }}>🖼️</span>
            <span style={{ color:"#fff", fontWeight:600, fontSize:15 }}>Gallery — {title}</span>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"rgba(255,255,255,0.6)", width:32, height:32, borderRadius:8, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
          {images.map((src, i) => (
            <img key={i} src={src} alt={`img-${i+1}`} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)" }} onError={e=>e.target.style.display="none"} />
          ))}
        </div>
        <div style={{ marginTop:20, textAlign:"right" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", background:"transparent", border:"1px solid rgba(212,168,71,0.4)", borderRadius:8, color:"#D4A847", fontSize:13, cursor:"pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──
const DeleteModal = ({ open, onClose, onConfirm, title, deleting }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:"#0d1b2a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"28px 32px", maxWidth:420, width:"100%" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:20, marginBottom:12 }}>🗑️</div>
        <div style={{ color:"#fff", fontWeight:600, fontSize:16, marginBottom:10 }}>Delete Tour?</div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:24, lineHeight:1.6 }}>
          Are you sure you want to delete <span style={{ color:"#D4A847", fontWeight:600 }}>{title}</span>? This action cannot be undone.
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} disabled={deleting} style={{ padding:"8px 20px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={{ padding:"8px 20px", background:"#ef4444", border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:600, cursor:deleting?"not-allowed":"pointer", opacity:deleting?0.6:1, display:"flex", alignItems:"center", gap:6 }}>
            {deleting
              ? <><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }} />Deleting...</>
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Star Rating ──
const Stars = ({ value }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(value) ? "#D4A847" : "rgba(255,255,255,0.15)", fontSize:13 }}>★</span>
    ))}
  </span>
);

// ── Main Component ──
const ListMumbaiWalkingTour = () => {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [imageDialog, setImageDialog] = useState({ open:false, images:[], title:"" });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => { fetchTours(page); }, [page]);

  const fetchTours = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/get-walking-page?from=${pageNum}&to=${PAGE_SIZE}`);
      const json = res.data;
      setTotalCount(json?.totalcount || 0);
      const raw = json?.result?.data || json?.result || json?.data || [];
      setTours(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const openDelete  = (slug, title) => setDeleteDialog({ open:true, slug, title });
  const closeDelete = () => setDeleteDialog({ open:false });

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/delete-walking-page/${deleteDialog.slug}`);
      setTours(prev => prev.filter(t => t.slug !== deleteDialog.slug));
      setTotalCount(prev => prev - 1);
      toast.success("Deleted Successfully");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      closeDelete();
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const colStyle = { color:"rgba(255,255,255,0.35)", fontSize:10, fontWeight:600, letterSpacing:"0.08em", padding:"10px 14px", textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.06)", whiteSpace:"nowrap" };
  const tdStyle  = { padding:"14px", borderBottom:"1px solid rgba(255,255,255,0.04)", verticalAlign:"top" };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .wt-row:hover td{background:rgba(255,255,255,0.02)!important;}`}</style>

      <div style={{ minHeight:"100vh", background:"#0b1520", padding:"30px 24px", fontFamily:"'Inter','Outfit',sans-serif" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <h1 style={{ color:"#fff", fontSize:20, fontWeight:600, margin:0 }}>Walking Tours</h1>
            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:12, margin:"4px 0 0" }}>
              {loading ? "Loading..." : `${totalCount} tours total`}
            </p>
          </div>
          <button
            onClick={() => router.push("/mumbaiWalking")}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", background:"#D4A847", border:"none", borderRadius:9, color:"#1a1200", fontSize:13, fontWeight:700, cursor:"pointer" }}
          >
            + Add Tour
          </button>
        </div>

        {/* Table Card */}
        <div style={{ background:"#0d1b2a", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, overflow:"hidden" }}>

          {loading ? (
            <div style={{ padding:60, textAlign:"center" }}>
              <div style={{ width:32, height:32, border:"3px solid rgba(212,168,71,0.2)", borderTop:"3px solid #D4A847", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>Loading tours...</div>
            </div>
          ) : tours.length === 0 ? (
            <div style={{ padding:60, textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:14 }}>No tours found.</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.03)" }}>
                    <th style={colStyle}>TITLE</th>
                    <th style={colStyle}>INFO</th>
                    <th style={colStyle}>PRICING</th>
                    <th style={colStyle}>RATING</th>
                    <th style={colStyle}>IMAGES</th>
                    <th style={colStyle}>STATUS</th>
                    <th style={{ ...colStyle, textAlign:"center" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((tour) => (
                    <tr key={tour._id} className="wt-row">

                      {/* Title */}
                      <td style={{ ...tdStyle, minWidth:220 }}>
                        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                          <img
                            src={tour.coverImage}
                            alt={tour.title}
                            style={{ width:56, height:56, objectFit:"cover", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", flexShrink:0, background:"rgba(255,255,255,0.05)" }}
                            onError={e => e.target.style.display="none"}
                          />
                          <div>
                            <div style={{ color:"#fff", fontWeight:600, fontSize:13, marginBottom:4, lineHeight:1.3 }}>{tour.title}</div>
                            {tour.badge && (
                              <span style={{ fontSize:9, padding:"2px 8px", borderRadius:20, background:"#D4A847", color:"#1a1200", fontWeight:700, display:"inline-block", marginBottom:4 }}>{tour.badge}</span>
                            )}
                            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, lineHeight:1.4, maxWidth:160, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                              {tour.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Info */}
                      <td style={{ ...tdStyle, minWidth:170 }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>📍 {tour.location}</span>
                          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>⏱ {tour.duration}</span>
                          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>🚶 {tour.transport}</span>
                          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>👥 Max {tour.maxGuests}</span>
                          <span style={{ fontSize:11, color: tour.freeCancellation ? "#1D9E75" : "#ef4444" }}>
                            {tour.freeCancellation ? "✓ Free Cancellation" : "✗ No Cancellation"}
                          </span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td style={{ ...tdStyle, minWidth:110 }}>
                        <div style={{ color:"#D4A847", fontWeight:700, fontSize:15 }}>₹{tour.pricePerPerson}</div>
                        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:2 }}>per person</div>
                        <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginTop:4 }}>Child: ₹{tour.child}</div>
                      </td>

                      {/* Rating */}
                      <td style={{ ...tdStyle, minWidth:130 }}>
                        <Stars value={Number(tour.rating)} />
                        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginTop:4 }}>{tour.rating} · {tour.reviewsCount} reviews</div>
                      </td>

                      {/* Images */}
                      <td style={{ ...tdStyle, minWidth:140 }}>
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                          {(tour.images||[]).slice(0,3).map((src,i) => (
                            <img key={i} src={src} alt={`t${i}`} style={{ width:34, height:34, objectFit:"cover", borderRadius:6, border:"1px solid rgba(255,255,255,0.1)" }}
                              onError={e=>e.target.style.display="none"} />
                          ))}
                          {(tour.images||[]).length > 3 && (
                            <div style={{ width:34, height:34, borderRadius:6, background:"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"rgba(255,255,255,0.4)" }}>
                              +{(tour.images||[]).length - 3}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setImageDialog({ open:true, images:tour.images||[], title:tour.title })}
                          style={{ fontSize:11, color:"#D4A847", background:"transparent", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:4 }}
                        >
                          🖼 {(tour.images||[]).length} photos
                        </button>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span style={{
                          fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:500,
                          background: tour.isActive ? "rgba(29,158,117,0.15)" : "rgba(255,255,255,0.07)",
                          color: tour.isActive ? "#1D9E75" : "rgba(255,255,255,0.4)",
                          border:`1px solid ${tour.isActive ? "rgba(29,158,117,0.3)" : "rgba(255,255,255,0.1)"}`,
                        }}>
                          {tour.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ ...tdStyle, textAlign:"center" }}>
                        <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                          <button
                            onClick={() => router.push(`/editMumbaiWalkingTour/${tour.slug}`)}
                            title="Edit"
                            style={{ width:32, height:32, borderRadius:7, background:"rgba(212,168,71,0.1)", border:"1px solid rgba(212,168,71,0.2)", color:"#D4A847", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}
                          >✏️</button>
                          <button
                            onClick={() => openDelete(tour.slug, tour.title)}
                            title="Delete"
                            style={{ width:32, height:32, borderRadius:7, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}
                          >🗑️</button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ padding:"14px 20px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>
                Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, totalCount)} of {totalCount}
              </span>
              <div style={{ display:"flex", gap:6 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  disabled={page===1}
                  style={{ padding:"5px 14px", borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:page===1?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.5)", fontSize:12, cursor:page===1?"not-allowed":"pointer" }}
                >← Prev</button>
                {Array.from({ length:totalPages }, (_,i)=>i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width:32, height:32, borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", background:page===p?"#D4A847":"transparent", color:page===p?"#1a1200":"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer", fontWeight:page===p?700:400 }}>{p}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p+1))}
                  disabled={page===totalPages}
                  style={{ padding:"5px 14px", borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:page===totalPages?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.5)", fontSize:12, cursor:page===totalPages?"not-allowed":"pointer" }}
                >Next →</button>
              </div>
            </div>
          )}

        </div>
      </div>

      <ImageModal open={imageDialog.open} onClose={() => setImageDialog({ open:false, images:[], title:"" })} images={imageDialog.images} title={imageDialog.title} />
      <DeleteModal open={deleteDialog.open} onClose={closeDelete} onConfirm={confirmDelete} title={deleteDialog.title} deleting={deleting} />
    </>
  );
};

export default ListMumbaiWalkingTour;
