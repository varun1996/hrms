import {
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EmptyState from './EmptyState.jsx'

function EmployeeList({
  employees,
  search,
  onSearchChange,
  onDelete,
  deletingEmployeeId,
  loading,
  pagination,
  onPageChange,
}) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={2}
        >
          <Stack spacing={1}>
            <Typography variant="h5">Employee directory</Typography>
            <Typography color="text.secondary">
              View all employees and attendance summaries.
            </Typography>
          </Stack>
          <TextField
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employees"
            size="small"
            sx={{ minWidth: { md: 280 } }}
          />
        </Stack>

        {loading ? <LinearProgress /> : null}

        {employees.length === 0 ? (
          <EmptyState
            title="No employees found"
            message="Create the first employee to start managing your directory."
          />
        ) : (
          <Stack spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.employee_id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={700}>{employee.full_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.employee_id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={`Present ${employee.attendance_summary.present_days}`} />
                        <Chip size="small" label={`Absent ${employee.attendance_summary.absent_days}`} />
                        <Chip size="small" label={`Total ${employee.attendance_summary.total_records}`} />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        onClick={() => onDelete(employee.employee_id)}
                        disabled={deletingEmployeeId === employee.employee_id}
                      >
                        {deletingEmployeeId === employee.employee_id ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CircularProgress size={16} color="inherit" />
                            <span>Deleting...</span>
                          </Stack>
                        ) : 'Delete'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pagination.totalItems > 0 ? (
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Page {pagination.page} of {pagination.totalPages} • {pagination.totalItems} total employees
                </Typography>
                <Pagination
                  page={pagination.page}
                  count={pagination.totalPages}
                  color="primary"
                  onChange={onPageChange}
                />
              </Stack>
            ) : null}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default EmployeeList
