"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Box,
  InputAdornment,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const LIMIT = 5;

const bookingTypeLabel = {
  tours: "Tour",
  "private-tour": "Private Tour",
  "book-now-page": "Book Now",
};

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function formatAmount(n) {
  if (n === undefined || n === null) return "-";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export default function Users() {
  const [bookings, setBookings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1); // 1-indexed for MUI Pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-section-api?from=${pageNumber}&to=${LIMIT}`, {
        method: "GET",
        cache: "no-store",
      });
      const json = await res.json();
      const result = json?.data || [];
      const confirmedOnly = result.filter((b) => b.bookingStatus === "Confirmed");

      // latest booking sabse upar - date ke hisaab se descending sort
      confirmedOnly.sort((a, b) => new Date(b.date) - new Date(a.date));

      setBookings(confirmedOnly);
      setTotalCount(json?.totalcount || 0);
    } catch (err) {
      console.error(err);
      setError("API se data nahi aaya. Server check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  function handlePageChange(_, value) {
    setPage(value);
  }

  const filtered = bookings.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name?.toLowerCase().includes(q) ||
      b.tour?.toLowerCase().includes(q) ||
      b.guideName?.toLowerCase().includes(q) ||
      b.bookingId?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "#0d1b2a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 3,
        color: "#e8edf2",
      }}
    >
      <CardHeader
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        title={
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Confirmed bookings: {filtered.length}
          </Typography>
        }
        action={
          <TextField
            size="small"
            placeholder="Search name, tour, guide..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.4)" }} />
                </InputAdornment>
              ),
              sx: {
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.06)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              },
            }}
          />
        }
      />

      {error && (
        <Box px={2} pb={1}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {loading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress size={24} sx={{ color: "#D4A847" }} />
        </Stack>
      )}

      {!loading && filtered.length === 0 && !error && (
        <Box py={4} textAlign="center">
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
            No confirmed booking was found.
          </Typography>
        </Box>
      )}

      {!loading && filtered.length > 0 && (
        <List disablePadding>
          {filtered.map((b, i) => (
            <ListItem
              key={b._id || b.bookingId}
              divider={i < filtered.length - 1}
              sx={{ borderColor: "rgba(255,255,255,0.04)" }}
              secondaryAction={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" fontWeight={500} sx={{ color: "#D4A847" }}>
                    {formatAmount(b.totalAmount)}
                  </Typography>
                  <Chip
                    label={b.bookingStatus}
                    size="small"
                    sx={{ bgcolor: "#E1F5EE", color: "#0F6E56", fontWeight: 500 }}
                  />
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#D4A847", color: "#1a1200", fontWeight: 600 }}>
                  {b.name?.charAt(0) || "?"}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ color: "#e8edf2" }}>
                    {b.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.35)" }}>
                      {b.tour} · {formatDate(b.date)} · {bookingTypeLabel[b.bookingType] || b.bookingType}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.25)" }}>
                      {b.bookingId}
                    </Typography>
                  </>
                }
              />

              <Box mr={10} minWidth={120}>
                <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.35)" }}>
                  Guide
                </Typography>
                <Typography variant="body2" sx={{ color: "#9fd6c2" }}>
                  {b.guideName || "-"}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" py={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": { color: "rgba(255,255,255,0.6)" },
              "& .Mui-selected": {
                bgcolor: "#D4A847 !important",
                color: "#1a1200 !important",
              },
            }}
          />
        </Box>
      )}
    </Card>
  );
}
