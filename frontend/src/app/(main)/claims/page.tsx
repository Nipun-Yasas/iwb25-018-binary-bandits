"use client";

import React, { useState, useEffect } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

import PendingTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllTab from "./_components/AllTab";
import TabPanel from "../../_components/main/TabPanel";

type ClaimStatus = "pending" | "approved" | "rejected" | string;

interface Claim {
  id: string | number;
  status?: ClaimStatus;

  // Required claim fields to render
  claim_id: string;
  patient_id: string | number;
  policy_id: string | number;
  provider_id: string | number;
  diagnosis_code: string;
  procedure_code: string;
  claim_amount: number;
  decision_reason?: string | null;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export default function Page() {
  const [tabValue, setTabValue] = useState<number>(0);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<ClaimStatus>("all");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const toClaims = (data: any): Claim[] => {
    const list = Array.isArray(data) ? data : data?.data ?? data?.claims ?? data;
    if (!Array.isArray(list)) return [];

    return list.map((r: any, idx: number): Claim => {
      const claimId = String(r.claim_id ?? r.id ?? `row-${idx}`);
      const status = (r.status ?? "").toString().trim().toLowerCase();
      return {
        id: claimId,
        status,
        claim_id: claimId,
        patient_id: r.patient_id ?? "",
        policy_id: r.policy_id ?? "",
        provider_id: r.provider_id ?? "",
        diagnosis_code: r.diagnosis_code ?? "",
        procedure_code: r.procedure_code ?? "",
        claim_amount: Number(r.claim_amount ?? 0),
        decision_reason: r.decision_reason ?? null,
      };
    });
  };

  const fetchClaims = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/claims", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to fetch claims (${res.status})`);
      }
      const json = await res.json();
      setClaims(toClaims(json));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to fetch claims";
      setClaims([]);
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const showSnackbar = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const getFilteredClaims = (status: ClaimStatus): Claim[] => {
    if (status === "all") return claims;
    return claims.filter((t) => (t.status || "").toString().toLowerCase() === status);
  };

  const pendingCount = claims.filter((l) => (l.status || "").toString().toLowerCase() === "pending").length;

  const tabProps = {
    claims,
    loading,
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={
                <Badge badgeContent={pendingCount} color="warning">
                  Pending
                </Badge>
              }
            />
            <Tab label="Approved" />
            <Tab label="Rejected" />
            <Tab label="All Claims" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <PendingTab {...tabProps} claims={getFilteredClaims("pending")} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ApprovedTab {...tabProps} claims={getFilteredClaims("approved")} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <RejectedTab {...tabProps} claims={getFilteredClaims("rejected")} />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <AllTab {...tabProps} claims={getFilteredClaims("all")} />
          </TabPanel>
        </>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
