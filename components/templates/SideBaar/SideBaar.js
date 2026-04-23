"use client"
import React, { useState, useEffect } from "react";
import {
  AppBar, Box, Drawer, Toolbar, Typography, IconButton,
  List, ListItemButton, ListItemIcon, ListItemText, Collapse, Button,
} from "@mui/material";
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import PinOutlinedIcon from '@mui/icons-material/PinOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ReduceCapacityOutlinedIcon from '@mui/icons-material/ReduceCapacityOutlined';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { deleteModules } from "../reduxForLogin/action";
import { usePathname } from "next/navigation";
const drawerWidth = 240;

//Active route sx helper
const activeItemSx = (active) => ({
  backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
  borderLeft: active ? "3px solid #D4A847" : "3px solid transparent",
  borderRadius: "0 6px 6px 0",
  marginLeft: "12px",
  marginRight: "8px",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
});

const activeIconSx = (active) => ({
  color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
});

const activeTextSx = (active) => ({
  "& .MuiListItemText-primary": {
    color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
    fontSize: 13,
  },
});

export default function SideBaar(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const loginDetails = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const { window } = props;
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    dispatch(deleteModules());
    router.push("/login");
  };

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);

  const handleClick1 = () => setOpen1(!open1);
  const handleClick2 = () => setOpen2(!open2);
  const handleClick3 = () => setOpen3(!open3);
  const handleClick4 = () => setOpen4(!open4);

  // ── State
  const [Dashboard, setDashboard] = useState({
    id: 0, allowed: false,
    pages: [
      { id: 0, allowed: false },
      { id: 0, allowed: false },
      { id: 0, allowed: false },
      { id: 0, allowed: false },
    ],
  });
  const [Users, setUsers] = useState({
    id: 0, allowed: false,
    pages: [{ id: 0, allowed: false }],
  });
  const [popularIsland, setpopularIsland] = useState({
    id: 0, allowed: false,
    pages: [{ id: 0, allowed: false }],
  });
  const [mumbaiWalking, setmumbaiWalking] = useState({
    id: 0, allowed: false,
    pages: [{ id: 0, allowed: false }],
  });

  // ── Load modules from redux
  useEffect(() => {
    const modules = loginDetails?.roleInfo?.modules;
    if (!modules) return;

    const dashboardModule = modules.find(m => m.id === 390600);
    const usersModule = modules.find(m => m.id === 500001);
    const popularIslandModule = modules.find(m => m.id === 500003);
    const mumbaiWalkingModule = modules.find(m => m.id === 123456);

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
          },
          {
            id: dashboardModule.pages[2]?.id || 0,
            allowed: dashboardModule.pages[2]?.allowed || false
          },
          {
            id: dashboardModule.pages[3]?.id || 0,
            allowed: dashboardModule.pages[3]?.allowed || false
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

    if (popularIslandModule) {
      setpopularIsland({
        id: popularIslandModule.id,
        allowed: popularIslandModule.allowed,
        pages: [{
          id: popularIslandModule.pages[0]?.id || 0,
          allowed: popularIslandModule.pages[0]?.allowed || false
        }]
      });
    }
    if (mumbaiWalkingModule) {
      setmumbaiWalking({
        id: mumbaiWalkingModule.id,
        allowed: mumbaiWalkingModule.allowed,
        pages: [{
          id: mumbaiWalkingModule.pages[0]?.id || 0,
          allowed: mumbaiWalkingModule.pages[0]?.allowed || false
        }]
      });
    }

  }, [loginDetails]);

  //Auto open dropdown on active route 
  useEffect(() => {
    if (["/dashboard", "/reports", "/packages", "/users"].includes(pathname)) setOpen1(true);
    if (pathname === "/addUsers") setOpen2(true);
    if (pathname === "/popularIsland") setOpen3(true);
    if (pathname === "/mumbaiWalking") setOpen4(true);
  }, [pathname]);

  //Drawer content
  const drawer = (
    <Box sx={{ height: "100%", background: "#0d1b2a", overflowY: "auto" }}>

      {/* Logo */}
      <Box sx={{ px: 2.5, py: 3, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Typography sx={{ color: "#D4A847", fontWeight: 600, fontSize: 15 }}>
          Mumbai Island Tours
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 11, mt: 0.5, letterSpacing: "0.08em" }}>
          ADMIN PANEL
        </Typography>
      </Box>

      {/*Dashboard Module*/}
      {Dashboard.id === 390600 && Dashboard.allowed === true && (
        <List disablePadding sx={{ mt: 1 }}>
          <ListItemButton onClick={handleClick1} sx={{ px: 2, py: 1.2, color: "#D4A847" }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DashboardIcon sx={{ color: "#D4A847", fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Overview" sx={{ "& .MuiListItemText-primary": { color: "#D4A847", fontSize: 14, fontWeight: 600 } }} />
            {open1
              ? <ExpandLess sx={{ color: "#D4A847", fontSize: 18 }} />
              : <ExpandMore sx={{ color: "#D4A847", fontSize: 18 }} />}
          </ListItemButton>
          <Collapse in={open1} timeout="auto" unmountOnExit>

            {/* dashboard */}
            {Dashboard.pages[0].id === 966260 && Dashboard.pages[0].allowed && (
              <ListItemButton component={Link} href="/dashboard" sx={activeItemSx(isActive("/dashboard"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <DashboardIcon sx={activeIconSx(isActive("/dashboard"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="dashboard" sx={activeTextSx(isActive("/dashboard"))} />
              </ListItemButton>
            )}

            {/* Booking-Reports */}
            {Dashboard.pages[1].id === 966261 && Dashboard.pages[1].allowed && (
              <ListItemButton component={Link} href="/reports" sx={activeItemSx(isActive("/reports"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <LibraryBooksOutlinedIcon sx={activeIconSx(isActive("/reports"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Booking-Reports" sx={activeTextSx(isActive("/reports"))} />
              </ListItemButton>
            )}

            {/* packages-Reports */}
            {Dashboard.pages[2].id === 500006 && Dashboard.pages[2].allowed && (
              <ListItemButton component={Link} href="/packages" sx={activeItemSx(isActive("/packages"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <ProductionQuantityLimitsOutlinedIcon sx={activeIconSx(isActive("/packages"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="packages-Reports" sx={activeTextSx(isActive("/packages"))} />
              </ListItemButton>
            )}

            {/* Users-Reports */}
            {Dashboard.pages[3].id === 500007 && Dashboard.pages[3].allowed && (
              <ListItemButton component={Link} href="/users" sx={activeItemSx(isActive("/users"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <ReduceCapacityOutlinedIcon sx={activeIconSx(isActive("/users"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Users-Reports" sx={activeTextSx(isActive("/users"))} />
              </ListItemButton>
            )}

          </Collapse>
        </List>
      )}

      {/*Users Module*/}
      {Users.id === 500001 && Users.allowed === true && (
        <List disablePadding>
          <ListItemButton onClick={handleClick2} sx={{ px: 2, py: 1.2, color: "#D4A847" }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LoginOutlinedIcon sx={{ color: "#D4A847", fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Users Group" sx={{ "& .MuiListItemText-primary": { color: "#D4A847", fontSize: 14, fontWeight: 600 } }} />
            {open2
              ? <ExpandLess sx={{ color: "#D4A847", fontSize: 18 }} />
              : <ExpandMore sx={{ color: "#D4A847", fontSize: 18 }} />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            {Users.pages[0].id === 500002 && Users.pages[0].allowed && (
              <ListItemButton component={Link} href="/addUsers" sx={activeItemSx(isActive("/addUsers"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <PinOutlinedIcon sx={activeIconSx(isActive("/addUsers"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="add-Users" sx={activeTextSx(isActive("/addUsers"))} />
              </ListItemButton>
            )}
          </Collapse>
        </List>
      )}

      {/*Popular Island Module*/}
      {popularIsland.id === 500003 && popularIsland.allowed === true && (
        <List disablePadding>
          <ListItemButton onClick={handleClick3} sx={{ px: 2, py: 1.2, color: "#D4A847" }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <StarsOutlinedIcon sx={{ color: "#D4A847", fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Popular Island" sx={{ "& .MuiListItemText-primary": { color: "#D4A847", fontSize: 14, fontWeight: 600 } }} />
            {open3
              ? <ExpandLess sx={{ color: "#D4A847", fontSize: 18 }} />
              : <ExpandMore sx={{ color: "#D4A847", fontSize: 18 }} />}
          </ListItemButton>
          <Collapse in={open3} timeout="auto" unmountOnExit>
            {popularIsland.pages[0].id === 500004 && popularIsland.pages[0].allowed && (
              <ListItemButton component={Link} href="/popularIsland" sx={activeItemSx(isActive("/popularIsland"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <AirplaneTicketOutlinedIcon sx={activeIconSx(isActive("/popularIsland"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Island-Reports" sx={activeTextSx(isActive("/popularIsland"))} />
              </ListItemButton>
            )}
          </Collapse>
        </List>
      )}

      {/*Mumbai Walking Module*/}
      {mumbaiWalking.id === 123456 && mumbaiWalking.allowed === true && (
        <List disablePadding>
          <ListItemButton onClick={handleClick4} sx={{ px: 2, py: 1.2, color: "#D4A847" }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <StarsOutlinedIcon sx={{ color: "#D4A847", fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Mumbai Walking" sx={{ "& .MuiListItemText-primary": { color: "#D4A847", fontSize: 14, fontWeight: 600 } }} />
            {open4
              ? <ExpandLess sx={{ color: "#D4A847", fontSize: 18 }} />
              : <ExpandMore sx={{ color: "#D4A847", fontSize: 18 }} />}
          </ListItemButton>
          <Collapse in={open4} timeout="auto" unmountOnExit>
            {mumbaiWalking.pages[0].id === 500005 && mumbaiWalking.pages[0].allowed && (
              <ListItemButton component={Link} href="/mumbaiWalking" sx={activeItemSx(isActive("/mumbaiWalking"))}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <AirplaneTicketOutlinedIcon sx={activeIconSx(isActive("/mumbaiWalking"))} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Walking-Reports" sx={activeTextSx(isActive("/mumbaiWalking"))} />
              </ListItemButton>
            )}
          </Collapse>
        </List>
      )}

    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", background: "#0b1520", minHeight: "100vh" }}>

      {/*AppBar*/}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: { sm: `${drawerWidth}px` },
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          background: "#0d1b2a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "#D4A847" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#D4A847", fontSize: 15 }}>
            {/* Mumbai Island Tours */}
          </Typography>
          <Button onClick={handleLogout} sx={{ color: "#D4A847", minWidth: "auto" }}>
            <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>

      {/* ── Drawer nav*/}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>

        {/* Mobile drawer */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, background: "#0d1b2a", color: "#fff", boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, background: "#0d1b2a", color: "#fff", boxSizing: "border-box" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/*Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0,
          background: "#0b1520",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        {props.children}
      </Box>

    </Box>
  );
}

