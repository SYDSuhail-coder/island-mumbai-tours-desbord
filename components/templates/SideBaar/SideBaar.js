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
// import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteModules } from "../reduxForLogin/action";

const drawerWidth = 240;
export default function SideBaar(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const loginDetails = useSelector((state) => state.login);
  console.log("response", loginDetails)
  const dispatch = useDispatch();
  const { window } = props;
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
  const [Dashboard, setDashboard] = useState({
    id: 0, allowed: false,
    pages: [
      { id: 0, allowed: false }
    ]
  });

  // const [liveImage, setliveImage] = useState({
  //   id: 0, allowed: false,
  //   pages: [
  //     { id: 0, allowed: false },
  //     { id: 0, allowed: false },
  //   ]
  // })

  // const [createLogin, setcreateLogin] = useState({
  //   id: 608611, allowed: true,
  //   pages: [
  //     { id: 620511, allowed: true },
  //   ],
  // })


  // useEffect(() => {
  //    console.log("hello loginDetails",loginDetails)
  //   setDashboard({
  //     id: loginDetails.roleInfo.modules[0].id,
  //     allowed: loginDetails.roleInfo.modules[0].allowed,
  //     pages: [{
  //       id: loginDetails.roleInfo.modules[0].pages[1].id,
  //       allowed: loginDetails.roleInfo.modules[0].pages[1].allowed
  //     }]
  //   })
  // }, [loginDetails])



  useEffect(() => {
    const modules = loginDetails?.roleInfo?.modules;

    if (!modules || modules.length === 0) {
      console.warn("No modules found");
      return;
    }

    const dashboardModule = modules.find(
      (m) => m.id === 390600 && m.allowed
    );

    if (!dashboardModule) return;

    setDashboard({
      id: dashboardModule.id,
      allowed: dashboardModule.allowed,
      pages: dashboardModule.pages || []
    });

  }, [loginDetails]);


  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const handleClick3 = () => {
    setOpen3(!open3);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        color: "#065f46",
        background: "linear-gradient(177deg, #ecfdf1, #065f35)",
      }}
    >
      {/* <Typography variant="h6" sx={{ p: 2 }}>
         Dashboard
      </Typography> */}

      {Dashboard.allowed &&
        Dashboard.pages?.some(p => p.id === 966260 && p.allowed) && (
          <ListItemButton sx={{ pl: 4 }} component={Link} href="/dashboard">
            <ListItemIcon>
              <DashboardIcon sx={{ color: "success" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        )}


      {/* {liveImage.id == 390600 && liveImage.allowed == true ?
        <List>
          <ListItemButton onClick={handleClick2} sx={{ color: "success" }}>
            <ListItemIcon>
              <ProductionQuantityLimitsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Latest Products" sx={{ color: "success" }} />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            {liveImage?.pages[0].id == 966260 && liveImage?.pages[0].allowed == true ?
              <ListItemButton sx={{ pl: 4 }} component={Link} href="/liveImage">
                <ListItemIcon>
                  <ImageSearchOutlinedIcon sx={{ color: "success" }} />
                </ListItemIcon>
                <ListItemText primary="Live-Image" sx={{ color: "success" }} />
              </ListItemButton>
              : <></>}

            {liveImage?.pages[1].id == 966260 && liveImage?.pages[1].allowed == true ?
              <ListItemButton sx={{ pl: 4 }} component={Link} href="/listImage">
                <ListItemIcon>
                  <PlaylistAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="List-Image" sx={{ color: "success" }} />
              </ListItemButton>
              : <></>}
          </Collapse>
        </List>
        : <></>} */}

      {/* {createLogin.id == 608611 && createLogin.allowed == true ?
        <List>
          <ListItemButton onClick={handleClick3} sx={{ color: "success" }}>
            <ListItemIcon>
              <LoginOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Login-Page-Id" sx={{ color: "success" }} />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open3} timeout="auto" unmountOnExit>
            {createLogin?.pages[0].id == 620511 && createLogin?.pages[0].allowed == true ?
              <ListItemButton sx={{ pl: 4 }} component={Link} href="/createLoginPageId">
                <ListItemIcon>
                  <PinOutlinedIcon sx={{ color: "success" }} />
                </ListItemIcon>
                <ListItemText primary="Page-Id" sx={{ color: "success" }} />
              </ListItemButton>
              : <></>}
          </Collapse>
        </List>
        : <></>} */}
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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

      {/* DRAWER */}
      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        <Drawer
          container={container}
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
        <div>{props.children}</div>

      </Box>
    </Box>
  );
}


