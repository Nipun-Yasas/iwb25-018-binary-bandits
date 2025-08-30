"use client";

import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";

type ActionType = "approve" | "reject" | "";

type ClaimLite = {
  id: string | number;
  employeeName?: string; // optional fallback used in message if available
};

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRecord: ClaimLite | null;
  action: ActionType;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function ActionDialog({
  open,
  onClose,
  selectedRecord,
  action,
  onApprove,
  onReject,
}: ActionDialogProps) {
  const handleClose = () => onClose();

  const subject =
    selectedRecord?.employeeName ??
    (selectedRecord?.id ? `claim #${selectedRecord.id}` : "this claim");

  const isApprove = action === "approve";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="action-dialog-title"
    >
      <DialogTitle id="action-dialog-title">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
          }}
        >
          <Typography variant="h6">
            {isApprove ? "Approve Claim" : "Reject Claim"}
          </Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {selectedRecord ? (
          <Typography variant="body1" gutterBottom>
            Are you sure you want to {isApprove ? "approve" : "reject"}{" "}
            {subject}?
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No claim selected.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Box
          sx={{
            justifyContent: { xs: "center", md: "flex-end" },
            display: "flex",
            gap: 1,
            width: "100%",
          }}
        >
          <Button variant="text" color="inherit" onClick={handleClose}>
            Cancel
          </Button>

          {isApprove ? (
            <Button
              color="success"
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={() => onApprove?.()}
              disabled={!selectedRecord}
            >
              Approve
            </Button>
          ) : (
            <Button
              color="error"
              variant="contained"
              startIcon={<Cancel />}
              onClick={() => onReject?.()}
              disabled={!selectedRecord}
            >
              Reject
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
