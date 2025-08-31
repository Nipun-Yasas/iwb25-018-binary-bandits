"use client";

import React from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

type FormValues = {
  insurer_id: string;
  name: string;
};

const validationSchema = Yup.object({
  insurer_id: Yup.string()
    .trim()
    .max(32, "Insurer ID must be at most 32 characters")
    .required("Insurer ID is required"),
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required"),
});

export default function AddInsurerPage() {
  const [submitStatus, setSubmitStatus] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Formik<FormValues>
        initialValues={{ insurer_id: "", name: "" }}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitStatus(null);
          try {
            const res = await axios.post("http://localhost:8080/insurers", {
              insurer_id: values.insurer_id.trim(),
              name: values.name.trim(),
            });
            setSubmitStatus({
              success: true,
              message: res.data?.message || "Insurer added successfully!",
            });
            resetForm();
          } catch (err: any) {
            setSubmitStatus({
              success: false,
              message:
                err?.response?.data?.message ||
                err?.message ||
                "Failed to add insurer",
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
                label="Insurer ID"
                name="insurer_id"
                value={values.insurer_id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.insurer_id && !!errors.insurer_id}
                helperText={touched.insurer_id && errors.insurer_id}
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

              <Button
                type="button"
                variant="contained"
                disabled={isSubmitting}
                onClick={() => {
                  // Show validation errors immediately
                  setTouched({ insurer_id: true, name: true }, true);
                  submitForm();
                }}
              >
                {isSubmitting ? "Submitting..." : "Add Insurer"}
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
