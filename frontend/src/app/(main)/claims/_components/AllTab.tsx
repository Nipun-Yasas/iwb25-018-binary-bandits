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

interface AllTabProps {
  claims: Claim[];
  loading: boolean;
  handleUpdateStatus: (record: Claim, action: "approve" | "reject") => void;
}

export default function AllTab({ claims, loading, handleUpdateStatus }: AllTabProps) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <ClaimsDataGrid
        claims={claims}
        loading={loading}
        handleUpdateStatus={handleUpdateStatus}
        showApprovalActions={true}
      />
    </Box>
  );
}
