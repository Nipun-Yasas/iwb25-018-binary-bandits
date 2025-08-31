"use client";

import React from "react";
import Box from "@mui/material/Box";
import ClaimsDataGrid from "./ClaimsDataGrid";

type ClaimStatus = "pending" | "approved" | "rejected" | string;

export interface Claim {
  id: string | number;
  status?: ClaimStatus;
  // add other fields as needed
}

interface PendingTabProps {
  claims: Claim[];
  loading: boolean;
}

export default function PendingTab({
  claims,
  loading,
}: PendingTabProps) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ClaimsDataGrid
        claims={claims}
        loading={loading}
        showApprovalActions={true}
      />
    </Box>
  );
}
