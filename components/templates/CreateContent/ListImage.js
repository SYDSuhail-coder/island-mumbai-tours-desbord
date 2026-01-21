"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TableRow,
  Paper, Button, Stack, Select,
  MenuItem, FormControl,
  InputLabel, Typography
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Pagination from "@mui/material/Pagination";

const ListImageMUI = () => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();


  const fetchList = async () => {
    const res = await axios.get(`/api/list-image-content?from=${currentPage}&to=${pageLimit}`);
    setList(res.data.data || []);
    setTotalCount(res.data.totalcount || 0);
    setTotalPages(Math.ceil(res.data.totalcount / pageLimit));
  };

  useEffect(() => {
    fetchList();
  }, [currentPage, pageLimit]);

  const handleDelete = async (id) => {
    window.confirm("Are you sure you want to delete this item?");
    await axios.delete(`/api/delete-image-content/${id}`);
    fetchList();
  };

  const handleEdit = (id) => {
    router.push(`/updateImage/${id}`);
  };


  return (
    <Paper sx={{ p: 3, minHeight: "100vh" }}>
      <Typography variant="h4" align="center" sx={{
        fontWeight: 70,
        letterSpacing: '1px',
        color: '#2c3e50',
        textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        marginBottom: -5,
      }}>
        Movie List
      </Typography>
      {/* Page Size Selector */}
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="show-entries-label">Show entries</InputLabel>
          <Select
            label="show-entries-label"
            value={pageLimit}
            onChange={(e) => {
              setPageLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "linear-gradient(177deg, #ecfdf1, #065f35)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Movie Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Content ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Video</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "red", fontWeight: "bold" }}>
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              list.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.movieName}</TableCell>
                  <TableCell>{item.contentId}</TableCell>
                  <TableCell>
                    <img src={item.file} alt="movie" width={80} />
                  </TableCell>
                  <TableCell>
                    <a href={item.videoLink} target="_blank" rel="noreferrer">
                      Watch
                    </a>
                  </TableCell>
                  <TableCell>{item.rating}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="primary" size="small"
                        onClick={() => handleEdit(item._id)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography>
          Page {currentPage} of {totalPages} • {totalCount} Records
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          shape="rounded"
          color="primary"
        />
      </Stack>
    </Paper>
  );
};

export default ListImageMUI;
