"use client";

import {
  CalendarToday,
  Cancel,
  CheckCircle,
  Download,
  FilterList,
  HourglassTop,
  LocalHospital,
  Person,
  Schedule,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Claim {
  id: string;
  patientName: string;
  patientId: string;
  claimType: string;
  amount: number;
  status: "pending" | "in_review" | "approved" | "rejected";
  submittedDate: string;
  reviewDate?: string;
  diagnosis: string;
  documents: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "in_review":
      return "warning";
    case "pending":
      return "default";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle />;
    case "rejected":
      return <Cancel />;
    case "in_review":
      return <HourglassTop />;
    case "pending":
      return <Schedule />;
    default:
      return <Schedule />;
  }
};

export default function MyClaimsPage() {
  const theme = useTheme();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const claimsPerPage = 10;

  // Mock data - replace with API call
  useEffect(() => {
    const mockClaims: Claim[] = [
      {
        id: "CLM001",
        patientName: "John Doe",
        patientId: "PAT001",
        claimType: "Medical Consultation",
        amount: 250.0,
        status: "approved",
        submittedDate: "2024-01-15",
        reviewDate: "2024-01-17",
        diagnosis: "Hypertension follow-up",
        documents: 3,
      },
      {
        id: "CLM002",
        patientName: "Jane Smith",
        patientId: "PAT002",
        claimType: "Surgery",
        amount: 5750.0,
        status: "in_review",
        submittedDate: "2024-01-20",
        diagnosis: "Appendectomy",
        documents: 8,
      },
      {
        id: "CLM003",
        patientName: "Robert Johnson",
        patientId: "PAT003",
        claimType: "Emergency Treatment",
        amount: 1200.0,
        status: "pending",
        submittedDate: "2024-01-22",
        diagnosis: "Chest pain evaluation",
        documents: 5,
      },
      {
        id: "CLM004",
        patientName: "Emily Brown",
        patientId: "PAT004",
        claimType: "Diagnostic Tests",
        amount: 420.0,
        status: "rejected",
        submittedDate: "2024-01-18",
        reviewDate: "2024-01-19",
        diagnosis: "MRI scan - pre-authorization required",
        documents: 2,
      },
      {
        id: "CLM005",
        patientName: "Michael Wilson",
        patientId: "PAT005",
        claimType: "Physical Therapy",
        amount: 180.0,
        status: "approved",
        submittedDate: "2024-01-25",
        reviewDate: "2024-01-26",
        diagnosis: "Post-surgery rehabilitation",
        documents: 4,
      },
    ];
    setClaims(mockClaims);
    setFilteredClaims(mockClaims);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = claims;

    if (statusFilter !== "all") {
      filtered = filtered.filter((claim) => claim.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClaims(filtered);
    setPage(1);
  }, [claims, statusFilter, searchTerm]);

  const paginatedClaims = filteredClaims.slice(
    (page - 1) * claimsPerPage,
    page * claimsPerPage
  );

  const viewClaimDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setDialogOpen(true);
  };

  const totalPages = Math.ceil(filteredClaims.length / claimsPerPage);

  // Summary stats
  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status === "approved").length,
    pending: claims.filter((c) => c.status === "pending").length,
    inReview: claims.filter((c) => c.status === "in_review").length,
    rejected: claims.filter((c) => c.status === "rejected").length,
    totalAmount: claims.reduce((sum, c) => sum + c.amount, 0),
    approvedAmount: claims
      .filter((c) => c.status === "approved")
      .reduce((sum, c) => sum + c.amount, 0),
  };

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            📋 My Claims History
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Track and manage all your submitted insurance claims.
          </Typography>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Claims
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.inReview + stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${stats.approvedAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search claims, patients, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                  startAdornment={<FilterList sx={{ mr: 1 }} />}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredClaims.length} of {claims.length} claims
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.grey[900], 0.85)
              : "background.paper",
          backdropFilter: "blur(20px)",
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${alpha(theme.palette.grey[600], 0.4)}`
              : "none",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.grey[900], 0.95)
                : "background.paper",
            backdropFilter: "blur(20px)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.grey[800], 0.9)
                      : alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Claim ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Patient
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Submitted
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.100"
                        : "text.primary",
                    py: 2,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClaims.map((claim) => (
                <TableRow
                  key={claim.id}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.grey[800], 0.3)
                          : alpha(theme.palette.primary.main, 0.02),
                    },
                    borderBottom:
                      theme.palette.mode === "dark"
                        ? `1px solid ${alpha(theme.palette.grey[700], 0.3)}`
                        : `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                  }}
                >
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "grey.100"
                            : "text.primary",
                      }}
                    >
                      {claim.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          backgroundColor: "#2196F3",
                          width: 40,
                          height: 40,
                          color: "white",
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "grey.100"
                                : "text.primary",
                          }}
                        >
                          {claim.patientName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "grey.400"
                                : "text.secondary",
                          }}
                        >
                          ID: {claim.patientId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "grey.200"
                            : "text.primary",
                      }}
                    >
                      {claim.claimType}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "grey.100"
                            : "text.primary",
                      }}
                    >
                      ${claim.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Chip
                      label={claim.status.replace("_", " ")}
                      color={
                        getStatusColor(claim.status) as
                          | "success"
                          | "error"
                          | "warning"
                          | "default"
                      }
                      icon={getStatusIcon(claim.status)}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "grey.300"
                            : "text.secondary",
                      }}
                    >
                      {new Date(claim.submittedDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => viewClaimDetails(claim)}
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "primary.light"
                              : "primary.main",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.light, 0.1)
                                : alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "grey.400"
                              : "text.secondary",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.grey[400], 0.1)
                                : alpha(theme.palette.grey[500], 0.1),
                          },
                        }}
                      >
                        <Download />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* Claim Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedClaim && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Claim Details - {selectedClaim.id}
                </Typography>
                <Chip
                  label={selectedClaim.status.replace("_", " ")}
                  color={
                    getStatusColor(selectedClaim.status) as
                      | "success"
                      | "error"
                      | "warning"
                      | "default"
                  }
                  icon={getStatusIcon(selectedClaim.status)}
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 2, display: "flex", alignItems: "center" }}
                    >
                      <Person sx={{ mr: 1 }} /> Patient Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {selectedClaim.patientName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Patient ID:</strong> {selectedClaim.patientId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Diagnosis:</strong> {selectedClaim.diagnosis}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.success.main, 0.02),
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 2, display: "flex", alignItems: "center" }}
                    >
                      <LocalHospital sx={{ mr: 1 }} /> Claim Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Type:</strong> {selectedClaim.claimType}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Amount:</strong> $
                      {selectedClaim.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Documents:</strong> {selectedClaim.documents}{" "}
                      files
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.info.main, 0.02),
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 2, display: "flex", alignItems: "center" }}
                    >
                      <CalendarToday sx={{ mr: 1 }} /> Timeline
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Submitted:</strong>{" "}
                      {new Date(
                        selectedClaim.submittedDate
                      ).toLocaleDateString()}
                    </Typography>
                    {selectedClaim.reviewDate && (
                      <Typography variant="body2">
                        <strong>Reviewed:</strong>{" "}
                        {new Date(
                          selectedClaim.reviewDate
                        ).toLocaleDateString()}
                      </Typography>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<Download />}>
                Download Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
