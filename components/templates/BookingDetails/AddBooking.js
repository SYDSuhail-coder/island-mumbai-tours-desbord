"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBooking = () => {
    const [formData, setFormData] = useState({
        tourName: "",
        adultPrice: "",
        childPrice: "",
        duration: "",
        highlights: "",
        timeslots: "",
    });
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !formData.tourName ||
        !formData.adultPrice ||
        !formData.childPrice ||
        !formData.duration ||
        !formData.highlights ||
        !formData.timeslots
    ) {
        toast.warning("Please fill all fields");
        return;
    }

    try {
        setSubmitting(true);

        const data = new FormData();

        data.append("tourName", formData.tourName);
        data.append("adultPrice", formData.adultPrice);
        data.append("childPrice", formData.childPrice);

        // Arrays ko FormData me bhejna
        formData.duration
            .split(",")
            .map((item) => item.trim())
            .forEach((item) => data.append("duration", item));

        formData.highlights
            .split(",")
            .map((item) => item.trim())
            .forEach((item) => data.append("highlights", item));

        formData.timeslots
            .split(",")
            .map((item) => item.trim())
            .forEach((item) => data.append("timeslots", item));

        const response = await axios.post(
            "/api/create-booking-detail",
            data
        );

        toast.success("Booking Details Added Successfully");

        setFormData({
            tourName: "",
            adultPrice: "",
            childPrice: "",
            duration: "",
            highlights: "",
            timeslots: "",
        });

        router.push("/listBookingDetails");

    } catch (error) {
        console.log("Error:", error);
        toast.error("Something went wrong");
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
                        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 600, margin: 0 }}>Add Booking Tour</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div
                            className="wt-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "20px",
                                marginBottom: "20px",
                            }}
                        >
                            <div style={fieldWrap}>
                                <label style={labelStyle}>Tour Name</label>
                                <input
                                    className="wt-input"
                                    style={inputStyle}
                                    name="tourName"
                                    value={formData.tourName}
                                    onChange={handleChange}
                                    placeholder="Alibaug Beach Tour"
                                />
                            </div>

                            <div style={fieldWrap}>
                                <label style={labelStyle}>Adult Price</label>
                                <input
                                    className="wt-input"
                                    style={inputStyle}
                                    type="Text"
                                    name="adultPrice"
                                    value={formData.adultPrice}
                                    onChange={handleChange}
                                    placeholder="1499"
                                />
                            </div>

                            <div style={fieldWrap}>
                                <label style={labelStyle}>Child Price</label>
                                <input
                                    className="wt-input"
                                    style={inputStyle}
                                    type="Text"
                                    name="childPrice"
                                    value={formData.childPrice}
                                    onChange={handleChange}
                                    placeholder="799"
                                />
                            </div>

                            <div style={fieldWrap}>
                                <label style={labelStyle}>Duration</label>
                                <input
                                    className="wt-input"
                                    style={inputStyle}
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="Full day, Half day"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                            <label style={labelStyle}>Highlights</label>
                            <textarea
                                className="wt-textarea"
                                style={{
                                    ...inputStyle,
                                    minHeight: "120px",
                                }}
                                name="highlights"
                                value={formData.highlights}
                                onChange={handleChange}
                                placeholder="Beach, Water sports, Sunset view"
                            />
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <label style={labelStyle}>Timeslots</label>
                            <textarea
                                className="wt-textarea"
                                style={{
                                    ...inputStyle,
                                    minHeight: "120px",
                                }}
                                name="timeslots"
                                value={formData.timeslots}
                                onChange={handleChange}
                                placeholder="8:00 AM, 10:00 AM, 1:00 PM, 3:00 PM"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: "100%",
                                padding: "14px",
                                background: submitting
                                    ? "rgba(212,168,71,0.5)"
                                    : "#D4A847",
                                border: "none",
                                borderRadius: "10px",
                                color: "#1a1200",
                                fontSize: "14px",
                                fontWeight: "700",
                                cursor: submitting ? "not-allowed" : "pointer",
                            }}
                        >
                            {submitting ? "Saving..." : "Add Booking Details"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddBooking;
