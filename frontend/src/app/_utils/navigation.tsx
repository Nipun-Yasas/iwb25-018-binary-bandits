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
    segment: 'claims',
    title: 'Claims',
    icon: <AssignmentTurnedInIcon />,
  },
  {
    segment: 'patients',
    title: 'Patients',
    icon: <SecurityIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Patient',
        icon: <SecurityIcon />,
      },
      {
        segment: 'view',
        title: 'View Patient',
        icon: <SecurityIcon />,
      }
    ]
  },
  {
    segment: 'insurers',
    title: 'Insurers',
    icon: <SecurityIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Insurer',
        icon: <SecurityIcon />,
      },
      {
        segment: 'view',
        title: 'View Insurer',
        icon: <SecurityIcon />,
      }
    ]
  },
  
  {
    segment: 'provider',
    title: 'Provider',
    icon: <SecurityIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Provider',
        icon: <SecurityIcon />,
      },
      {
        segment: 'view',
        title: 'View Provider',
        icon: <SecurityIcon />,
      }
    ]
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
