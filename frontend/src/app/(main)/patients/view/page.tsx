"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

import type { GridColDef } from "@mui/x-data-grid";

import CustomDataGrid from "../../_components/CustomDataGrid";

type Patient = {
  patient_id?: number | string;
  name: string;
  dob: string;
  gender: string;
  address: string;
};

type PatientRow = {
  id: string;
  patient_id?: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
};

export default function Page() {
  const [rows, setRows] = React.useState<PatientRow[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const columns: GridColDef<PatientRow>[] = [
    { field: "patient_id", headerName: "Patient ID", width: 140 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "dob", headerName: "DOB", width: 140 },
    { field: "gender", headerName: "Gender", width: 120 },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 220,
      headerClassName: "last-column",
    },
  ];

  const toRows = (data: any): PatientRow[] => {
    // Accept shapes: { persons: [...] } or { patients: [...] } or [...] or stringified array
    let list: Patient[] = [];
    const payload = Array.isArray(data)
      ? data
      : (data?.persons ?? data?.patients);

    if (Array.isArray(payload)) {
      list = payload as Patient[];
    } else if (typeof payload === "string") {
      try {
        const parsed = JSON.parse(payload);
        if (Array.isArray(parsed)) list = parsed as Patient[];
      } catch {
        list = [];
      }
    }

    return (list || []).map((p, idx) => {
      const pid =
        p.patient_id !== undefined && p.patient_id !== null
          ? String(p.patient_id)
          : `tmp-${idx}`;
      // Normalize DOB to YYYY-MM-DD if it's an ISO string with time
      const dob =
        typeof p.dob === "string" && p.dob.includes("T")
          ? p.dob.split("T")[0]
          : p.dob || "";
      return {
        id: pid,
        patient_id: pid,
        name: p.name,
        dob,
        gender: p.gender,
        address: p.address,
      };
    });
  };

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/patients", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to load patients (${res.status})`);
      }
      const json = await res.json();
      setRows(toRows(json));
    } catch (e: any) {
      setError(e?.message || "Failed to load patients");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchPatients}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ minHeight: 360 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <Quantum size="45" speed="1.75" color="#5AA9F9" />
          </Box>
        ) : (
          <CustomDataGrid<PatientRow> rows={rows} columns={columns} />
        )}
      </Box>
    </Paper>
  );
}
