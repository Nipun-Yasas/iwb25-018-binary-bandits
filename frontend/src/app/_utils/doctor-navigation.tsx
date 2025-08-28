import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from '@mui/icons-material/Settings';

const DOCTOR_NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: '🩺 DOCTOR PORTAL',
  },
  {
    segment: 'doctor/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'header',
    title: 'CLAIMS MANAGEMENT',
  },
  {
    segment: 'doctor/submit-claim',
    title: 'Submit Claim',
    icon: <AssignmentTurnedInIcon />,
  },
  {
    segment: 'doctor/my-claims',
    title: 'My Claims',
    icon: <AssessmentIcon />,
  },
  {
    kind: 'header',
    title: 'NOTIFICATIONS & SETTINGS',
  },
  {
    segment: 'doctor/notifications',
    title: 'Notifications',
    icon: <NotificationsIcon />,
  },
  {
    segment: 'doctor/profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
  },
  {
    segment: 'doctor/settings',
    title: 'Settings',
    icon: <SettingsIcon />,
  },
];

export default DOCTOR_NAVIGATION;
