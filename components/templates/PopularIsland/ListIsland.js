"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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


//Image Preview Dialog
const ImagePreviewDialog = ({ open, onClose, images = [], title }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={700}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhotoLibraryOutlinedIcon sx={{ color: "#d97706" }} />
                Gallery — {title}
            </Box>
        </DialogTitle>
        <DialogContent>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 1.5,
                }}
            >
                {images.map((src, i) => (
                    <Box
                        key={i}
                        component="img"
                        src={src}
                        alt={`image-${i + 1}`}
                        sx={{
                            width: "100%",
                            aspectRatio: "4/3",
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1.5px solid #e5d9c3",
                        }}
                    />
                ))}
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderColor: "#d97706", color: "#d97706" }}>Close</Button>
        </DialogActions>
    </Dialog>
);

//Main Component
const ListIsland = () => {
    const router = useRouter();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({});
    const [deleting, setDeleting] = useState(false);
    const [imageDialog, setImageDialog] = useState({ open: false, images: [], title: "" });

    // ── Fetch
    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        setLoading(true);

        try {
            const res = await axios.get("/api/get-island-page");

            console.log(res.data);

            const json = res.data;

            const raw =
                json?.result?.data ||
                json?.result ||
                json?.data ||
                [];

            setTours(Array.isArray(raw) ? raw : []);
        } catch (err) {
            console.error("Fetch Error:", err);
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    // Delete
    const openDelete = (slug, title) => setDeleteDialog({ open: true, slug, title });
    const closeDelete = () => setDeleteDialog({ open: false, id: null, title: "" });

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/api/delete-island-page?slug=${deleteDialog.slug}`);
            setTours((prev) =>prev.filter((t) => t._slug !== deleteDialog.slug) );
            alert("Deleted Successfully");
        } catch (err) {
            console.error(err);

            alert("Delete failed");
        } finally {
            setDeleting(false);
            closeDelete();
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", background: "#fdf8f2" }}>

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: "#1c1408" }}>Mumbai Private Tours</Typography>
                    <Typography variant="body2" sx={{ color: "#92400e" }}>
                        {tours.length} tour{tours.length !== 1 ? "s" : ""} listed
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => router.push("/popularIsland")}
                    sx={{
                        background: "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)",
                        color: "#fff",
                        fontWeight: 700,
                        boxShadow: "0 4px 16px rgba(217,119,6,0.28)",
                        "&:hover": { background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)" },
                    }}
                >
                    Add Tour
                </Button>
            </Box>

            <Card elevation={2} sx={{ borderRadius: 3, border: "1px solid #e5d9c3", boxShadow: "0 4px 24px rgba(180,120,0,0.08)" }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress sx={{ color: "#d97706" }} />
                        </Box>
                    ) : tours.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography sx={{ color: "#92400e" }}>No tours found.</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#fef3c7" }}>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }}>Title</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }}>Info</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }}>Pricing</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }}>Rating</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }}>Images</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#92400e", borderBottom: "2px solid #fde68a" }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tours.map((tour) => (
                                        <TableRow
                                            key={tour._id}
                                            hover
                                            sx={{ "&:last-child td": { border: 0 }, verticalAlign: "top", "&:hover": { bgcolor: "#fffbf0 !important" } }}
                                        >

                                            {/* Tour — cover + title + badge + description */}
                                            <TableCell sx={{ minWidth: 240, borderBottom: "1px solid #f0e8d8" }}>
                                                <Box sx={{ display: "flex", gap: 1.5 }}>
                                                    <Avatar
                                                        src={tour.coverImage}
                                                        alt={tour.title}
                                                        variant="rounded"
                                                        sx={{ width: 60, height: 60, flexShrink: 0, border: "1.5px solid #e5d9c3" }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.3, color: "#1c1408" }}>
                                                            {tour.title}
                                                        </Typography>
                                                        {tour.badge && (
                                                            <Chip
                                                                label={tour.badge}
                                                                size="small"
                                                                sx={{ height: 18, fontSize: 10, mb: 0.5, background: "linear-gradient(135deg, #d97706, #fbbf24)", color: "#fff", fontWeight: 600 }}
                                                            />
                                                        )}
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: "#78350f",
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                maxWidth: 180,
                                                            }}
                                                        >
                                                            {tour.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Info — location, duration, transport, maxGuests, freeCancellation */}
                                            <TableCell sx={{ minWidth: 180, borderBottom: "1px solid #f0e8d8" }}>
                                                <Stack spacing={0.6}>
                                                    <Typography variant="caption" sx={{ color: "#92400e" }}>
                                                        📍 {tour.location}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: "#b45309" }} />
                                                        <Typography variant="caption" sx={{ color: "#4b3a1f" }}>{tour.duration}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <DirectionsCarOutlinedIcon sx={{ fontSize: 13, color: "#b45309" }} />
                                                        <Typography variant="caption" sx={{ color: "#4b3a1f" }}>{tour.transport}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <PeopleAltOutlinedIcon sx={{ fontSize: 13, color: "#b45309" }} />
                                                        <Typography variant="caption" sx={{ color: "#4b3a1f" }}>Max {tour.maxGuests} guests</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        {tour.freeCancellation ? (
                                                            <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "success.main" }} />
                                                        ) : (
                                                            <CancelOutlinedIcon sx={{ fontSize: 13, color: "error.main" }} />
                                                        )}
                                                        <Typography variant="caption" color={tour.freeCancellation ? "success.main" : "error.main"}>
                                                            {tour.freeCancellation ? "Free Cancellation" : "No Cancellation"}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            {/* Pricing */}
                                            <TableCell sx={{ minWidth: 110, borderBottom: "1px solid #f0e8d8" }}>
                                                <Typography variant="body2" fontWeight={700} sx={{ color: "#d97706" }}>
                                                    ₹{tour.pricePerPerson}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#92400e" }}>per person</Typography>
                                                <br />
                                                <Typography variant="caption" sx={{ color: "#92400e" }}>
                                                    Child: ₹{tour.child}
                                                </Typography>
                                            </TableCell>

                                            {/* Rating */}
                                            <TableCell sx={{ minWidth: 130, borderBottom: "1px solid #f0e8d8" }}>
                                                <Rating value={Number(tour.rating)} precision={0.1} readOnly size="small" sx={{ "& .MuiRating-iconFilled": { color: "#f59e0b" } }} />
                                                <Typography variant="caption" sx={{ color: "#78350f" }} display="block">
                                                    {tour.rating} · {tour.reviewsCount} reviews
                                                </Typography>
                                            </TableCell>

                                            {/* Images — thumbnails + count + view button */}
                                            <TableCell sx={{ minWidth: 150, borderBottom: "1px solid #f0e8d8" }}>
                                                <AvatarGroup
                                                    max={3}
                                                    sx={{
                                                        justifyContent: "flex-start",
                                                        "& .MuiAvatar-root": { width: 36, height: 36, fontSize: 12, border: "1.5px solid #e5d9c3 !important" },
                                                    }}
                                                >
                                                    {(tour.images || []).map((src, i) => (
                                                        <Avatar key={i} src={src} variant="rounded" alt={`img-${i}`} />
                                                    ))}
                                                </AvatarGroup>
                                                <Button
                                                    size="small"
                                                    startIcon={<PhotoLibraryOutlinedIcon />}
                                                    sx={{ mt: 0.5, fontSize: 11, p: 0, minWidth: 0, color: "#d97706" }}
                                                    onClick={() =>
                                                        setImageDialog({ open: true, images: tour.images || [], title: tour.title })
                                                    }
                                                >
                                                    {(tour.images || []).length} photos
                                                </Button>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell sx={{ borderBottom: "1px solid #f0e8d8" }}>
                                                <Chip
                                                    label={tour.isActive ? "Active" : "Inactive"}
                                                    color={tour.isActive ? "success" : "default"}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell align="center" sx={{ borderBottom: "1px solid #f0e8d8" }}>
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small" sx={{ color: "#d97706", "&:hover": { bgcolor: "#fef3c7" } }} onClick={() => router.push(`/editIsland/${tour.slug}`)}>
                                                            <EditOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton size="small" color="error" sx={{ "&:hover": { bgcolor: "#fee2e2" } }} onClick={() => openDelete(tour._id, tour.title)}>
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

            {/* ── Image Preview Dialog ── */}
            <ImagePreviewDialog
                open={imageDialog.open}
                onClose={() => setImageDialog({ open: false, images: [], title: "" })}
                images={imageDialog.images}
                title={imageDialog.title}
            />

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog open={deleteDialog.open} onClose={closeDelete} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700} sx={{ color: "#1c1408" }}>Delete Tour?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#4b3a1f" }}>
                        Are you sure you want to delete <strong style={{ color: "#d97706" }}>{deleteDialog.title}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDelete} disabled={deleting} sx={{ color: "#78350f" }}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmDelete}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ListIsland;
