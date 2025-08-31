"use client";

import React from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

type FormValues = {
  patient_id?: string; // optional, numeric
  name: string;
  dob: string; // YYYY-MM-DD
  gender: string; // Male | Female | Other
  address: string;
};

const GENDERS = ["Male", "Female", "Other"] as const;

const validationSchema = Yup.object({
  patient_id: Yup.string()
    .trim()
    .matches(/^\d+$/, "Patient ID must be a number")
    .max(12, "Patient ID is too long")
    .required(),
  name: Yup.string().trim().min(2).max(100).required("Name is required"),
  dob: Yup.string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .test("not-in-future", "Date cannot be in the future", (v) => {
      if (!v) return false;
      const d = new Date(v);
      const today = new Date();
      d.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return d.getTime() <= today.getTime();
    }),
  gender: Yup.string()
    .oneOf(GENDERS as unknown as string[])
    .required("Gender is required"),
  address: Yup.string()
    .trim()
    .min(5, "Address too short")
    .max(200)
    .required("Address is required"),
});

export default function AddPersonForm() {
  const [submitStatus, setSubmitStatus] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Add Patient
      </Typography>

      <Formik<FormValues>
        initialValues={{
          patient_id: "",
          name: "",
          dob: "",
          gender: "",
          address: "",
        }}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitStatus(null);
          try {
            const pidStr = (values.patient_id || "").trim();
            const payload = {
              patient_id: pidStr ? Number(pidStr) : undefined, // send number if provided
              name: values.name.trim(),
              dob: values.dob,
              gender: values.gender,
              address: values.address.trim(),
            };
            // Adjust endpoint if your backend differs
            const res = await axios.post(
              "http://localhost:8080/patients",
              payload
            );
            setSubmitStatus({
              success: true,
              message: res.data?.message || "Patient added successfully!",
            });
            resetForm();
          } catch (err: any) {
            setSubmitStatus({
              success: false,
              message:
                err?.response?.data?.message ||
                err?.message ||
                "Failed to add patient",
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setTouched,
          submitForm,
        }) => (
          <Form noValidate>
            <Stack spacing={3}>
              <TextField
                label="Patient ID"
                name="patient_id"
                value={values.patient_id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.patient_id && !!errors.patient_id}
                helperText={touched.patient_id && errors.patient_id}
                fullWidth
                size="small"
                autoComplete="off"
              />

              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                fullWidth
                size="small"
                autoComplete="off"
              />

              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={values.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.dob && !!errors.dob}
                helperText={touched.dob && errors.dob}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Gender"
                name="gender"
                select
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                fullWidth
                size="small"
              >
                <MenuItem value="">Select gender</MenuItem>
                {GENDERS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                fullWidth
                size="small"
                multiline
                minRows={2}
              />

              <Button
                type="button"
                variant="contained"
                disabled={isSubmitting}
                onClick={() => {
                  setTouched(
                    {
                      patient_id: true,
                      name: true,
                      dob: true,
                      gender: true,
                      address: true,
                    },
                    true
                  );
                  submitForm();
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {submitStatus && (
                <Alert
                  severity={submitStatus.success ? "success" : "error"}
                  sx={{ mt: 1 }}
                >
                  {submitStatus.message}
                </Alert>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
