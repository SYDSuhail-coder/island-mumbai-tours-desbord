"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Avatar,
    AvatarGroup,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Pagination,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import axios from "axios";

const PAGE_SIZE = 10;

const ImagePreviewDialog = ({ open, onClose, images = [], title }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhotoLibraryOutlinedIcon sx={{ color: "#D4A847" }} />
                Gallery — {title}
            </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 1.5 }}>
                {images.map((src, i) => (
                    <Box key={i} component="img" src={src} alt={`image-${i + 1}`}
                        sx={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                ))}
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderColor: "rgba(212,168,71,0.4)", color: "#D4A847" }}>Close</Button>
        </DialogActions>
    </Dialog>
);

// ── Main Component ──
const ListIsland = () => {
    const router = useRouter();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({});
    const [deleting, setDeleting] = useState(false);
    const [imageDialog, setImageDialog] = useState({ open: false, images: [], title: "" });
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => { fetchTours(page); }, [page]);

    const fetchTours = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/get-island-page?from=${pageNum}&to=${PAGE_SIZE}`);
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

    const openDelete = (slug, title) => setDeleteDialog({ open: true, slug, title });
    const closeDelete = () => setDeleteDialog({ open: false, id: null, title: "" });

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/api/delete-island-page/${deleteDialog.slug}`);
            setTours((prev) => prev.filter((t) => t.slug !== deleteDialog.slug));
            setTotalCount((prev) => prev - 1);
            toast.success("Deleted Successfully");
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
            closeDelete();
        }
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* ── Page background ── */}
            <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", background: "#0b1520" }}>

                {/* ── Header ── */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
                            List-Popular-Tours
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
                            {loading ? "Loading..." : `${totalCount} tours total`}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => router.push("/popularIsland")}
                        sx={{
                            background: "#D4A847",
                            color: "#1a1200",
                            fontWeight: 700,
                            borderRadius: 2,
                            boxShadow: "none",
                            "&:hover": { background: "#c49a38", boxShadow: "none" },
                        }}
                    >
                        Add Tour
                    </Button>
                </Box>

                {/* ── Card ── */}
                <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.07)", background: "#0d1b2a" }}>
                    <CardContent sx={{ p: 0 }}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                                <CircularProgress sx={{ color: "#D4A847" }} />
                            </Box>
                        ) : tours.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 8 }}>
                                <Typography sx={{ color: "rgba(255,255,255,0.3)" }}>No data found.</Typography>
                            </Box>
                        ) : (
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, background: "transparent" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: "rgba(255,255,255,0.03)" }}>
                                            {["Title", "Info", "Pricing", "Rating", "Images", "Status", "Actions"].map((h, i) => (
                                                <TableCell key={h} align={i === 6 ? "center" : "left"}
                                                    sx={{ fontWeight: 600, color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {tours.map((tour) => (
                                            <TableRow key={tour._id} hover
                                                sx={{ "&:last-child td": { border: 0 }, verticalAlign: "top", "&:hover": { bgcolor: "rgba(255,255,255,0.02) !important" } }}>

                                                {/* Title */}
                                                <TableCell sx={{ minWidth: 240, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <Box sx={{ display: "flex", gap: 1.5 }}>
                                                        <Avatar src={tour.coverImage} alt={tour.title} variant="rounded"
                                                            sx={{ width: 56, height: 56, flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }} />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.3, color: "#fff", fontSize: 13 }}>
                                                                {tour.title}
                                                            </Typography>
                                                            {tour.badge && (
                                                                <Chip label={tour.badge} size="small"
                                                                    sx={{ height: 18, fontSize: 9, mb: 0.5, background: "#D4A847", color: "#1a1200", fontWeight: 700 }} />
                                                            )}
                                                            <Typography variant="caption"
                                                                sx={{ color: "rgba(255,255,255,0.35)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 180 }}>
                                                                {tour.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Info */}
                                                <TableCell sx={{ minWidth: 180, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <Stack spacing={0.6}>
                                                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>📍 {tour.location}</Typography>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }} />
                                                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>{tour.duration}</Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <DirectionsCarOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }} />
                                                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>{tour.transport}</Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <PeopleAltOutlinedIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }} />
                                                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>Max {tour.maxGuests} guests</Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            {tour.freeCancellation
                                                                ? <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "#1D9E75" }} />
                                                                : <CancelOutlinedIcon sx={{ fontSize: 13, color: "#ef4444" }} />}
                                                            <Typography variant="caption" sx={{ color: tour.freeCancellation ? "#1D9E75" : "#ef4444" }}>
                                                                {tour.freeCancellation ? "Free Cancellation" : "No Cancellation"}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>

                                                {/* Pricing */}
                                                <TableCell sx={{ minWidth: 110, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <Typography variant="body2" fontWeight={700} sx={{ color: "#D4A847" }}>₹{tour.pricePerPerson}</Typography>
                                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>per person</Typography>
                                                    <br />
                                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>Child: ₹{tour.child}</Typography>
                                                </TableCell>

                                                {/* Rating */}
                                                <TableCell sx={{ minWidth: 130, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <Rating value={Number(tour.rating)} precision={0.1} readOnly size="small"
                                                        sx={{ "& .MuiRating-iconFilled": { color: "#D4A847" }, "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.15)" } }} />
                                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }} display="block">
                                                        {tour.rating} · {tour.reviewsCount} reviews
                                                    </Typography>
                                                </TableCell>

                                                {/* Images */}
                                                <TableCell sx={{ minWidth: 150, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <AvatarGroup max={3} sx={{
                                                        justifyContent: "flex-start",
                                                        "& .MuiAvatar-root": { width: 34, height: 34, fontSize: 11, border: "1px solid rgba(255,255,255,0.1) !important", borderRadius: 1.5 },
                                                    }}>
                                                        {(tour.images || []).map((src, i) => (
                                                            <Avatar key={i} src={src} variant="rounded" alt={`img-${i}`} />
                                                        ))}
                                                    </AvatarGroup>
                                                    <Button size="small" startIcon={<PhotoLibraryOutlinedIcon />}
                                                        sx={{ mt: 0.5, fontSize: 11, p: 0, minWidth: 0, color: "#D4A847" }}
                                                        onClick={() => setImageDialog({ open: true, images: tour.images || [], title: tour.title })}>
                                                        {(tour.images || []).length} photos
                                                    </Button>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <Chip
                                                        label={tour.isActive ? "Active" : "Inactive"}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={tour.isActive
                                                            ? { color: "#1D9E75", borderColor: "rgba(29,158,117,0.35)", background: "rgba(29,158,117,0.1)", fontSize: 11 }
                                                            : { color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)", fontSize: 11 }}
                                                    />
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                                                        <Tooltip title="Edit">
                                                            <IconButton size="small"
                                                                sx={{ color: "#D4A847", background: "rgba(212,168,71,0.1)", border: "1px solid rgba(212,168,71,0.2)", borderRadius: 1.5, "&:hover": { background: "rgba(212,168,71,0.2)" } }}
                                                                onClick={() => router.push(`/editIsland/${tour.slug}`)}>
                                                                <EditOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton size="small"
                                                                sx={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 1.5, "&:hover": { background: "rgba(239,68,68,0.2)" } }}
                                                                onClick={() => openDelete(tour.slug, tour.title)}>
                                                                <DeleteOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>

                {/* ── Pagination ── */}
                {!loading && totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3, gap: 2 }}>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.35)" }}>
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
                        </Typography>
                        <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} shape="rounded"
                            sx={{
                                "& .MuiPaginationItem-root": { color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)" },
                                "& .MuiPaginationItem-root:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                                "& .Mui-selected": { background: "#D4A847 !important", color: "#1a1200 !important", fontWeight: 700, borderColor: "#D4A847 !important" },
                            }}
                        />
                    </Box>
                )}

                {/* ── Image Preview Dialog ── */}
                <ImagePreviewDialog
                    open={imageDialog.open}
                    onClose={() => setImageDialog({ open: false, images: [], title: "" })}
                    images={imageDialog.images}
                    title={imageDialog.title}
                />

                {/* ── Delete Confirmation Dialog ── */}
                <Dialog open={deleteDialog.open} onClose={closeDelete} maxWidth="xs" fullWidth
                    PaperProps={{ sx: { background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3 } }}>
                    <DialogTitle fontWeight={700} sx={{ color: "#fff" }}>Delete Tour?</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: "rgba(255,255,255,0.5)" }}>
                            Are you sure you want to delete <strong style={{ color: "#D4A847" }}>{deleteDialog.title}</strong>? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={closeDelete} disabled={deleting} sx={{ color: "rgba(255,255,255,0.4)" }}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}
                            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </>
    );
};

export default ListIsland;
