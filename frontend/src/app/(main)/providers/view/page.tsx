"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

import CustomDataGrid from "../../_components/CustomDataGrid";
import type { GridColDef } from "@mui/x-data-grid";

type Provider = {
  provider_id: string;
  name: string;
  type: string;
};

type ProviderRow = {
  id: string;
  provider_id: string;
  name: string;
  type: string;
};

export default function ProvidersPage() {
  const [rows, setRows] = React.useState<ProviderRow[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const columns: GridColDef<ProviderRow>[] = [
    { field: "provider_id", headerName: "Provider ID", width: 160 },
    { field: "name", headerName: "Name", flex: 1, width: 200 },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "last-column",
      width: 150,
    },
  ];

  const parseProvidersToRows = (data: any): ProviderRow[] => {
    // Backend may return providers as an array or a JSON string. Support both.
    let providers: Provider[] = [];
    const payload = data?.providers;

    if (Array.isArray(payload)) {
      providers = payload as Provider[];
    } else if (typeof payload === "string") {
      try {
        const parsed = JSON.parse(payload);
        if (Array.isArray(parsed)) providers = parsed as Provider[];
      } catch {
        // ignore parse error; will fall back to empty list
      }
    }

    return (providers || []).map((p) => ({
      id: p.provider_id,
      provider_id: p.provider_id,
      name: p.name,
      type: p.type,
    }));
  };

  const fetchProviders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/providers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to load providers (${res.status})`);
      }
      const json = await res.json();
      setRows(parseProvidersToRows(json));
    } catch (e: any) {
      setError(e?.message || "Failed to load providers");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchProviders}
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

      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <Quantum size="45" speed="1.75" color="#5AA9F9" />
          </Box>
        ) : (
          <CustomDataGrid<ProviderRow> rows={rows} columns={columns} />
        )}
      </Box>
    </Paper>
  );
}
