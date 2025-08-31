"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import StatItem from "./StatItem";

gsap.registerPlugin(ScrollTrigger);

// Demo metrics (replace with live values when backend endpoints are ready)
const totalClaims = 1280;
const approved = 930;
const rejected = 280;
const flagged = 70;

export default function Stats() {
  const statsRef = useRef(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const element = statsRef.current;

    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        element,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        animation: anim,
        onEnter: () => {
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
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={statsRef}
      width="100%"
      id="stats"
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 220,
          height: 220,
          background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
          borderRadius: "50%",
          opacity: 0.06,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 160,
          height: 160,
          background: "linear-gradient(135deg, #FF7A00 0%, #6A0DAD 100%)",
          borderRadius: "50%",
          opacity: 0.05,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "2.8rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Real‑time Claims Metrics
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 720, mx: "auto" }}
          >
            Track submissions, approvals, rejections, and fraud flags at a glance.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <StatItem
              icon={<ReceiptLongIcon fontSize="medium" />}
              number={totalClaims}
              text="Total Claims Submitted"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
          >
            <StatItem
              icon={<CheckCircleOutlineIcon fontSize="medium" />}
              number={approved}
              text="Approved"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <StatItem
              icon={<CancelIcon fontSize="medium" />}
              number={rejected}
              text="Rejected"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <StatItem
              icon={<ReportProblemIcon fontSize="medium" />}
              number={flagged}
              text="Fraud/Suspicious"
            />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
