"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";

import { getStatusColor, getStatusIcon } from "../../_helpers/colorhelper";
import CustomDataGrid from "../../_components/CustomDataGrid";

import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type ClaimStatus = "pending" | "approved" | "rejected" | string;

export interface ClaimRow {
  id: string | number;
  employeeName?: string;
  departmentName?: string;
  type?: string;
  claimDate?: string | Date | null;
  submission_date?: string | Date | null;
  status?: ClaimStatus;
  claimUrl?: string | null;
}

interface ClaimsDataGridProps {
  claims: ClaimRow[];
  loading: boolean;
  handleUpdateStatus?: (record: ClaimRow, action: "approve" | "reject") => void;
  showApprovalActions?: boolean;
}

export default function ClaimsDataGrid({
  claims,
  loading,
  handleUpdateStatus,
  showApprovalActions = false,
}: ClaimsDataGridProps) {
  const columns: GridColDef<ClaimRow>[] = [
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 150,
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 150,
    },
    { field: "type", headerName: "Type", width: 110 },
    {
      field: "claimDate",
      headerName: "Claim Date",
      width: 140,
      renderCell: (params: GridRenderCellParams<ClaimRow, ClaimRow["claimDate"]>) =>
        params.value ? dayjs(params.value).format("MMM DD, YYYY") : "-",
    },
    {
      field: "submission_date",
      headerName: "Submitted",
      width: 140,
      renderCell: (params: GridRenderCellParams<ClaimRow, ClaimRow["submission_date"]>) =>
        params.value ? dayjs(params.value).format("MMM DD, YYYY") : "-",
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params: GridRenderCellParams<ClaimRow, ClaimRow["status"]>) => {
        const raw = (params.value || "").toString().toLowerCase();
        const icon = getStatusIcon(raw) as React.ReactNode;
        const color = getStatusColor(raw) as any; // MUI ChipColor
        const label = params.value || "-";
        return <Chip icon={icon} label={label} color={color} size="small" />;
      },
    },
    {
      field: "claimUrl",
      headerName: "Claim File",
      width: 170,
      renderCell: (params: GridRenderCellParams<ClaimRow, ClaimRow["claimUrl"]>) => {
        const claimUrl = params.value ?? "";
        if (!claimUrl) return "No file";
        const fullUrl = `http://localhost:8080${claimUrl}`;
        return (
          <Button
            component="a"
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            variant="outlined"
            size="small"
            sx={{
              fontSize: "0.75rem",
              minWidth: "auto",
              px: 1,
              py: 0.5,
            }}
            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          >
            Download
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: "last-column",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ClaimRow>) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mt: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {showApprovalActions && (params.row.status || "").toString().toLowerCase() === "pending" && (
            <>
              <Tooltip title="Approve Claim">
                <IconButton
                  size="small"
                  onClick={() => handleUpdateStatus?.(params.row, "approve")}
                  color="success"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Claim">
                <IconButton
                  size="small"
                  onClick={() => handleUpdateStatus?.(params.row, "reject")}
                  color="error"
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {loading ? <CircularProgress /> : <CustomDataGrid rows={claims} columns={columns} />}
    </Box>
  );
}
