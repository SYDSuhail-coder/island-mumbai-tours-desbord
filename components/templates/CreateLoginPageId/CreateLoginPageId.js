"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Delete,
} from "@mui/icons-material";

import axios from "axios";

const CreateLoginPageId = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [deleteId, setDeleteId] = useState(null);
  const [emailError, setEmailError] = useState("");


  // CREATE
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (password.length !== 6) {
  //     setError("Password must be exactly 6 characters");
  //     return;
  //   }
  //   if (password !== confirm) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  //   formData.append("roleId", roleId);
  //   formData.append("password", password);

  //   await axios.post("/api/createLoginPageId", formData);
  //   fetchList(page, limit);

  //   setName("");
  //   setEmail("");
  //   setRoleId("");
  //   setPassword("");
  //   setConfirm("");
  //   setError("");
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setEmailError("");

  if (password.length !== 6) {
    setError("Password must be exactly 6 characters");
    return;
  }

  if (password !== confirm) {
    setError("Passwords do not match");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("roleId", roleId);
  formData.append("password", password);

  try {
    const res = await axios.post("/api/createLoginPageId", formData);

    if (res.data.statusCode !== 200) {
      if (res.data.errorType === "EMAIL_EXISTS") {
        setEmailError("Email already exists");
      } else {
        setError(res.data.message || "Something went wrong");
      }
      return;
    }

    // success
    fetchList(page, limit);
    setName("");
    setEmail("");
    setRoleId("");
    setPassword("");
    setConfirm("");
    setError("");
    setEmailError("");

  } catch (err) {
    setError("Server error");
  }
};


  // LIST
  const fetchList = async (pageNo = page, perPage = limit) => {
    const res = await fetch(`/api/listLoginPageId?From=${pageNo}&to=${perPage}`);
    const data = await res.json();
    setList(data.data || []);
  };

  useEffect(() => {
    fetchList(page, limit);
  }, [page, limit]);

  // DELETE
  const handleDelete = async () => {
    await axios.delete(`/api/deleteLoginPageId/${deleteId}`);
    setDeleteId(null);
    fetchList(page, limit);
  };

  return (
    <Box p={4}
      sx={{
        minHeight: "110vh",
        background: "linear-gradient(177deg, #ecfdf1, #065f35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}>
      <Grid container spacing={4}>
        {/* CREATE FORM */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, bgcolor: "" }}>
            <Typography variant="h5" align="center" color="black" mb={3}>
              Create Role Id
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                required
                error={Boolean(emailError)}
                helperText={emailError}
              />

              <TextField
                fullWidth
                label="Role Id"
                margin="normal"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Password"
                margin="normal"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ maxLength: 6 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                margin="normal"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                inputProps={{ maxLength: 6 }}
                required
              />

              {error && (
                <Typography color="error" align="center" mt={1}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
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
                Create Role
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* LIST TABLE */}
        <Paper
          sx={{
            p: 4,
            width: "100%",
          }}
        >
          <Typography variant="h5" align="center" color="black" mb={3}>
            List Roles Id
          </Typography>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
              size="small"
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ background: "linear-gradient(177deg, #ecfdf1, #065f35)" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>RoleId</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: "red" }}>
                      No Data Found
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">{item.email}</TableCell>
                      <TableCell align="center">{item.roleId}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => setDeleteId(item._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this role?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateLoginPageId;
