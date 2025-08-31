import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Main' },

  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'claims',
    title: 'Claims',
    icon: <ReceiptLongIcon />,
  },

  {
    segment: 'patients',
    title: 'Patients',
    icon: <PeopleAltIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Patient',
        icon: <PersonAddAlt1Icon />,
      },
      {
        segment: 'view',
        title: 'View Patient',
        icon: <VisibilityIcon />,
      },
    ],
  },

  {
    segment: 'insurers',
    title: 'Insurers',
    icon: <CorporateFareIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Insurer',
        icon: <AddBusinessIcon />,
      },
      {
        segment: 'view',
        title: 'View Insurer',
        icon: <ListAltIcon />,
      },
    ],
  },

  {
    segment: 'providers',
    title: 'Provider',
    icon: <LocalHospitalIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Provider',
        icon: <AddBusinessIcon />,
      },
      {
        segment: 'view',
        title: 'View Provider',
        icon: <MedicalServicesIcon />,
      },
    ],
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
