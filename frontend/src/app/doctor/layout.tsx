"use client";

import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { AppProvider } from "@toolpad/core/AppProvider";
import { ReactNode } from "react";
import DOCTOR_NAVIGATION from "../_utils/doctor-navigation";
import DoctorToolbarActions from "../_components/doctor/DoctorToolbarActions";
import DoctorAppTitle from "../_components/doctor/DoctorAppTitle";
import { useTheme } from "@mui/material/styles";

interface LayoutProps {
  children: ReactNode;
}

export default function DoctorLayout({ children }: LayoutProps) {
  const theme = useTheme();

  return (
    <AppProvider navigation={DOCTOR_NAVIGATION} theme={theme}>
      <DashboardLayout
        slots={{
          appTitle: DoctorAppTitle,
          toolbarActions: DoctorToolbarActions,
        }}
      >
        <PageContainer>
          {children}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
