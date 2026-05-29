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
      "title",
      "description",
      "duration",
      "transport",
      "location",
      "maxGuests",
      "pricePerPerson",
      "child",
      "rating",
      "reviewsCount",
      "badge",
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
      const response = await axios.post("/api/create-walking-page", data);
      if (response?.data?.statusCode === 400) {
        toast.error(response?.data?.message || "Your data already exists");
        setSubmitting(false);
        return;
      }
      toast.success("Tour Added Successfully");
      setFormData({
        title: "",
        description: "",
        duration: "",
        transport: "",
        location: "",
        maxGuests: "",
        pricePerPerson: "",
        child: "",
        rating: "",
        reviewsCount: "",
        badge: "",
        freeCancellation: false,
        isActive: true,
        coverImage: null,
        images: [],
      });
      setCoverPreview(null);
      setGalleryPreviews([]);
      router.push("/listMumbaiWalkingTour");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pi-root {
          min-height: 100vh;
          background: #fdf8f2;
          background-image:
            radial-gradient(ellipse 70% 50% at 5% 0%, rgba(234,179,8,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 95% 100%, rgba(234,88,12,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(251,191,36,0.05) 0%, transparent 60%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 20px 64px;
          font-family: 'Outfit', sans-serif;
        }

        .pi-card {
          width: 100%;
          max-width: 980px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 24px;
          padding: 48px 52px 56px;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 20px 60px rgba(180,120,0,0.07),
            0 1px 0 rgba(255,255,255,0.9) inset;
        }

        .pi-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
          padding-bottom: 28px;
          border-bottom: 2px solid #fef3c7;
        }

        .pi-badge {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 13px;
          border-radius: 100px;
          box-shadow: 0 2px 8px rgba(245,158,11,0.3);
        }

        .pi-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          color: #1c1408;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .pi-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #b45309;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pi-section-label::after {
          content: '';
          flex: 1;
          height: 1.5px;
          background: linear-gradient(90deg, #fde68a, transparent);
        }

        .pi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 28px;
          margin-bottom: 32px;
        }

        .pi-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .pi-field label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #78350f;
        }

        .pi-input {
          background: #fafaf8;
          border: 1.5px solid #e5e0d5;
          border-radius: 10px;
          padding: 11px 15px;
          color: #1c1408;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .pi-input:focus {
          border-color: #f59e0b;
          background: #fffbf2;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
        }
        .pi-input::placeholder { color: #b8ad9e; }

        .pi-textarea {
          background: #fafaf8;
          border: 1.5px solid #e5e0d5;
          border-radius: 10px;
          padding: 13px 15px;
          color: #1c1408;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          resize: vertical;
          width: 100%;
          min-height: 110px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .pi-textarea:focus {
          border-color: #f59e0b;
          background: #fffbf2;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
        }
        .pi-textarea::placeholder { color: #b8ad9e; }

        /* Toggles */
        .pi-toggles {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
        }

        .pi-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .pi-toggle input[type="checkbox"] { display: none; }

        .pi-switch {
          width: 40px;
          height: 22px;
          background: #e5e0d5;
          border-radius: 100px;
          position: relative;
          transition: background 0.25s;
          flex-shrink: 0;
        }
        .pi-switch::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.25s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .pi-toggle input:checked + .pi-switch {
          background: #f59e0b;
        }
        .pi-toggle input:checked + .pi-switch::after {
          transform: translateX(18px);
        }

        .pi-toggle-text {
          font-size: 13px;
          font-weight: 500;
          color: #4b3a1f;
        }

        /* Upload areas */
        .pi-upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 36px;
        }

        .pi-upload-section { display: flex; flex-direction: column; gap: 12px; }

        .pi-upload-box {
  border: 2px dashed #e5d9c3;
  border-radius: 14px;
  padding: 0;               
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
  min-height: 220px;       
  height: 220px;           
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdf8f0;
  overflow: hidden;
}
        .pi-upload-box:hover {
          border-color: #f59e0b;
          background: #fffbf0;
        }

        .pi-upload-box input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .pi-upload-inner { pointer-events: none; }

        .pi-upload-icon { font-size: 26px; margin-bottom: 6px; }

        .pi-upload-title {
          font-size: 13px;
          font-weight: 600;
          color: #3d2c0e;
          margin-bottom: 3px;
        }

        .pi-upload-sub { font-size: 11px; color: #a8956d; }

        /* Image grid previews */
        .pi-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
        }

        .pi-img-thumb-wrap {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 1;
          border: 1.5px solid #e5d9c3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }

        .pi-img-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pi-img-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.55);
          color: #fff;
          border: none;
          border-radius: 50%;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          z-index: 2;
        }
        .pi-img-remove:hover { background: #ef4444; }

        .pi-img-count {
          font-size: 11px;
          color: #92764a;
          font-weight: 500;
          margin-top: 4px;
        }

        /* Submit */
        .pi-submit {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #d97706 0%, #fbbf24 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(217,119,6,0.3);
        }
        .pi-submit:hover {
          opacity: 0.94;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(217,119,6,0.4);
        }
        .pi-submit:active { transform: translateY(0); }

        @media (max-width: 640px) {
          .pi-card { padding: 28px 18px 36px; }
          .pi-grid, .pi-upload-grid { grid-template-columns: 1fr; }
          .pi-toggles { flex-direction: column; gap: 16px; }
        }

        .pi-submit {
  background: #d97706;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 140px;
  min-height: 45px;
}

.pi-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loader {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
      `}</style>

      <div className="pi-root">
        <div className="pi-card">
          {/* Header */}
          <div className="pi-header">
            <span className="pi-badge">Mumbai Tours</span>
            <h1 className="pi-title">Add Walking Tour</h1>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Basic Info */}
            <div className="pi-section-label">Tour Details</div>
            <div className="pi-grid">
              <div className="pi-field">
                <label>Title</label>
                <input className="pi-input" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Bollywood VIP Studio Tour" />
              </div>
              <div className="pi-field">
                <label>Location</label>
                <input className="pi-input" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Film City, Goregaon" />
              </div>
              <div className="pi-field">
                <label>Duration</label>
                <input className="pi-input" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 5–6 hrs" />
              </div>
              <div className="pi-field">
                <label>Transport</label>
                <input className="pi-input" name="transport" value={formData.transport} onChange={handleChange} placeholder="e.g. Luxury Car" />
              </div>
              <div className="pi-field">
                <label>Max Guests</label>
                <input className="pi-input" name="maxGuests" value={formData.maxGuests} onChange={handleChange} placeholder="e.g. 6" />
              </div>
              <div className="pi-field">
                <label>Badge</label>
                <input className="pi-input" name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. Premium" />
              </div>
            </div>

            {/* Description */}
            <div className="pi-section-label">Description</div>
            <div style={{ marginBottom: 32 }}>
              <textarea
                className="pi-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a compelling tour description..."
              />
            </div>

            {/* Pricing & Reviews */}
            <div className="pi-section-label">Pricing &amp; Reviews</div>
            <div className="pi-grid" style={{ marginBottom: 32 }}>
              <div className="pi-field">
                <label>Price Per Person (₹)</label>
                <input className="pi-input" name="pricePerPerson" value={formData.pricePerPerson} onChange={handleChange} placeholder="e.g. 3500" />
              </div>
              <div className="pi-field">
                <label>Child Price (₹)</label>
                <input className="pi-input" name="child" value={formData.child} onChange={handleChange} placeholder="e.g. 500" />
              </div>
              <div className="pi-field">
                <label>Rating</label>
                <input className="pi-input" name="rating" value={formData.rating} onChange={handleChange} placeholder="e.g. 4.6" />
              </div>
              <div className="pi-field">
                <label>Reviews Count</label>
                <input className="pi-input" name="reviewsCount" value={formData.reviewsCount} onChange={handleChange} placeholder="e.g. 125" />
              </div>
            </div>

            {/* Toggles */}
            <div className="pi-section-label">Settings</div>
            <div className="pi-toggles" style={{ marginBottom: 32 }}>
              <label className="pi-toggle">
                <input type="checkbox" name="freeCancellation" checked={formData.freeCancellation} onChange={handleChange} />
                <span className="pi-switch" />
                <span className="pi-toggle-text">Free Cancellation</span>
              </label>
              <label className="pi-toggle">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                <span className="pi-switch" />
                <span className="pi-toggle-text">Is Active</span>
              </label>
            </div>

            {/* Images */}
            <div className="pi-section-label">Images</div>
            <div className="pi-upload-grid">

              {/* Cover Image — single */}
              <div className="pi-upload-section">
                <div className="pi-upload-box">
                  <input type="file" accept="image/*" onChange={handleCoverImage} />
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 13, opacity: 0.85 }} />
                      <button
                        type="button"
                        className="pi-img-remove"
                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeCoverImage(); }}
                      >✕</button>
                    </>
                  ) : (
                    <div className="pi-upload-inner">
                      <div className="pi-upload-icon">🖼️</div>
                      <div className="pi-upload-title">Cover Image</div>
                      <div className="pi-upload-sub">Click to upload</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="pi-upload-section">
                <div className="pi-upload-box">
                  <input type="file" accept="image/*" multiple onChange={handleImages} />
                  <div className="pi-upload-inner">
                    <div className="pi-upload-icon">📷</div>
                    <div className="pi-upload-title">Gallery Images</div>
                    <div className="pi-upload-sub">Select multiple photos</div>
                  </div>
                </div>
                {galleryPreviews.length > 0 && (
                  <>
                    <div className="pi-images-grid">
                      {galleryPreviews.map((src, i) => (
                        <div key={i} className="pi-img-thumb-wrap">
                          <img src={src} alt={`Gallery ${i + 1}`} />
                          <button
                            type="button"
                            className="pi-img-remove"
                            onClick={() => removeGalleryImage(i)}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="pi-img-count">{galleryPreviews.length} gallery image(s)</div>
                  </>
                )}
              </div>

            </div>

            <button
              type="submit"
              className="pi-submit"
              disabled={submitting}
            >
              {submitting ? (
                <span className="btn-loader"></span>
              ) : (
                "Add Tour →"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MumbaiWalkingTour;
