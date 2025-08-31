"use client";

import React from "react";
import Box from "@mui/material/Box";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import Chip from "@mui/material/Chip";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";
import CustomDataGrid from "../../_components/CustomDataGrid";

type ClaimStatus = "pending" | "approved" | "rejected" | string;

export interface ClaimRow {
  id: string | number;

  claim_id: string;
  patient_id: string | number;
  policy_id: string | number;
  provider_id: string | number;
  diagnosis_code: string;
  procedure_code: string;
  claim_amount: number;
  status?: ClaimStatus;
  decision_reason?: string | null;
}

interface ClaimsDataGridProps {
  claims: ClaimRow[];
  loading: boolean;
  handleUpdateStatus?: (record: ClaimRow, action: "approve" | "reject") => void;
  showApprovalActions?: boolean;
}

const fmtMoney = (n: number) =>
  isFinite(n as number)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(n)
    : "-";

export default function ClaimsDataGrid({
  claims,
  loading,
}: ClaimsDataGridProps) {
  const columns: GridColDef<ClaimRow>[] = [
    { field: "claimId", headerName: "Claim ID", width: 90 },
    { field: "patientId", headerName: "Patient ID", width: 90 },
    { field: "policyId", headerName: "Policy ID", width: 100 },
    { field: "providerId", headerName: "Provider ID", width: 100 },
    { field: "diagnosisCode", headerName: "Diagnosis Code", width: 120 },
    { field: "procedureCode", headerName: "Procedure Code", width: 120 },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      renderCell: (params: GridRenderCellParams<ClaimRow, number>) =>
        fmtMoney(Number(params.value ?? 0)),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (
        params: GridRenderCellParams<ClaimRow, ClaimRow["status"]>
      ) => {
        const raw = (params.value || "").toString().toLowerCase();
        const icon = getStatusIcon(raw) as React.ReactNode;
        const color = getStatusColor(raw) as any;
        const label = params.value || "-";
        return <Chip icon={icon} label={label} color={color} size="small" />;
      },
    },
    {
      field: "decisionReason",
      headerName: "Decision",
      flex: 1,
      minWidth: 220,
      headerClassName: "last-column",
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {loading ? (
        <Quantum size="45" speed="1.75" color="#5AA9F9" />
      ) : (
        <CustomDataGrid<ClaimRow> rows={claims} columns={columns} autoHeight />
      )}
    </Box>
  );
}
