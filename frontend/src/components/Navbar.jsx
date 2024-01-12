import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Header from "./Header";
import { Link } from "react-router-dom";
import ConfirmationWindow from "./ConfirmationWindow";
import Logout from "../components/Logout";

const pages = ["Konkursy", "Wydarzenia", "Blog", "użytkownicy"];
const settings = ["Profil", "Moje prace", "Dashboard"];
const settingsLinks = {
  Profil: "/profile",
};
const pagesLinks = {
  Konkursy: "/",
  Wydarzenia: "/",
  Blog: "/",
  użytkownicy: "/users",
};

function ResponsiveAppBar() {
  const [openPopup, setOpenPopup] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem("userData")) || {},
  );

  const accessToken = sessionStorage.getItem("accessToken");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isStaff = userData.is_staff === true;
  const filteredPages = isStaff
    ? pages
    : pages.filter((page) => page !== "użytkownicy");

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ padding: "10px" }}>
          <div style={{ paddingRight: "20px" }}>
            <Header logoSize="150px"></Header>
          </div>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {filteredPages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {filteredPages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "black", display: "block" }}
                component={Link}
                to={pagesLinks[page]}
              >
                {page}
              </Button>
            ))}
          </Box>
          {accessToken ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to={settingsLinks[setting]}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
                <Logout></Logout>
              </Menu>
            </Box>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ color: "black" }}
            >
              Zaloguj się
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
