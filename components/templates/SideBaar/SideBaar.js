"use client"
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
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

import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import PinOutlinedIcon from '@mui/icons-material/PinOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteModules } from "../reduxForLogin/action";
import { usePathname } from "next/navigation";

const drawerWidth = 240;
export default function SideBaar(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const loginDetails = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const { window } = props;
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = () => {
    dispatch(deleteModules());
    router.push("/login");
  };

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const handleClick1 = () => { setOpen1(!open1); };
  const handleClick2 = () => { setOpen2(!open2); };
  const handleClick3 = () => { setOpen3(!open3); };

  const [Dashboard, setDashboard] = useState({
    id: 0, allowed: false,
    pages: [
      { id: 0, allowed: false },
      { id: 0, allowed: false }
    ]
  });

  const [Users, setUsers] = useState({
    id: 0, allowed: false,
    pages: [
      { id: 0, allowed: false }
    ]
  });

  useEffect(() => {
    const modules = loginDetails?.roleInfo?.modules;
    if (!modules) return;

    // id se dhundo — index se nahi
    const dashboardModule = modules.find(m => m.id === 390600);
    const usersModule = modules.find(m => m.id === 500001);

    if (dashboardModule) {
      setDashboard({
        id: dashboardModule.id,
        allowed: dashboardModule.allowed,
        pages: [
          {
            id: dashboardModule.pages[0]?.id || 0,
            allowed: dashboardModule.pages[0]?.allowed || false
          },
          {
            id: dashboardModule.pages[1]?.id || 0,
            allowed: dashboardModule.pages[1]?.allowed || false
          }
        ]
      });
    }

    if (usersModule) {
      setUsers({
        id: usersModule.id,
        allowed: usersModule.allowed,
        pages: [{
          id: usersModule.pages[0]?.id || 0,
          allowed: usersModule.pages[0]?.allowed || false
        }]
      });
    }
  }, []);

  useEffect(() => {
    if (pathname === "/dashboard" || pathname === "/reports") { setOpen1(true); }
    if (pathname === "/addUsers") { setOpen2(true); }
  }, [pathname]);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        color: "#065f46",
        background: "linear-gradient(177deg, #ecfdf1, #065f35)",
      }}
    >
      {Dashboard.id == 390600 && Dashboard.allowed == true ? (
        <List>
          <ListItemButton onClick={handleClick1} sx={{ color: "black" }}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: "black" }} />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            {Dashboard?.pages[0].id == 966260 && Dashboard?.pages[0].allowed == true ? (
              <ListItemButton
                component={Link}
                href="/dashboard"
                sx={{
                  backgroundColor: isActive("/dashboard") ? "rgba(6,95,70,0.1)" : "transparent",
                  textAlign: "left",
                  marginLeft: "12px",
                }}
              >
                <ListItemIcon>
                  <DashboardIcon sx={{ color: "success" }} />
                </ListItemIcon>
                <ListItemText primary="dashboard" sx={{ color: "success" }} />
              </ListItemButton>
            ) : (
              <></>
            )}

            {Dashboard?.pages[1].id == 966261 && Dashboard?.pages[1].allowed == true ? (
              <ListItemButton
                component={Link}
                href="/reports"
                sx={{
                  backgroundColor: isActive("/reports") ? "rgba(6,95,70,0.1)" : "transparent",
                  textAlign: "left",
                  marginLeft: "12px",
                }}
              >
                <ListItemIcon>
                  <ProductionQuantityLimitsOutlinedIcon sx={{ color: "success" }} />
                </ListItemIcon>
                <ListItemText primary="reports" sx={{ color: "ProductionQuantityLimitsOutlinedIcon" }} />
              </ListItemButton>
            ) : (
              <></>
            )}
          </Collapse>
        </List>
      ) : (
        <></>
      )}

      {Users.id == 500001 && Users.allowed == true ?
        <List>
          <ListItemButton onClick={handleClick2} sx={{ color: "black" }}>
            <ListItemIcon>
              <LoginOutlinedIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Users Group" sx={{ color: "black" }} />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            {Users?.pages[0].id == 500002 && Users?.pages[0].allowed == true ?
              <ListItemButton
                sx={{
                  backgroundColor: isActive("/addUsers") ? "rgba(0,128,0,0.1)" : "transparent",
                  textAlign: "left",
                  marginLeft: "12px",
                }}
                component={Link}
                href="/addUsers"
              >
                <ListItemIcon>
                  <PinOutlinedIcon sx={{ color: "success" }} />
                </ListItemIcon>
                <ListItemText primary="add-Users" sx={{ color: "success" }} />
              </ListItemButton>
              : <></>}
          </Collapse>
        </List>
        : <></>}
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
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

      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <div>{props.children}</div>
      </Box>
    </Box>
  );
}

