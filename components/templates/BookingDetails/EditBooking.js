"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBooking = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    tourName: "",
    adultPrice: "",
    childPrice: "",
    duration: "",
    highlights: "",
    timeslots: "",
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/get-booking-by-id/${id}`);
        const item = res?.data?.data?.data;
        if (item) {
          setForm({
            tourName: item.tourName || "",
            adultPrice: item.adultPrice ?? "",
            childPrice: item.childPrice ?? "",
            duration: Array.isArray(item.duration) ? item.duration.join(", ") : item.duration || "",
            highlights: Array.isArray(item.highlights) ? item.highlights.join(", ") : item.highlights || "",
            timeslots: Array.isArray(item.timeslots) ? item.timeslots.join(", ") : item.timeslots || "",
          });
        }
      } catch (err) {
        toast.error("Data load karne mein error aaya.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        tourName: form.tourName,
        adultPrice: Number(form.adultPrice),
        childPrice: Number(form.childPrice),
        duration: form.duration.split(",").map((s) => s.trim()).filter(Boolean),
        highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean),
        timeslots: form.timeslots.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await axios.put(`/api/update-booking-detail-by-id/${id}`, payload);
      toast.success("Booking successfully updated!");
      router.push("/listBookingDetails")
    } catch (err) {
      toast.error("Update failed. Dobara try karein.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const s = {
    page: { padding: "28px 24px", background: "#0b1520", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif" },
    card: { background: "#0d1b2a", border: "1px solid #1e293b", borderRadius: 12, padding: "28px 24px", maxWidth: 560 },
    title: { color: "#f1f5f9", fontSize: 20, fontWeight: 600, margin: "0 0 4px" },
    subtitle: { color: "#64748b", fontSize: 13, margin: "0 0 24px" },
    label: { display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: "0.04em" },
    input: {
      width: "100%", boxSizing: "border-box",
      background: "rgba(255,255,255,0.05)", border: "1px solid #1e293b",
      borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#e2e8f0",
      outline: "none", marginBottom: 16,
    },
    hint: { color: "#475569", fontSize: 11, marginTop: -12, marginBottom: 16 },
    btnRow: { display: "flex", gap: 10, marginTop: 8 },
    btnSave: {
      background: "#D4A847", border: "none", color: "#1a1000",
      padding: "9px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700,
      cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
    },
    btnCancel: {
      background: "transparent", border: "1px solid #1e293b", color: "#94a3b8",
      padding: "9px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer",
    },
    loadingText: { color: "#64748b", fontSize: 14, padding: "64px 0", textAlign: "center" },
  };

  if (loading) return (
    <div style={s.page}>
      <p style={s.loadingText}>Loading booking data...</p>
    </div>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <div style={s.page}>
        <div style={s.card}>
          <h2 style={s.title}>Edit Booking Details</h2>
          <p style={s.subtitle}>Changes save hone ke baad redirect ho jaayega.</p>

          <form onSubmit={handleSubmit}>

            <label style={s.label}>TOUR NAME</label>
            <input
              style={s.input} name="tourName"
              value={form.tourName} onChange={handleChange}
              placeholder="e.g. Elephanta Island Tour" required
            />

            {/* FIX: type="number" — pehle type="num" tha */}
            <label style={s.label}>ADULT PRICE (₹)</label>
            <input
              style={s.input} name="adultPrice" type="num" min="0"
              value={form.adultPrice} onChange={handleChange}
              placeholder="e.g. 1500" required
            />

            <label style={s.label}>CHILD PRICE (₹)</label>
            <input
              style={s.input} name="childPrice" type="num" min="0"
              value={form.childPrice} onChange={handleChange}
              placeholder="e.g. 800" required
            />

            <label style={s.label}>DURATION</label>
            <input
              style={s.input} name="duration"
              value={form.duration} onChange={handleChange}
              placeholder="e.g. 3 Hours, Half Day"
            />
            <p style={s.hint}>Comma se alag karein — e.g. 3 Hours, Half Day</p>

            <label style={s.label}>HIGHLIGHTS</label>
            <input
              style={s.input} name="highlights"
              value={form.highlights} onChange={handleChange}
              placeholder="e.g. Cave Tour, Boat Ride, Sunset View"
            />
            <p style={s.hint}>Comma se alag karein</p>

            <label style={s.label}>TIMESLOTS</label>
            <input
              style={s.input} name="timeslots"
              value={form.timeslots} onChange={handleChange}
              placeholder="e.g. 9:00 AM, 12:00 PM, 3:00 PM"
            />
            <p style={s.hint}>Comma se alag karein</p>

            <div style={s.btnRow}>
              <button type="submit" style={s.btnSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" style={s.btnCancel} onClick={() => router.push("/listBookingDetails")}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditBooking;
