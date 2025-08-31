"use client";

import React from "react";
import {
  Button,
  MenuItem,
  TextField,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

const PROVIDER_TYPES = [
  "Doctor",
  "Hospital",
  "Clinic",
  "Laboratory",
  "Pharmacy",
];

const validationSchema = Yup.object({
  provider_id: Yup.string()
    .trim()
    .max(32, "Provider ID must be at most 32 characters")
    .required("Provider ID is required"),
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required"),
  type: Yup.string()
    .oneOf(PROVIDER_TYPES, "Invalid provider type")
    .required("Type is required"),
});

type FormValues = {
  provider_id?: string;
  name: string;
  type: string;
};

export default function AddProviderPage() {
  const [submitStatus, setSubmitStatus] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);


  

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Formik<FormValues>
        initialValues={{
          provider_id: "",
          name: "",
          type: "",
        }}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitStatus(null);
          try {
            const res = await axios.post("http://localhost:8080/providers", {
              provider_id: values.provider_id?.trim() || undefined,
              name: values.name.trim(),
              type: values.type,
            });
            setSubmitStatus({
              success: true,
              message: res.data?.message || "Provider added successfully!",
            });
            resetForm();
          } catch (err: any) {
            setSubmitStatus({
              success: false,
              message:
                err?.response?.data?.message ||
                err?.message ||
                "Failed to add provider",
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
                label="Provider ID"
                name="provider_id"
                value={values.provider_id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.provider_id && !!errors.provider_id}
                helperText={touched.provider_id && errors.provider_id}
                fullWidth
                size="small"
                autoComplete="off"
                autoFocus
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
                required
                size="small"
                autoComplete="off"
              />
              <TextField
                label="Type"
                name="type"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.type && !!errors.type}
                helperText={touched.type && errors.type}
                select
                fullWidth
                required
                size="small"
              >
                <MenuItem value="">Select type</MenuItem>
                {PROVIDER_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="button"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
                onClick={() => {
                  setTouched(
                    { provider_id: true, name: true, type: true },
                    true
                  );
                  submitForm();
                }}
              >
                {isSubmitting ? "Submitting..." : "Add Provider"}
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
