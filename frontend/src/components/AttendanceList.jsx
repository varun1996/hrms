import {
  Chip,
  LinearProgress,
  MenuItem,
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

function AttendanceList({
  attendanceRecords,
  employees,
  filters,
  onFilterChange,
  loading,
  pagination,
  onPageChange,
}) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h5">Attendance history</Typography>
          <Typography color="text.secondary">
            Review employee attendance and filter by employee, date, or status.
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            fullWidth
            label="Employee"
            value={filters.employee_id}
            onChange={(event) => onFilterChange('employee_id', event.target.value)}
          >
            <MenuItem value="">All employees</MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee.employee_id} value={employee.employee_id}>
                {employee.employee_id} - {employee.full_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={filters.date}
            onChange={(event) => onFilterChange('date', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            select
            fullWidth
            label="Status"
            value={filters.status}
            onChange={(event) => onFilterChange('status', event.target.value)}
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </TextField>
        </Stack>

        {loading ? <LinearProgress /> : null}

        {attendanceRecords.length === 0 ? (
          <EmptyState
            title="No attendance records found"
            message="Mark attendance to start building attendance history."
          />
        ) : (
          <Stack spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={700}>{record.employee_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {record.employee_id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={record.status === 'Present' ? 'success' : 'default'}
                        label={record.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pagination.totalPages > 1 ? (
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Page {pagination.page} of {pagination.totalPages} • {pagination.totalItems} total attendance records
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

export default AttendanceList
