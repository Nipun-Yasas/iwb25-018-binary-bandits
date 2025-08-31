"use client";

import { useState, MouseEvent, useEffect } from "react";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  full_name?: string;
  username?: string;
  [key: string]: unknown;
};

const UserMenu: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const menuLinkHref = isHome ? "/dashboard" : "/profile";
  const menuLabel = isHome ? "Dashboard" : "My Profile";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("user");
    } catch {}
    setAnchorEl(null);
    router.push("/login");
  };

  if (!user) return null;

  const displayName = (user.full_name || user.username || "User").toString();
  const firstWord = displayName.split(" ")[0] || displayName;
  const initials =
    displayName
      .replace(/[_-]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("") || "U";

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Divider orientation="vertical" flexItem />

      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Typography
            variant="body1"
            color="#737791"
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
            sx={{
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={displayName}
          >
            {firstWord}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: "text.secondary",
              fontSize: 18,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 220,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} href={menuLinkHref}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" sx={{ color: "#737791" }} />
          </ListItemIcon>
          <Typography variant="body2" color="text.primary">
            {menuLabel}
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "primary.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography variant="body2">Log out</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu;
