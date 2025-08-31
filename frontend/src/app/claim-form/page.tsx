'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Alert,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
interface ClaimFormData {
  patientId: string;
  providerId: string;
  policyId: string;
  diagnosisCode: string;
  diagnosisDisplay: string;
  procedureCode: string;
  procedureDisplay: string;
  claimAmount: string;
}

interface ClaimResponse {
  success: boolean;
  message: string;
  claimResponse?: {
    resourceType: string;
    id: string;
    outcome: string;
    status: string;
    disposition: string;
    payment: {
      amount: {
        value: number;
        currency: string;
      };
    };
  };
}

export default function ClaimForm() {
  const [formData, setFormData] = useState<ClaimFormData>({
    patientId: '',
    providerId: '',
    policyId: '',
    diagnosisCode: '',
    diagnosisDisplay: '',
    procedureCode: '',
    procedureDisplay: '',
    claimAmount: '',
  });

  const [response, setResponse] = useState<ClaimResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const claim = {
        resourceType: 'Claim',
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        patient: { reference: `Patient/${formData.patientId}` },
        insurer: { reference: 'Organization/INS001' },
        provider: { reference: `Organization/${formData.providerId}` },
        insurance: [
          {
            sequence: 1,
            focal: true,
            coverage: { reference: `Coverage/${formData.policyId}` },
          },
        ],
        diagnosis: [
          {
            sequence: 1,
            diagnosisCodeableConcept: {
              coding: [
                {
                  code: formData.diagnosisCode,
                  display: formData.diagnosisDisplay,
                },
              ],
            },
          },
        ],
        item: [
          {
            sequence: 1,
            productOrService: {
              coding: [
                {
                  code: formData.procedureCode,
                  display: formData.procedureDisplay,
                },
              ],
            },
            unitPrice: {
              value: parseFloat(formData.claimAmount || '0'),
              currency: 'USD',
            },
          },
        ],
        total: {
          value: parseFloat(formData.claimAmount || '0'),
          currency: 'USD',
        },
      };

      const apiResponse = await fetch('http://localhost:8080/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claim),
      });

      const result = await apiResponse.json();
      setResponse(result as ClaimResponse);
    } catch (error) {
      setResponse({
        success: false,
        message: 'Failed to submit claim: ' + (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Box sx={{ display:'flex',justifyContent: 'center',alignItems:'center',m: 5 }}>
        <Paper elevation={2} sx={{ p: 4,height:"100%" }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Submit Insurance Claim
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Patient ID"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  placeholder="e.g., 00001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Provider ID"
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleInputChange}
                  placeholder="e.g., DOC001 or HOS001"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Policy ID"
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleInputChange}
                  placeholder="e.g., POL001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ min: 0, step: '0.01' }}
                  label="Claim Amount ($)"
                  name="claimAmount"
                  value={formData.claimAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 1500.00"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Diagnosis Code"
                  name="diagnosisCode"
                  value={formData.diagnosisCode}
                  onChange={handleInputChange}
                  placeholder="e.g., D001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Diagnosis Description"
                  name="diagnosisDisplay"
                  value={formData.diagnosisDisplay}
                  onChange={handleInputChange}
                  placeholder="e.g., Gastro-esophageal reflux disease"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Procedure Code"
                  name="procedureCode"
                  value={formData.procedureCode}
                  onChange={handleInputChange}
                  placeholder="e.g., PROC001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Procedure Description"
                  name="procedureDisplay"
                  value={formData.procedureDisplay}
                  onChange={handleInputChange}
                  placeholder="e.g., Office visit, established patient"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 1 }}
                  startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                  {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {response && (
            <Box sx={{ mt: 4 }}>
              <Alert severity={response.success ? 'success' : 'error'} sx={{ mb: 2 }}>
                <Stack>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {response.success ? 'Success' : 'Error'}
                  </Typography>
                  <Typography variant="body2">{response.message}</Typography>
                </Stack>
              </Alert>

              {response.success && response.claimResponse && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Claim Processing Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Response ID
                      </Typography>
                      <Typography variant="body1">{response.claimResponse.id}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1">{response.claimResponse.status}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Outcome
                      </Typography>
                      <Typography variant="body1">{response.claimResponse.outcome}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Payment Amount
                      </Typography>
                      <Typography variant="body1">
                        ${response.claimResponse.payment.amount.value}{' '}
                        {response.claimResponse.payment.amount.currency}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Disposition
                      </Typography>
                      <Typography variant="body1">{response.claimResponse.disposition}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </Box>
  );
}
