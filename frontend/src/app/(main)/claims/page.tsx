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
import CircularProgress from "@mui/material/CircularProgress";

import PendingTab from "./_components/PendingTab";
import ApprovedTab from "./_components/ApprovedTab";
import RejectedTab from "./_components/RejectedTab";
import AllTab from "./_components/AllTab";
import ActionDialog from "./_components/ActionDialog";
import TabPanel from "../../_components/main/TabPanel";

type ClaimStatus = "pending" | "approved" | "rejected" | string;

interface Claim {
  id: string | number;
  status?: ClaimStatus;
  // ...add other fields from your API if needed
}

interface User {
  id: string | number;
  roles?: string[];
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
  const [selectedRecord, setSelectedRecord] = useState<Claim | null>(null);
  const [filterStatus, setFilterStatus] = useState<ClaimStatus>("all");
  const [openActionDialog, setOpenActionDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "">("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchClaims = async (): Promise<void> => {
    setLoading(true);
    try {
      // let response: AxiosResponse<Claim[]>;
      // if (isSuperAdmin) {
      //   response = await axiosInstance.get<Claim[]>(API_PATHS.CLAIMS.GET_ALL);
      // } else {
      //   response = await axiosInstance.get<Claim[]>(
      //     API_PATHS.CLAIMS.GET_BY_ADMINID(user?.id as string | number)
      //   );
      // }
      // setClaims(
      //   (response.data || []).map((r) => ({
      //     ...r,
      //     status: r.status?.toLowerCase(),
      //   }))
      // );
    } catch (error: unknown) {
      // setClaims([]);
      // const msg = axios.isAxiosError(error)
      //   ? error.response?.data?.message || "Failed to fetch Claims"
      //   : "Failed to fetch Claims";
      // showSnackbar(msg, "error");
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

  const handleUpdateStatus = (record: Claim, action: "approve" | "reject") => {
    setSelectedRecord(record);
    setActionType(action);
    setOpenActionDialog(true);
  };

  const updateStatus = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedRecord) return;
    try {
      // await axiosInstance.put(
      //   `${API_PATHS.CLAIMS.UPDATE_STATUS(selectedRecord.id)}?status=${status}`
      // );
      // showSnackbar(
      //   `Claim ${status === "APPROVED" ? "approved" : "rejected"} successfully`
      // );
      // setOpenActionDialog(false);
      // setSelectedRecord(null);
      // await fetchClaims();
    } catch (error: unknown) {
      // const msg = axios.isAxiosError(error)
      //   ? error.response?.data?.message || "Failed to update Claim"
      //   : "Failed to update Claim";
      // showSnackbar(msg, "error");
    }
  };

  const showSnackbar = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const getFilteredClaims = (status: ClaimStatus): Claim[] => {
    if (status === "all") return claims;
    return claims.filter((t) => t.status === status);
    // If status casing differs, ensure both are normalized:
    // return claims.filter((t) => (t.status || "").toLowerCase() === (status || "").toLowerCase());
  };

  const pendingCount = claims.filter((l) => l.status === "pending").length;

  const tabProps = {
    claims,
    loading,
    handleUpdateStatus,
    filterStatus,
    setFilterStatus,
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 2 }}>
        {/* {!user ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : ( */}
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
              <ApprovedTab
                {...tabProps}
                claims={getFilteredClaims("approved")}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <RejectedTab
                {...tabProps}
                claims={getFilteredClaims("rejected")}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <AllTab {...tabProps} claims={getFilteredClaims("all")} />
            </TabPanel>
          </>
        {/* )} */}

        <ActionDialog
          open={openActionDialog}
          selectedRecord={selectedRecord}
          action={actionType}
          onClose={() => setOpenActionDialog(false)}
          onApprove={() => updateStatus("APPROVED")}
          onReject={() => updateStatus("REJECTED")}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
