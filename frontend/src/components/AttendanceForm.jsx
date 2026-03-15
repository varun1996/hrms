import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

function AttendanceForm({
  employees,
  values,
  errors,
  submitError,
  successMessage,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={3} component="form" onSubmit={onSubmit}>
        <Stack spacing={1}>
          <Typography variant="h5">Mark attendance</Typography>
          <Typography color="text.secondary">
            Record present or absent status for an employee.
          </Typography>
        </Stack>

        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Employee ID"
              value={values.employee_id}
              onChange={(event) => onChange('employee_id', event.target.value)}
              error={Boolean(errors.employee_id)}
              helperText={errors.employee_id}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.employee_id} value={employee.employee_id}>
                  {employee.employee_id} - {employee.full_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={values.date}
              onChange={(event) => onChange('date', event.target.value)}
              error={Boolean(errors.date)}
              helperText={errors.date}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={values.status}
              onChange={(event) => onChange('status', event.target.value)}
              error={Boolean(errors.status)}
              helperText={errors.status}
            >
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Saving...</span>
              </Stack>
            ) : 'Mark attendance'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default AttendanceForm
