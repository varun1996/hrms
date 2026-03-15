import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  createEmployee as createEmployeeRequest,
  deleteEmployee as deleteEmployeeRequest,
  fetchEmployees,
} from '../services/api.js'
import { validateEmployee } from '../utils/validators.js'

const initialFormValues = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
}

function getApiErrorMessage(error, fallback) {
  const payload = error?.response?.data

  if (payload?.details && typeof payload.details === 'object') {
    const flattened = Object.values(payload.details).flat().filter(Boolean).join(' ')
    if (flattened) {
      return flattened
    }
  }

  return payload?.error || fallback
}

function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState('')

  const loadEmployees = useCallback(async (page = pagination.page, limit = pagination.limit) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchEmployees({ page, limit })
      const nextEmployees = response.data.employees || []
      const nextPagination = response.data.pagination || {
        page,
        limit,
        totalItems: nextEmployees.length,
        totalPages: 1,
      }

      setEmployees(nextEmployees)
      setPagination({
        page: nextPagination.page || page,
        limit: nextPagination.limit || limit,
        totalItems: nextPagination.total_items ?? nextPagination.totalItems ?? nextEmployees.length,
        totalPages: nextPagination.total_pages ?? nextPagination.totalPages ?? 1,
      })
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load employees'))
    } finally {
      setLoading(false)
    }
  }, [pagination.limit, pagination.page])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const filteredEmployees = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    if (!query) {
      return employees
    }

    return employees.filter((employee) =>
      [employee.employee_id, employee.full_name, employee.email, employee.department]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [deferredSearch, employees])

  function updateFormValue(field, value) {
    setFormValues((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: '' }))
  }

  async function submitEmployee(event) {
    event.preventDefault()

    const nextErrors = validateEmployee(formValues)
    setFormErrors(nextErrors)
    setSubmitError('')
    setSuccessMessage('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await createEmployeeRequest(formValues)
      setFormValues(initialFormValues)
      setSuccessMessage('Employee added successfully.')
      await loadEmployees(1, pagination.limit)
    } catch (submitRequestError) {
      setSubmitError(getApiErrorMessage(submitRequestError, 'Unable to create employee'))
    } finally {
      setSubmitting(false)
    }
  }

  async function removeEmployee(employeeId) {
    const confirmed = window.confirm(
      `Delete employee ${employeeId}? This will also delete related attendance records.`,
    )

    if (!confirmed) {
      return
    }

    setDeletingEmployeeId(employeeId)
    setSubmitError('')
    setSuccessMessage('')

    try {
      await deleteEmployeeRequest(employeeId)
      setSuccessMessage(`Employee ${employeeId} deleted successfully.`)
      const nextPage = employees.length === 1 && pagination.page > 1
        ? pagination.page - 1
        : pagination.page
      await loadEmployees(nextPage, pagination.limit)
    } catch (deleteError) {
      setSubmitError(getApiErrorMessage(deleteError, 'Unable to delete employee'))
    } finally {
      setDeletingEmployeeId('')
    }
  }

  async function changePage(_, page) {
    await loadEmployees(page, pagination.limit)
  }

  return {
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
    retry: () => loadEmployees(pagination.page, pagination.limit),
  }
}

export default useEmployees
