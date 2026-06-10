"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MumbaiWalkingTour = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    transport: "",
    location: "",
    maxGuests: "",
    pricePerPerson: "",
    child: "",
    freeCancellation: true,
    rating: "",
    reviewsCount: "",
    badge: "",
    isActive: true,
    coverImage: null,
    images: [],
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, coverImage: file }));
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setCoverPreview(null);
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const requiredFields = [
      "title","description","duration","transport","location",
      "maxGuests","pricePerPerson","child","rating","reviewsCount","badge",
    ];

    const hasEmptyField = requiredFields.some((field) => !formData[field]);
    if (hasEmptyField || !formData.coverImage || formData.images.length === 0) {
      toast.warning("Please fill all fields");
      setSubmitting(false);
      return;
    }

    const data = new FormData();
    requiredFields.forEach((key) => data.append(key, formData[key]));
    data.append("freeCancellation", formData.freeCancellation);
    data.append("isActive", formData.isActive);
    data.append("coverImage", formData.coverImage);
    formData.images.forEach((img) => data.append("images", img));

    try {
      const response = await axios.post("/api/create-island-page", data);
      if (response?.data?.statusCode === 400) {
        toast.error(response?.data?.message || "Your data already exists");
        setSubmitting(false);
        return;
      }
      toast.success("Tour Added Successfully");
      setFormData({
        title: "", description: "", duration: "", transport: "", location: "",
        maxGuests: "", pricePerPerson: "", child: "", rating: "", reviewsCount: "",
        badge: "", freeCancellation: false, isActive: true, coverImage: null, images: [],
      });
      setCoverPreview(null);
      setGalleryPreviews([]);
      router.push("/listIsland");
    } finally {
      setSubmitting(false);
    }
  };

  // shared styles
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: 6,
    display: "block",
  };

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#D4A847",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const fieldWrap = { display: "flex", flexDirection: "column" };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <style>{`
        .wt-input:focus { border-color: rgba(212,168,71,0.6) !important; background: rgba(212,168,71,0.04) !important; }
        .wt-input::placeholder { color: rgba(255,255,255,0.2); }
        .wt-textarea:focus { border-color: rgba(212,168,71,0.6) !important; background: rgba(212,168,71,0.04) !important; }
        .wt-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .wt-upload:hover { border-color: rgba(212,168,71,0.5) !important; background: rgba(212,168,71,0.04) !important; }
        .wt-switch { width:40px; height:22px; background:rgba(255,255,255,0.12); border-radius:100px; position:relative; transition:background 0.25s; flex-shrink:0; }
        .wt-switch::after { content:''; position:absolute; width:16px; height:16px; background:#fff; border-radius:50%; top:3px; left:3px; transition:transform 0.25s; box-shadow:0 1px 3px rgba(0,0,0,0.3); }
        .wt-check:checked + .wt-switch { background:#D4A847; }
        .wt-check:checked + .wt-switch::after { transform:translateX(18px); }
        .wt-check { display:none; }
        .btn-loader { width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid #fff; border-radius:50%; animation:spin 0.8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .wt-img-remove { position:absolute; top:6px; right:6px; width:22px; height:22px; background:rgba(0,0,0,0.6); color:#fff; border:none; border-radius:50%; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:3; }
        .wt-img-remove:hover { background:#ef4444; }
        @media(max-width:640px){
          .wt-grid { grid-template-columns:1fr !important; }
          .wt-upload-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* Page background */}
      <div style={{ minHeight: "100vh", background: "#0b1520", padding: "40px 20px 60px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>

        {/* Card */}
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#0d1b2a",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "36px 40px 48px",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ background: "#D4A847", color: "#1a1200", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20 }}>
              Mumbai Tours
            </span>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 600, margin: 0 }}>Add Popular Tour</h1>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Tour Details */}
            <div style={{ ...sectionLabel, marginBottom: 16 }}>
              Tour Details
              <div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} />
            </div>
            <div className="wt-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 28 }}>
              {[
                { label: "Title", name: "title", placeholder: "e.g. Bollywood VIP Studio Tour" },
                { label: "Location", name: "location", placeholder: "e.g. Film City, Goregaon" },
                { label: "Duration", name: "duration", placeholder: "e.g. 5–6 hrs" },
                { label: "Transport", name: "transport", placeholder: "e.g. Luxury Car" },
                { label: "Max Guests", name: "maxGuests", placeholder: "e.g. 6" },
                { label: "Badge", name: "badge", placeholder: "e.g. Premium" },
              ].map(({ label, name, placeholder }) => (
                <div key={name} style={fieldWrap}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    className="wt-input"
                    style={inputStyle}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ ...sectionLabel, marginBottom: 16 }}>
              Description
              <div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <textarea
                className="wt-textarea"
                style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a compelling tour description..."
              />
            </div>

            {/* Pricing & Reviews */}
            <div style={{ ...sectionLabel, marginBottom: 16 }}>
              Pricing &amp; Reviews
              <div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} />
            </div>
            <div className="wt-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 28 }}>
              {[
                { label: "Price Per Person (₹)", name: "pricePerPerson", placeholder: "e.g. 3500" },
                { label: "Child Price (₹)", name: "child", placeholder: "e.g. 500" },
                { label: "Rating", name: "rating", placeholder: "e.g. 4.6" },
                { label: "Reviews Count", name: "reviewsCount", placeholder: "e.g. 125" },
              ].map(({ label, name, placeholder }) => (
                <div key={name} style={fieldWrap}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    className="wt-input"
                    style={inputStyle}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {/* Settings / Toggles */}
            <div style={{ ...sectionLabel, marginBottom: 16 }}>
              Settings
              <div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} />
            </div>
            <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
              {[
                { name: "freeCancellation", label: "Free Cancellation" },
                { name: "isActive", label: "Is Active" },
              ].map(({ name, label }) => (
                <label key={name} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                  <input className="wt-check" type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
                  <span className="wt-switch" />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Images */}
            <div style={{ ...sectionLabel, marginBottom: 16 }}>
              Images
              <div style={{ flex: 1, height: 1, background: "rgba(212,168,71,0.2)" }} />
            </div>
            <div className="wt-upload-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>

              {/* Cover Image */}
              <div>
                <label style={labelStyle}>Cover Image</label>
                <div
                  className="wt-upload"
                  style={{
                    border: "1.5px dashed rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <input type="file" accept="image/*" onChange={handleCoverImage} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                      <button type="button" className="wt-img-remove" onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeCoverImage(); }}>✕</button>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", pointerEvents: "none" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Click to upload cover</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>JPG, PNG, WEBP</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label style={labelStyle}>Gallery Images</label>
                <div
                  className="wt-upload"
                  style={{
                    border: "1.5px dashed rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <input type="file" accept="image/*" multiple onChange={handleImages} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                  <div style={{ textAlign: "center", pointerEvents: "none" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Select multiple photos</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Hold Ctrl / Cmd to multi-select</div>
                  </div>
                </div>

                {/* Gallery thumbnails */}
                {galleryPreviews.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 8 }}>
                      {galleryPreviews.map((src, i) => (
                        <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <img src={src} alt={`Gallery ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <button type="button" className="wt-img-remove" onClick={() => removeGalleryImage(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{galleryPreviews.length} image(s) selected</div>
                  </div>
                )}
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                background: submitting ? "rgba(212,168,71,0.5)" : "#D4A847",
                border: "none",
                borderRadius: 10,
                color: "#1a1200",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "opacity 0.2s",
              }}
            >
              {submitting ? <span className="btn-loader" /> : "Add Tour →"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default MumbaiWalkingTour;
