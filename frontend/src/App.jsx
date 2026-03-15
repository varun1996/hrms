import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import AttendancePage from './pages/AttendancePage.jsx'
import EmployeesPage from './pages/EmployeesPage.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f5a4f',
    },
    secondary: {
      main: '#d68c45',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6">HRMS Lite</Typography>
              <Typography variant="body2" color="text.secondary">
                Internal human resource operations
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={NavLink} to="/employees" color="inherit">
                Employees
              </Button>
              <Button component={NavLink} to="/attendance" color="inherit">
                Attendance
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Routes>
      </Box>
    </ThemeProvider>
  )
}

export default App
