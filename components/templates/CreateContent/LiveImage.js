"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput
} from "@mui/material";

const LiveImage = () => {
  const [movieName, setMovieName] = useState("");
  const [contentId, setContentId] = useState("");
  const [files, setFiles] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("movieName", movieName);
      formData.append("contentId", contentId);
      formData.append("files", files);
      formData.append("videoLink", videoLink);
      formData.append("rating", rating);

      await axios.post("/api/image-content", formData);
      router.push("/listImage");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "110vh",
        background: "linear-gradient(177deg, #ecfdf1, #065f35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 800,
          minHeight: 450,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mt={6}
        >
          Add Movie
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Movie Name"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
            />
            <TextField
              label="Content ID"
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              required
              fullWidth
              size="medium"
            />
            <FormControl fullWidth>
              <FormLabel>
                Choose Image <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <OutlinedInput type="file" onChange={(e) => setFiles(e.target.files[0])} />
            </FormControl>
            <TextField
              label="Video Link"
              type="url"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              required
              fullWidth
              size="medium"
            />
            <TextField
              label="Rating (1-5)"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              fullWidth
              size="medium"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                background: "linear-gradient(177deg, #ecfdf1, #065f35)",
                color: "black",
                fontWeight: "bold",
                py: 1.6,
                fontSize: "16px",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    sx={{ color: "black", mr: 1 }}
                  />
                  Submitting...
                </>
              ) : (
                "Add Movie"
              )}
            </Button>
          </Grid>
        </Box>
      </Paper>

    </Box>
  );
};

export default LiveImage;
