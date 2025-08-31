"use client";

import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FeatureCard from "../cards/FeatureCard";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b13c7aa8df0d4a4578ed55c84338d712df64bdf5?placeholderIfAbsent=true",
    title: "Claim Submission API",
    description:
      "Hospitals send FHIR JSON claims. Ballerina HTTP service ingests and validates the payload.",
  },
  {
    icon:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1045b19a06e7b491cf827f92292b67f2c9307d88?placeholderIfAbsent=true",
    title: "Eligibility Check",
    description:
      "Verify insurance at claim time (X12 270/271) and return an instant yes/no response.",
  },
  {
    icon:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5942b330e8bc0ee6d4844e2b21aa3cd507baa5bd?placeholderIfAbsent=true",
    title: "Coverage Validation",
    description:
      "Rules engine enforces policy limits (e.g., 10 physio visits/year) and rejects overages.",
  },
  {
    icon:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/00258e499d1eb8f616c6485b18a5a4c3fbba0e8e?placeholderIfAbsent=true",
    title: "Duplicate/Fraud Detection",
    description:
      "Prevent double billing (same patient/procedure/date) and flag unusual repeat patterns.",
  },
];

export default function Features() {
  const featureRef = useRef(null);

  useEffect(() => {
    if (!featureRef.current) return;

    const ctx = gsap.context(() => {
      const element = featureRef.current;

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
    }, featureRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Box
        ref={featureRef}
        id="features"
        sx={{
          backgroundColor: "background.default",
          py: { xs: 5, md: 6 },
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 3 }}>
          Insurance Claims Platform Features
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            gap: 2,
          }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Box>
      </Box>
    </>
  );
}
