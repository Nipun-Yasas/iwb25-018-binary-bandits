"use client";

import { useState, MouseEvent } from "react";
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
import LogoutIcon from "@mui/icons-material/Logout";
// import { usePathname } from "next/navigation";

const UserMenu: React.FC = () => {
  // const { user, logout } = useAuth();
  // const pathname = usePathname();
  // const isHome = pathname === "/";
  // const menuLinkHref = isHome ? "/dashboard" : "/profile";
  // const menuLabel = isHome ? "Dashboard" : "My Profile";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // const handleLogout = async () => {
  //   await logout();
  //   handleCloseMenu();
  // };

  // if (!user) {
  //   return null;
  // }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Divider orientation="vertical" flexItem />

      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            // src={user.avatar || undefined}
            // alt={user.name}
            sx={{
              width: 44,
              height: 44,
              background:
                "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            {/* Fallback icon only if no avatar */}
            {/* {!user.avatar && <PersonOutlineIcon fontSize="small" />} */} user
          </Avatar>
          <Typography
            variant="body1"
            color="#737791"
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
          >
            {/* {user.name.split(" ")[0]} */}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: "text.secondary",
              fontSize: 11,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 200,
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
        {/* <Link href={menuLinkHref} >
          <MenuItem >
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" sx={{ color: "#737791" }} />
            </ListItemIcon>
            <Typography variant="body2" color="text.primary">
              {menuLabel}
            </Typography>
          </MenuItem>
        </Link> */}

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleCloseMenu} sx={{ color: "primary.main" }}>
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
