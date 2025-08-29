"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const actionRef = useRef(null);

  useEffect(() => {
    if (!actionRef.current) return;

    const ctx = gsap.context(() => {
      const element = actionRef.current as unknown as Element;

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
      });
    }, actionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={actionRef}
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: 4,
        mb: { xs: 0, md: 6 },
      }}
    >
      {/* Left: Copy + CTAs */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          zIndex: 2,
          p: 2.5,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 2 }}
        >
          FASTCLAIM PLATFORM
        </Typography>

        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            lineHeight: { xs: "40px", md: "48px" },
            mt: { xs: 3, md: 2 },
            mb: { xs: 2.5, md: 2.5 },
            background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Automate Health Insurance Claims End‑to‑End
        </Typography>

        <Typography variant="h6" sx={{ display: "block", mb: 2 }} color="text.secondary">
          Submit FHIR claims, validate eligibility and coverage, detect duplicates/fraud,
          and return instant approvals or rejections.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time audit dashboard and notifications via Email/SMS/Slack powered by Ballerina
          connectors. Built for hackathon speed, ready for production.
        </Typography>

        <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap" }}>
          <Link href="/claim" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
                px: 3,
                "&:hover": {
                  background: "linear-gradient(135deg, #1565c0 0%, #009a84 100%)",
                },
              }}
            >
              Submit Test Claim
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button variant="outlined" size="large">Open Dashboard</Button>
          </Link>
          <Link href="/docs" passHref>
            <Button size="large">View API Docs</Button>
          </Link>
        </Box>
      </Box>

      {/* Right: Illustration + subtle animated shapes */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 0 },
          minHeight: 360,
        }}
      >
        {/* Shape 1 */}
        <Box
          component={motion.div}
          animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 24, repeat: Infinity, ease: "linear" },
          }}
          sx={{
            position: "absolute",
            width: { xs: 280, md: 340 },
            left: { xs: "18%", md: "22%" },
            top: "18%",
            backgroundColor: "rgba(25,118,210,0.15)",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            height: { xs: 420, md: 460 },
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            willChange: "transform",
          }}
        />
        {/* Shape 2 */}
        <Box
          component={motion.div}
          animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
            rotate: { duration: 28, repeat: Infinity, ease: "linear" },
          }}
          sx={{
            position: "absolute",
            width: { xs: 220, md: 260 },
            right: { xs: "10%", md: "18%" },
            bottom: "8%",
            backgroundColor: "rgba(0,191,165,0.18)",
            borderRadius: "50% 60% 10% 90% / 20% 30% 60% 80%",
            height: { xs: 260, md: 300 },
            transform: "translate(50%, 50%)",
            zIndex: 0,
            willChange: "transform",
          }}
        />

        {/* Illustration (replace src with your claims graphic if available) */}
        <Image
          src="/img3.svg"
          alt="Automated insurance claims"
          width={320}
          height={320}
          priority
          style={{
            position: "relative",
            zIndex: 2,
            height: "auto",
            width: "100%",
            maxWidth: "420px",
            filter: "drop-shadow(0 12px 30px rgba(25,118,210,0.25))",
          }}
        />
      </Box>
    </Box>
  );
}
