"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
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
  isFinite(n as number) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n) : "-";

export default function ClaimsDataGrid({
  claims,
  loading,
}: ClaimsDataGridProps) {
  const columns: GridColDef<ClaimRow>[] = [
    { field: "claim_id", headerName: "Claim ID", width: 150 },
    { field: "patient_id", headerName: "Patient ID", width: 140 },
    { field: "policy_id", headerName: "Policy ID", width: 140 },
    { field: "provider_id", headerName: "Provider ID", width: 150 },
    { field: "diagnosis_code", headerName: "Diagnosis Code", width: 160 },
    { field: "procedure_code", headerName: "Procedure Code", width: 170 },
    {
      field: "claim_amount",
      headerName: "Amount",
      width: 140,
      renderCell: (params: GridRenderCellParams<ClaimRow, number>) => fmtMoney(Number(params.value ?? 0)),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams<ClaimRow, ClaimRow["status"]>) => {
        const raw = (params.value || "").toString().toLowerCase();
        const icon = getStatusIcon(raw) as React.ReactNode;
        const color = getStatusColor(raw) as any;
        const label = params.value || "-";
        return <Chip icon={icon} label={label} color={color} size="small" />;
      },
    },
    { field: "decision_reason", headerName: "Decision", flex: 1, minWidth: 220, headerClassName: "last-column" },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <CustomDataGrid<ClaimRow> rows={claims} columns={columns} autoHeight />
      )}
    </Box>
  );
}
