import { Alert, Box, Container, Grid, Stack, Typography } from '@mui/material'
import EmployeeForm from '../components/EmployeeForm.jsx'
import EmployeeList from '../components/EmployeeList.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import Loader from '../components/Loader.jsx'
import useEmployees from '../hooks/useEmployees.js'

function EmployeesPage() {
  const {
    employees,
    filteredEmployees,
    pagination,
    search,
    loading,
    error,
    formValues,
    formErrors,
    submitError,
    successMessage,
    submitting,
    deletingEmployeeId,
    setSearch,
    updateFormValue,
    submitEmployee,
    removeEmployee,
    changePage,
    retry,
  } = useEmployees()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Typography variant="overline" color="primary.main">
          HRMS Lite
        </Typography>
        <Typography variant="h4">Employee Management</Typography>
        <Typography color="text.secondary">
          Add employees, view the directory, and remove outdated records.
        </Typography>
      </Stack>

      {error && !loading ? <ErrorState title="Unable to load employees" message={error} onRetry={retry} /> : null}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <EmployeeForm
            values={formValues}
            errors={formErrors}
            submitError={submitError}
            successMessage={successMessage}
            loading={submitting}
            onChange={updateFormValue}
            onSubmit={submitEmployee}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          {loading && employees.length === 0 ? (
            <Loader message="Loading employees..." />
          ) : employees.length === 0 ? (
            <EmptyState
              title="No employees found"
              message="Use the form to add your first employee."
            />
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              pagination={pagination}
              search={search}
              onSearchChange={setSearch}
              onDelete={removeEmployee}
              onPageChange={changePage}
              deletingEmployeeId={deletingEmployeeId}
              loading={loading}
            />
          )}

          {!loading && employees.length > 0 && filteredEmployees.length === 0 ? (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info">No employees match the current search.</Alert>
            </Box>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  )
}

export default EmployeesPage
