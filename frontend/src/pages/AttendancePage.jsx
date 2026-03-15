import {
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AttendanceForm from '../components/AttendanceForm.jsx'
import AttendanceList from '../components/AttendanceList.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import Loader from '../components/Loader.jsx'
import useAttendance from '../hooks/useAttendance.js'

function AttendancePage() {
  const {
    employees,
    attendanceRecords,
    pagination,
    filters,
    formValues,
    formErrors,
    loading,
    submitLoading,
    historyLoading,
    error,
    historyError,
    submitError,
    successMessage,
    selectedEmployeeId,
    employeeAttendanceHistory,
    updateFilter,
    updateFormValue,
    setSelectedEmployeeId,
    submitAttendance,
    changePage,
    retry,
  } = useAttendance()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Typography variant="overline" color="primary.main">
          HRMS Lite
        </Typography>
        <Typography variant="h4">Attendance Management</Typography>
        <Typography color="text.secondary">
          Mark daily attendance and review employee attendance history.
        </Typography>
      </Stack>

      {error && !loading ? <ErrorState title="Unable to load attendance" message={error} onRetry={retry} /> : null}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          {loading && employees.length === 0 ? (
            <Loader message="Loading attendance form..." />
          ) : employees.length === 0 ? (
            <EmptyState
              title="No employees found"
              message="Add employees before marking attendance."
            />
          ) : (
            <AttendanceForm
              employees={employees}
              values={formValues}
              errors={formErrors}
              submitError={submitError}
              successMessage={successMessage}
              loading={submitLoading}
              onChange={updateFormValue}
              onSubmit={submitAttendance}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          {loading && attendanceRecords.length === 0 ? (
            <Loader message="Loading attendance records..." />
          ) : (
            <Stack spacing={3}>
              <AttendanceList
                attendanceRecords={attendanceRecords}
                employees={employees}
                filters={filters}
                pagination={pagination}
                onFilterChange={updateFilter}
                onPageChange={changePage}
                loading={loading}
              />

              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="h5">Employee attendance history</Typography>
                    <Typography color="text.secondary">
                      View attendance history for a specific employee using the versioned employee attendance endpoint.
                    </Typography>
                  </Stack>

                  <TextField
                    select
                    fullWidth
                    label="Employee"
                    value={selectedEmployeeId}
                    onChange={(event) => setSelectedEmployeeId(event.target.value)}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.employee_id} value={employee.employee_id}>
                        {employee.employee_id} - {employee.full_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {historyLoading ? <Loader message="Loading employee history..." /> : null}
                  {historyError && !historyLoading ? (
                    <ErrorState title="Unable to load employee history" message={historyError} />
                  ) : null}
                  {!historyLoading && !historyError && employeeAttendanceHistory.length === 0 ? (
                    <EmptyState
                      title="No attendance history found"
                      message="This employee does not have attendance records yet."
                    />
                  ) : null}

                  {!historyLoading && !historyError && employeeAttendanceHistory.length > 0 ? (
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                      {employeeAttendanceHistory.map((record) => (
                        <Chip
                          key={record.id}
                          color={record.status === 'Present' ? 'success' : 'default'}
                          label={`${record.date} - ${record.status}`}
                        />
                      ))}
                    </Stack>
                  ) : null}
                </Stack>
              </Paper>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default AttendancePage
