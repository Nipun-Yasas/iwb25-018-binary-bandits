'use client'

import React, { useState } from 'react'
import { Box, Typography, Card, CardContent, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Paper, Alert, alpha, useTheme, InputAdornment } from '@mui/material'
import { CloudUpload, Delete, Person, LocalHospital, AttachMoney, CalendarToday, Description } from '@mui/icons-material'

interface FormData {
  patientName: string
  patientId: string
  patientAge: string
  patientGender: string
  diagnosis: string
  treatmentDate: string
  claimAmount: string
  claimType: string
  description: string
  doctorNotes: string
}

const claimTypes = [
  'Medical Consultation',
  'Surgery',
  'Emergency Treatment',
  'Diagnostic Tests',
  'Prescription Medication',
  'Physical Therapy',
  'Dental Treatment',
  'Mental Health',
  'Maternity Care',
  'Preventive Care'
]

export default function SubmitClaimPage() {
  const theme = useTheme()
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    patientId: '',
    patientAge: '',
    patientGender: '',
    diagnosis: '',
    treatmentDate: '',
    claimAmount: '',
    claimType: '',
    description: '',
    doctorNotes: ''
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Handle success
  }

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          borderRadius: 4
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            📄 Submit New Insurance Claim
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Fill in patient details and attach supporting documents securely.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Patient Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Patient Full Name"
                    value={formData.patientName}
                    onChange={handleInputChange('patientName')}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient ID"
                    value={formData.patientId}
                    onChange={handleInputChange('patientId')}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={formData.patientAge}
                    onChange={handleInputChange('patientAge')}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.patientGender}
                      onChange={handleInputChange('patientGender')}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Treatment Details */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalHospital sx={{ mr: 2, color: theme.palette.success.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Treatment Details
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Primary Diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange('diagnosis')}
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Treatment Date"
                    type="date"
                    value={formData.treatmentDate}
                    onChange={handleInputChange('treatmentDate')}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Claim Amount"
                    value={formData.claimAmount}
                    onChange={handleInputChange('claimAmount')}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Claim Type</InputLabel>
                    <Select
                      value={formData.claimType}
                      onChange={handleInputChange('claimType')}
                      label="Claim Type"
                    >
                      {claimTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Treatment Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Describe the treatment provided, procedures performed, medications prescribed, etc."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Doctor's Notes"
                    value={formData.doctorNotes}
                    onChange={handleInputChange('doctorNotes')}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Additional medical notes, recommendations, or observations..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Upload & Summary */}
        <Grid item xs={12} lg={6}>
          {/* Document Upload */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CloudUpload sx={{ mr: 2, color: theme.palette.info.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Supporting Documents
                </Typography>
              </Box>

              <Paper
                sx={{
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  mb: 3,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
                component="label"
              >
                <input
                  type="file"
                  multiple
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Upload Documents
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to select files or drag and drop<br />
                  PDF, Images, Word documents (Max 10MB each)
                </Typography>
              </Paper>

              {uploadedFiles.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                    Uploaded Files ({uploadedFiles.length})
                  </Typography>
                  {uploadedFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        mb: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Description sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={() => removeFile(index)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Claim Summary */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Claim Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Please review all information before submitting. Claims typically take 3-5 business days to process.
                </Alert>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Patient:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {formData.patientName || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {formData.claimAmount ? `$${formData.claimAmount}` : 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {formData.claimType || 'Not selected'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Documents:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {uploadedFiles.length} files
                  </Typography>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  backgroundColor: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: theme.palette.success.dark
                  }
                }}
              >
                {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                By submitting, you confirm that all information is accurate and complete.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
