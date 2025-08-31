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

type Insurer = {
  insurer_id: string;
  name: string;
};

type InsurerRow = {
  id: string;
  insurer_id: string;
  name: string;
};

export default function Page() {
  const [rows, setRows] = React.useState<InsurerRow[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const columns: GridColDef<InsurerRow>[] = [
    { field: "insurer_id", headerName: "Insurer ID", width: 160 },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "last-column",
      width: 200,
    },
  ];

  const toRows = (data: any): InsurerRow[] => {
    // Accept shapes: { insurers: [...] } or [...] or stringified array
    let list: Insurer[] = [];
    const payload = Array.isArray(data) ? data : data?.insurers;

    if (Array.isArray(payload)) {
      list = payload as Insurer[];
    } else if (typeof payload === "string") {
      try {
        const parsed = JSON.parse(payload);
        if (Array.isArray(parsed)) list = parsed as Insurer[];
      } catch {
        list = [];
      }
    }

    return (list || []).map((i) => ({
      id: i.insurer_id,
      insurer_id: i.insurer_id,
      name: i.name,
    }));
  };

  const fetchInsurers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/insurers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to load insurers (${res.status})`);
      }
      const json = await res.json();
      setRows(toRows(json));
    } catch (e: any) {
      setError(e?.message || "Failed to load insurers");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInsurers();
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 3, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchInsurers}
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
          <CustomDataGrid<InsurerRow> rows={rows} columns={columns} />
        )}
      </Box>
    </Paper>
  );
}
