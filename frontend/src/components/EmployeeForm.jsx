import { Alert, Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from '@mui/material'

function EmployeeForm({
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
          <Typography variant="h5">Add employee</Typography>
          <Typography color="text.secondary">
            Create a new employee record with the required HR information.
          </Typography>
        </Stack>

        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Employee ID"
              value={values.employee_id}
              onChange={(event) => onChange('employee_id', event.target.value)}
              error={Boolean(errors.employee_id)}
              helperText={errors.employee_id}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Department"
              value={values.department}
              onChange={(event) => onChange('department', event.target.value)}
              error={Boolean(errors.department)}
              helperText={errors.department}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={values.full_name}
              onChange={(event) => onChange('full_name', event.target.value)}
              error={Boolean(errors.full_name)}
              helperText={errors.full_name}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={values.email}
              onChange={(event) => onChange('email', event.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Saving...</span>
              </Stack>
            ) : 'Add employee'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default EmployeeForm
