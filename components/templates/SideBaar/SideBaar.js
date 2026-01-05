"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";

import Link from "next/link";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function SideBaar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        color: "#065f46",
        background: "linear-gradient(177deg, #ecfdf1, #065f35)",

      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Zyra Dashboard
      </Typography>

      <List>
        {/* Dashboard */}
        <ListItemButton component={Link} href="/dashboard">
          <ListItemIcon sx={{ color: "#065f46" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} href="/liveImage">
          <ListItemIcon sx={{ color: "#065f46" }}>
            <ImageSearchOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Live Image" />
        </ListItemButton>

        {/* Settings Menu */}
        <ListItemButton onClick={() => setOpenMenu(!openMenu)}>
          <ListItemIcon sx={{ color: "#065f46" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
          {openMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              href="/dashboard/profile"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Profile" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/dashboard/users"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Users" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* TOP BAR */}
      <AppBar
        position="fixed"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: "linear-gradient(187deg, #ecfdf5, #065f46)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ color: "#065f46" }}>
            <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* PAGE CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
