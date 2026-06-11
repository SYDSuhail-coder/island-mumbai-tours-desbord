"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";


const EditMumbaiWalkingTour = ({ slug }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", duration: "", transport: "", location: "",
    maxGuests: "", pricePerPerson: "", child: "", freeCancellation: true,
    rating: "", reviewsCount: "", badge: "", isActive: true, coverImage: null, images: [],
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverIsNew, setCoverIsNew] = useState(false);
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);

  useEffect(() => { if (!slug) return; fetchTour(); }, [slug]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/get-by-slug-walking-page/${slug}`);
      const json = await res.json();
      const tour = json?.result?.data || json?.result || json?.data || json;
      setFormData({ title: tour.title || "", description: tour.description || "", duration: tour.duration || "", transport: tour.transport || "", location: tour.location || "", maxGuests: tour.maxGuests || "", pricePerPerson: tour.pricePerPerson || "", child: tour.child || "", freeCancellation: tour.freeCancellation ?? true, rating: tour.rating || "", reviewsCount: tour.reviewsCount || "", badge: tour.badge || "", isActive: tour.isActive ?? true, coverImage: null, images: [] });
      if (tour.coverImage) setCoverPreview(tour.coverImage);
      if (Array.isArray(tour.images)) setExistingGallery(tour.images);
    } catch (err) {
      toast.error("Failed to load tour data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, coverImage: file }));
    setCoverPreview(URL.createObjectURL(file));
    setCoverIsNew(true);
  };
  const removeCoverImage = () => { setFormData((prev) => ({ ...prev, coverImage: null })); setCoverPreview(null); setCoverIsNew(false); };
  const removeExistingGallery = (index) => setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewGalleryFiles((prev) => [...prev, ...files]);
    setNewGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const removeNewGallery = (index) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    const textFields = ["title", "description", "duration", "transport", "location", "maxGuests", "pricePerPerson", "child", "rating", "reviewsCount", "badge"];
    textFields.forEach((key) => data.append(key, formData[key]));
    data.append("freeCancellation", formData.freeCancellation);
    data.append("isActive", formData.isActive);
    if (formData.coverImage) data.append("coverImage", formData.coverImage);
    else if (coverPreview) data.append("coverImage", coverPreview);
    existingGallery.forEach((url) => data.append("existingImages", url));
    newGalleryFiles.forEach((file) => data.append("images", file));
    try {
      const res = await fetch(`/api/update-walking-page/${slug}`, { method: "PUT", body: data });
      const result = await res.json();
      if (result?.statusCode === 400) { toast.error(result?.message || "Update failed"); setSaving(false); return; }
      toast.success("Tour Updated Successfully");
      router.push("/listMumbaiWalkingTour");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Shared styles
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6, display: "block" };
  const sectionLabel = { fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4A847", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 };
  const uploadBox = { border: "1.5px dashed rgba(255,255,255,0.15)", borderRadius: 10, height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.2s,background 0.2s" };
  const thumbRemove = { position: "absolute", top: 5, right: 5, width: 20, height: 20, background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "50%", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0b1520", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid rgba(212,168,71,0.3)", borderTop: "3px solid #D4A847", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading tour data...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        .et-input:focus{border-color:rgba(212,168,71,0.6)!important;background:rgba(212,168,71,0.04)!important;}
        .et-input::placeholder{color:rgba(255,255,255,0.2);}
        .et-textarea:focus{border-color:rgba(212,168,71,0.6)!important;background:rgba(212,168,71,0.04)!important;}
        .et-textarea::placeholder{color:rgba(255,255,255,0.2);}
        .et-upload:hover{border-color:rgba(212,168,71,0.5)!important;background:rgba(212,168,71,0.04)!important;}
        .et-switch{width:40px;height:22px;background:rgba(255,255,255,0.12);border-radius:100px;position:relative;transition:background 0.25s;flex-shrink:0;}
        .et-switch::after{content:'';position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:3px;transition:transform 0.25s;box-shadow:0 1px 3px rgba(0,0,0,0.3);}
        .et-check:checked + .et-switch{background:#D4A847;}
        .et-check:checked + .et-switch::after{transform:translateX(18px);}
        .et-check{display:none;}
        .et-remove:hover{background:#ef4444!important;}
        .et-cancel:hover{background:rgba(255,255,255,0.06)!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:640px){.et-grid{grid-template-columns:1fr!important;}.et-ugrid{grid-template-columns:1fr!important;}.et-actions{flex-direction:column!important;}}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0b1520", padding: "40px 20px 60px", fontFamily: "'Outfit','Inter',sans-serif" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "36px 40px 48px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            <span style={{ background: "#D4A847", color: "#1a1200", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20 }}>Mumbai Tours</span>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Edit Walking Tour</h1>
            <span style={{ fontSize: 9, padding: "4px 12px", borderRadius: 20, background: "rgba(14,165,233,0.15)", color: "#38BDF8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Editing</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 10px", fontFamily: "monospace" }}>{slug}</span>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Tour Details */}
            <div style={sectionLabel}>Tour Details<div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} /></div>
            <div className="et-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 28 }}>
              {[{ label: "Title", name: "title", ph: "e.g. Bollywood VIP Studio Tour" }, { label: "Location", name: "location", ph: "e.g. Film City, Goregaon" }, { label: "Duration", name: "duration", ph: "e.g. 5–6 hrs" }, { label: "Transport", name: "transport", ph: "e.g. Luxury Car" }, { label: "Max Guests", name: "maxGuests", ph: "e.g. 6" }, { label: "Badge", name: "badge", ph: "e.g. Premium" }].map(({ label, name, ph }) => (
                <div key={name} style={{ display: "flex", flexDirection: "column" }}>
                  <label style={labelStyle}>{label}</label>
                  <input className="et-input" style={inputStyle} name={name} value={formData[name]} onChange={handleChange} placeholder={ph} />
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={sectionLabel}>Description<div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} /></div>
            <div style={{ marginBottom: 28 }}>
              <textarea className="et-textarea" style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} name="description" value={formData.description} onChange={handleChange} placeholder="Write a compelling tour description..." />
            </div>

            {/* Pricing */}
            <div style={sectionLabel}>Pricing &amp; Reviews<div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} /></div>
            <div className="et-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 28 }}>
              {[{ label: "Price Per Person (₹)", name: "pricePerPerson", ph: "e.g. 3500" }, { label: "Child Price (₹)", name: "child", ph: "e.g. 500" }, { label: "Rating", name: "rating", ph: "e.g. 4.6" }, { label: "Reviews Count", name: "reviewsCount", ph: "e.g. 125" }].map(({ label, name, ph }) => (
                <div key={name} style={{ display: "flex", flexDirection: "column" }}>
                  <label style={labelStyle}>{label}</label>
                  <input className="et-input" style={inputStyle} name={name} value={formData[name]} onChange={handleChange} placeholder={ph} />
                </div>
              ))}
            </div>

            {/* Settings */}
            <div style={sectionLabel}>Settings<div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} /></div>
            <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
              {[{ name: "freeCancellation", label: "Free Cancellation" }, { name: "isActive", label: "Is Active" }].map(({ name, label }) => (
                <label key={name} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                  <input className="et-check" type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
                  <span className="et-switch" />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Images */}
            <div style={sectionLabel}>Images<div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} /></div>
            <div className="et-ugrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>

              {/* Cover Image */}
              <div>
                <label style={labelStyle}>Cover Image</label>
                <div className="et-upload" style={uploadBox}>
                  <input type="file" accept="image/*" onChange={handleCoverImage} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                  {coverPreview ? (
                    <>
                      <Image
                        src={coverPreview}
                        alt="Cover"
                        fill
                        unoptimized
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />                      <button type="button" className="et-remove" style={{ ...thumbRemove, top: 8, right: 8, width: 24, height: 24 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeCoverImage(); }}>✕</button>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", pointerEvents: "none" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Click to replace cover</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>JPG, PNG, WEBP</div>
                    </div>
                  )}
                </div>
                {coverIsNew && <div style={{ fontSize: 11, color: "#D4A847", marginTop: 6 }}>✦ New cover selected</div>}
              </div>

              {/* Gallery */}
              <div>
                <label style={labelStyle}>Gallery Images</label>
                <div className="et-upload" style={uploadBox}>
                  <input type="file" accept="image/*" multiple onChange={handleNewImages} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                  <div style={{ textAlign: "center", pointerEvents: "none" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Add More Photos</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Hold Ctrl / Cmd to multi-select</div>
                  </div>
                </div>

                {/* Existing gallery */}
                {existingGallery.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#D4A847", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Current Photos</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 8 }}>
                      {existingGallery.map((src, i) => (
                        <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", border: "1.5px solid rgba(212,168,71,0.3)" }}>
                          <Image
                            src={src}
                            alt={`e${i}`}
                            fill
                            unoptimized
                            style={{ objectFit: "cover" }}
                          />                          <button type="button" className="et-remove" style={thumbRemove} onClick={() => removeExistingGallery(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{existingGallery.length} existing photo(s)</div>
                  </div>
                )}

                {/* New gallery */}
                {newGalleryPreviews.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>New Photos</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 8 }}>
                      {newGalleryPreviews.map((src, i) => (
                        <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <Image
                            src={src}
                            alt={`n${i}`}
                            fill
                            unoptimized
                            style={{ objectFit: "cover" }}
                          />                          <button type="button" className="et-remove" style={thumbRemove} onClick={() => removeNewGallery(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{newGalleryPreviews.length} new photo(s) to upload</div>
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            <div className="et-actions" style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                className="et-cancel"
                onClick={() => router.push("/listMumbaiWalkingTour")}
                style={{ padding: "13px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
              >← Cancel</button>
              <button
                type="submit"
                disabled={saving}
                style={{ flex: 1, padding: 13, background: saving ? "rgba(212,168,71,0.5)" : "#D4A847", border: "none", borderRadius: 10, color: "#1a1200", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                {saving ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(26,18,0,0.3)", borderTop: "2px solid #1a1200", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Saving...</> : "Update Tour →"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditMumbaiWalkingTour;
