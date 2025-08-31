import Image from "next/image";
import Link from "next/link";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function Hero() {
  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        minHeight: { xs: "auto", md: "85vh" },
        width: "100%",
        mt: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "rgba(25,118,210,0.25)",
          borderRadius: "50%",
          height: 300,
          width: 300,
          top: { xs: "70%", md: 120 },
          left: { xs: "-15%", md: -87 },
          zIndex: 0,
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Text content */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          justifyContent: "center",
          zIndex: 2,
          p: { xs: 2, md: 8 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Automate Health Insurance Claims
            <br />
            End‑to‑End.
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mt: 3, mb: 4, fontWeight: 400 }}
          >
            Submit FHIR claims, validate eligibility and coverage, block
            duplicates/fraud, and return instant approvals or rejections —
            powered by Ballerina.
          </Typography>

          {/* Feature highlights */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <LocalHospitalIcon sx={{ color: "#1976d2" }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                FHIR Claim Submission
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <VerifiedUserIcon sx={{ color: "#00bfa5" }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                X12 270/271 Eligibility
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <ContentCopyIcon sx={{ color: "#FF7A00" }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Duplicate/Fraud Checks
              </Typography>
            </Box>
            <Link href="/dashboard" passHref>
              <Button variant="outlined" size="large">
                Open Dashboard
              </Button>
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
            }}
          ></Box>
        </motion.div>
      </Box>

      {/* Image content */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 0 },
          height: { xs: "auto", md: "100%" },
        }}
      >
        {/* Animated background shapes */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            backgroundColor: "#1976d2",
            borderRadius: "50% 60% 10% 90% / 20% 30% 60% 80%",
            height: "60%",
            width: "60%",
            left: "20%",
            top: "30%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.1,
            maxHeight: 300,
            maxWidth: 300,
          }}
        />

        <motion.div
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            width: "40%",
            height: "40%",
            maxWidth: 200,
            maxHeight: 200,
            backgroundColor: "#00bfa5",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "20%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.15,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/img1.svg"
            alt="Automated insurance claims platform"
            width={600}
            height={600}
            priority
          />
        </motion.div>
      </Box>
    </Box>
  );
}
