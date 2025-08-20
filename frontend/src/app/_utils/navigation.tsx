import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SecurityIcon from "@mui/icons-material/Security";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
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
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
  },
];

export default NAVIGATION;
