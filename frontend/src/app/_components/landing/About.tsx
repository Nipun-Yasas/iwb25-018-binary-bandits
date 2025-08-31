"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RuleIcon from "@mui/icons-material/Rule";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    if (!aboutRef.current) return;

    const ctx = gsap.context(() => {
      const element = aboutRef.current;

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
        onLeave: () => {
          gsap.to(element, {
            opacity: 0,
            y: 100,
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
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={aboutRef}
      id="about"
      overflow="hidden"
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: { xs: 6, md: 10 },
      }}
    >
      {/* Left Side: Illustration */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 0 },
        }}
      >
        {/* Animated background shapes */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            backgroundColor: "#1976d2",
            borderRadius: "50% 60% 10% 90% / 20% 30% 60% 80%",
            height: 250,
            width: 200,
            top: "60%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.1,
          }}
        />

        <motion.div
          animate={{
            rotate: -360,
            y: [0, -20, 0],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            width: 300,
            height: 400,
            backgroundColor: "#00bfa5",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.08,
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Image
            src="/img2.svg"
            alt="Insurance Claims Platform"
            width={400}
            height={400}
            priority
            style={{
              height: "auto",
              width: "100%",
              maxWidth: "450px",
              filter: "drop-shadow(0 10px 30px rgba(25, 118, 210, 0.2))",
            }}
          />
        </motion.div>
      </Box>

      {/* Right Side: Text */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          position: "relative",
          textAlign: { xs: "center", md: "left" },
          p: 2.5,
          zIndex: 2,
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: 2,
              }}
            >
              ABOUT FASTCLAIM
            </Typography>

            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                mt: 2,
                mb: 3,
                background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              Automating Health Insurance Claims for the Future
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                mb: 4,
                fontWeight: 400,
              }}
            >
              FastClaim streamlines healthcare claim processing with FHIR and
              X12 standards, real-time eligibility checks, fraud detection, and
              instant notifications. Built for hackathons, ready for production.
            </Typography>

            {/* Key Features */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                  }}
                >
                  <LocalHospitalIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    FHIR Claim Submission
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accepts hospital claims in FHIR JSON format.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 191, 165, 0.1)",
                  }}
                >
                  <VerifiedUserIcon color="secondary" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Eligibility & Coverage Checks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Validates insurance and policy rules instantly.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                  }}
                >
                  <RuleIcon sx={{ color: "#FFC107" }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Fraud & Duplicate Detection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prevents double billing and flags suspicious claims.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ color: "#4CAF50" }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Automated Approvals & Rejections
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Returns instant responses with claim IDs and reasons.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                  }}
                >
                  <DashboardIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Real-Time Audit Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visualizes claims, approvals, rejections, and fraud.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 87, 34, 0.1)",
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: "#FF5722" }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Instant Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifies doctors/admins via Email, SMS, or Slack.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
