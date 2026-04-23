"use client";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { deleteModules, getModules } from '../reduxForLogin/action';
import { useRouter } from "next/navigation";

//MUI Imports
import {
  Box, Typography, TextField, Button, InputAdornment, IconButton,
  CircularProgress, Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  PersonOutline, LockOutlined, Visibility, VisibilityOff, East,
} from "@mui/icons-material";

//Theme — matches your Dashboard dark navy + gold
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#D4A847" },
    background: { default: "#0b1520", paper: "#0d1b2a" },
    error: { main: "#E24B4A" },
    text: { primary: "#e8edf2", secondary: "rgba(232,237,242,0.5)" },
  },
  typography: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  shape: { borderRadius: 10 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.04)",
          "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
          "&:hover fieldset": { borderColor: "rgba(212,168,71,0.4) !important" },
          "&.Mui-focused fieldset": { borderColor: "#D4A847 !important", borderWidth: "1px !important" },
          "&.Mui-focused": { backgroundColor: "rgba(212,168,71,0.05)", boxShadow: "0 0 0 3px rgba(212,168,71,0.1)", borderRadius: 10 },
        },
        input: { color: "#e8edf2", fontSize: 14, padding: "12px 14px" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: "rgba(232,237,242,0.45)", fontSize: 13,
          "&.Mui-focused": { color: "#D4A847" },
        },
      },
    },
  },
});

const LoginAlready = () => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length !== 6) {
      setError("Password must be exactly 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("password", password);

      const res = await axios.post("/api/loginAlready", formData);
      if (res.data.statusCode !== 200) {
        setError("Invalid userName or password");
        return;
      }
      const { userInfo, roleInfo } = res.data;
      dispatch(deleteModules());
      dispatch(getModules({
        userId: userInfo._id,
        userName: userInfo.userName,
        roleInfo: roleInfo,
        isLogin: true,
      }));

      if (roleInfo.role_name === "admin") {
        router.push("/dashboard");
      } else if (roleInfo.role_name === "manager") {
        router.push("/addUsers");
      } else {
        const firstAllowedModule = roleInfo.modules.find(m => m.allowed === true);
        const firstAllowedPage = firstAllowedModule?.pages.find(p => p.allowed === true);
        router.push(`/${firstAllowedPage?.name}`);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: "100vh",
        background: "#0b1520",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient background blobs */}
        <Box sx={{ position:"absolute", width:500, height:500, borderRadius:"50%", top:-150, left:-150, background:"radial-gradient(circle,rgba(212,168,71,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
        <Box sx={{ position:"absolute", width:400, height:400, borderRadius:"50%", bottom:-100, right:-100, background:"radial-gradient(circle,rgba(26,58,92,0.6) 0%,transparent 70%)", pointerEvents:"none" }} />

        {/* Grid texture */}
        <Box sx={{ position:"absolute", inset:0, opacity:0.03, backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />

        {/* Card */}
        <Box sx={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 420,
          bgcolor: "rgba(13,27,42,0.97)",
          border: "1px solid rgba(212,168,71,0.25)",
          borderRadius: "20px",
          p: "40px 36px",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,71,0.06)",
          backdropFilter: "blur(20px)",
        }}>

          {/* Logo + Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: "14px",
              background: "linear-gradient(135deg, #D4A847, #b88a2e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 1.5,
              boxShadow: "0 8px 24px rgba(212,168,71,0.35)",
            }}>
              {/* Boat SVG */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17l1-6h16l1 6"/><path d="M12 3v8"/><path d="M8 8l4-5 4 5"/>
                <path d="M1 21c2 0 4-1 6-1s4 1 6 1 4-1 6-1"/>
              </svg>
            </Box>

            <Typography sx={{ fontSize: 11, color: "primary.main", letterSpacing: "0.15em", fontWeight: 700, mb: 0.75 }}>
              MUMBAI ISLAND TOURS
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your dashboard
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(212,168,71,0.3),transparent)", mb: 3.5 }} />

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

            {/* Username */}
            <TextField
              label="Username"
              type="text"
              required
              fullWidth
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              placeholder="Enter your username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ fontSize: 18, color: "rgba(232,237,242,0.4)" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <Box>
              <TextField
                label="Password (6 Characters)"
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ maxLength: 6 }}
                placeholder="••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ fontSize: 18, color: "rgba(232,237,242,0.4)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: "rgba(232,237,242,0.4)" }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password strength bar — 6 dots */}
              <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
                {[1,2,3,4,5,6].map(i => (
                  <Box key={i} sx={{
                    flex: 1, height: 3, borderRadius: 99,
                    bgcolor: i <= password.length
                      ? password.length <= 2 ? "#E24B4A"
                      : password.length <= 4 ? "#EF9F27"
                      : "#1D9E75"
                      : "rgba(255,255,255,0.08)",
                    transition: "background-color 0.3s",
                  }} />
                ))}
              </Box>
            </Box>

            {/* Your original error — styled */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  bgcolor: "rgba(226,75,74,0.1)",
                  border: "1px solid rgba(226,75,74,0.3)",
                  borderRadius: 2,
                  color: "#E24B4A",
                  fontSize: 13,
                  "& .MuiAlert-icon": { color: "#E24B4A" },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Submit button — your original disabled + loading logic */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              endIcon={!loading && <East sx={{ fontSize: 16 }} />}
              sx={{
                mt: 0.5,
                py: 1.5,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.04em",
                color: "#1a1200",
                background: loading
                  ? "rgba(212,168,71,0.4)"
                  : "linear-gradient(135deg, #D4A847, #b88a2e)",
                borderRadius: "10px",
                boxShadow: loading ? "none" : "0 4px 24px rgba(212,168,71,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #e0b84f, #c4962f)",
                  boxShadow: "0 6px 28px rgba(212,168,71,0.45)",
                },
                "&.Mui-disabled": {
                  color: "rgba(26,18,0,0.6)",
                  background: "rgba(212,168,71,0.4)",
                },
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={18} thickness={5} sx={{ color: "#1a1200" }} />
                  <span>Please wait...</span>
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 3, color: "rgba(232,237,242,0.25)" }}>
            Protected admin area · Mumbai Island Tours © 2026
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginAlready;
