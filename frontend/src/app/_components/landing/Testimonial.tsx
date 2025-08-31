"use client";

import { useRef, useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme, useMediaQuery } from "@mui/material";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TestimonialCard from "../cards/TestimonialCard";
import BackgroundShape from "../background/BackgroundShape";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonialData: Testimonial[] = [
  {
    quote:
      "Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim. Amet consectetur adipiscing",
    author: "Kath Sullivan",
    role: "CEO at Ordian IT",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim. Amet consectetur adipiscing",
    author: "Elsie Stroud",
    role: "CEO at Edwards",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim. Amet consectetur adipiscing",
    author: "Kathy Sullivan",
    role: "CEO at Ordian IT",
  },
];

const Testimonials: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const testimonialsRef = useRef(null);

  useEffect(() => {
    if (!testimonialsRef.current) return;

    const ctx = gsap.context(() => {
      const element = testimonialsRef.current;

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
    }, testimonialsRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={testimonialsRef}
      id="testimonials"
      py={2}
      px={3}
      position="relative"
      display="flex"
      justifyContent="center"
    >
      <Box maxWidth="1350px" width="100%">
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Testimonial
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          mt={4}
          maxWidth="578px"
          mx="auto"
        ></Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          mt={6}
          flexWrap={isMobile ? "wrap" : "nowrap"}
        >
          {testimonialData.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </Grid>

        <BackgroundShape
          className="shape1"
          color="#00B4D8"
          opacity={0.16}
          width={240}
          height={234}
          cx={120}
          cy={117}
          rx={120}
          ry={117}
        />
        <BackgroundShape
          className="shape2"
          color="#0077B6"
          opacity={0.05}
          width={192}
          height={197}
          cx={96}
          cy={98.5}
          rx={96}
          ry={98.5}
        />
      </Box>
    </Box>
  );
};

export default Testimonials;
