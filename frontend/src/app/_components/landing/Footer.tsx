"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const element = footerRef.current as unknown as Element;

      gsap.set(element, { opacity: 0, y: 100 });

      ScrollTrigger.create({
        trigger: element,
        start: "top 100%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeave: () => {
          gsap.to(element, {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out",
          });
        },
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: -100,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const linkSx = {
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    "&:hover": { color: "#ffffff" },
  };

  return (
    <Box
      ref={footerRef}
      id="contact"
      component="footer"
      sx={{
        px: { xs: 2, md: 5 },
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 5 },
        width: "100%",
        bgcolor: "#0a2540",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background blobs */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.35), rgba(0,191,165,0.25))",
          borderRadius: "50%",
          filter: "blur(12px)",
          opacity: 0.35,
        }}
        aria-hidden
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          background:
            "linear-gradient(135deg, rgba(255,122,0,0.35), rgba(106,13,173,0.25))",
          borderRadius: "50%",
          filter: "blur(12px)",
          opacity: 0.25,
        }}
        aria-hidden
      />

      <Grid
        container
        spacing={6}
        direction={isMobile ? "column" : "row"}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {/* Brand + blurb */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 1 }}
          >
            <LocalHospitalIcon sx={{ color: "#00bfa5" }} />
            <Typography variant="h6" fontWeight={700}>
              FastClaim
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.85)" }}
          >
            Automating health insurance claims with FHIR/X12 integrations,
            eligibility checks, coverage validation, fraud detection, real‑time
            audits, and instant notifications.
          </Typography>

          <Chip
            icon={<DashboardIcon />}
            label="Powered by Ballerina"
            size="small"
            sx={{
              mt: 2,
              bgcolor: "rgba(255,255,255,0.08)",
              color: "#fff",
              borderColor: "rgba(255,255,255,0.2)",
            }}
            variant="outlined"
          />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Link
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <GitHubIcon fontSize="small" />
            </Link>
            <Link
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <TwitterIcon fontSize="small" />
            </Link>
          </Stack>
        </Grid>

        {/* Company */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Company
          </Typography>
          <Stack spacing={1.2}>
            <Link href="#about" style={linkSx as any}>
              About
            </Link>
            <Link href="#features" style={linkSx as any}>
              Features
            </Link>
            <Link href="/dashboard" style={linkSx as any}>
              Dashboard
            </Link>
            <Link href="/claim" style={linkSx as any}>
              Submit Claim
            </Link>
          </Stack>
        </Grid>

        {/* Resources */}
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Resources
          </Typography>
          <Stack spacing={1.2}>
            <Link href="/docs" style={linkSx as any}>
              API Docs
            </Link>
            <Link href="#stats" style={linkSx as any}>
              Live Metrics
            </Link>
            <Link href="/changelog" style={linkSx as any}>
              Changelog
            </Link>
            <Link href="/status" style={linkSx as any}>
              Status
            </Link>
          </Stack>
        </Grid>

        {/* Contact */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Contact
          </Typography>
          <Stack spacing={1.2} sx={{ color: "rgba(255,255,255,0.85)" }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <EmailOutlinedIcon fontSize="small" />
              <Typography
                component="a"
                href="mailto:contact@fastclaim.dev"
                sx={{
                  ...linkSx,
                  display: "inline-block",
                }}
              >
                contact@fastclaim.dev
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <PhoneOutlinedIcon fontSize="small" />
              <Typography
                component="a"
                href="tel:+15550100"
                sx={{
                  ...linkSx,
                  display: "inline-block",
                }}
              >
                +1 (555) 0100
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <LocationOnOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                2972 Westheimer Rd, Santa Ana, IL 85486
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />

      <Box sx={{ textAlign: "center", color: "rgba(255,255,255,0.75)" }}>
        <Typography variant="caption">
          © {new Date().getFullYear()} FastClaim All
          rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
