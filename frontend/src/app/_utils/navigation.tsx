import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SecurityIcon from "@mui/icons-material/Security";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'OVERVIEW',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'analytics',
    title: 'Analytics',
    icon: <AnalyticsIcon />,
  },
  {
    kind: 'header',
    title: 'CLAIMS MANAGEMENT',
  },
  {
    segment: 'submit-claim',
    title: 'Submit Claim',
    icon: <AssignmentTurnedInIcon />,
  },
  {
    segment: 'claim-status',
    title: 'Claim Status',
    icon: <PendingActionsIcon />,
  },
  {
    segment: 'fraud-detection',
    title: 'Fraud Detection',
    icon: <SecurityIcon />,
  },
  {
    kind: 'header',
    title: 'REPORTING',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
  {
    segment: 'notifications',
    title: 'Notifications',
    icon: <NotificationsIcon />,
  },
  {
    kind: 'header',
    title: 'ACCOUNT',
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
  },
  {
    segment: 'help',
    title: 'Help & Support',
    icon: <HelpOutlineIcon />,
  },
];

export default NAVIGATION;
