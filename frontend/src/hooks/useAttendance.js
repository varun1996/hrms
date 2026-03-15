import { useCallback, useEffect, useState } from 'react'
import {
  createAttendance as createAttendanceRequest,
  fetchAttendance,
  fetchEmployeeAttendance,
  fetchEmployees,
} from '../services/api.js'
import { validateAttendance } from '../utils/validators.js'

const initialFormValues = {
  employee_id: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'Present',
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

function useAttendance() {
  const [employees, setEmployees] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
  })
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [employeeAttendanceHistory, setEmployeeAttendanceHistory] = useState([])
  const [filters, setFilters] = useState({
    employee_id: '',
    date: '',
    status: '',
  })
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const loadAttendance = useCallback(async (
    currentFilters = filters,
    page = pagination.page,
    limit = pagination.limit,
  ) => {
    setLoading(true)
    setError('')

    try {
      const [employeesResponse, attendanceResponse] = await Promise.all([
        fetchEmployees({ page: 1, limit: 100 }),
        fetchAttendance({ ...currentFilters, page, limit }),
      ])

      const nextEmployees = employeesResponse.data.employees || []
      const nextAttendance = attendanceResponse.data.attendance_records || []
      const nextPagination = attendanceResponse.data.pagination || {
        page,
        limit,
        totalItems: nextAttendance.length,
        totalPages: 1,
      }

      setEmployees(nextEmployees)
      setAttendanceRecords(nextAttendance)
      setPagination({
        page: nextPagination.page || page,
        limit: nextPagination.limit || limit,
        totalItems: nextPagination.total_items ?? nextPagination.totalItems ?? nextAttendance.length,
        totalPages: nextPagination.total_pages ?? nextPagination.totalPages ?? 1,
      })
      setFormValues((current) =>
        current.employee_id || nextEmployees.length === 0
          ? current
          : { ...current, employee_id: nextEmployees[0].employee_id },
      )
      setSelectedEmployeeId((current) => current || nextEmployees[0]?.employee_id || '')
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load attendance'))
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.limit, pagination.page])

  useEffect(() => {
    loadAttendance()
  }, [loadAttendance])

  useEffect(() => {
    async function loadEmployeeAttendanceHistory() {
      if (!selectedEmployeeId) {
        setEmployeeAttendanceHistory([])
        return
      }

      setHistoryLoading(true)
      setHistoryError('')

      try {
        const response = await fetchEmployeeAttendance(selectedEmployeeId)
        setEmployeeAttendanceHistory(response.data.attendance_records || [])
      } catch (loadError) {
        setHistoryError(getApiErrorMessage(loadError, 'Unable to load employee attendance history'))
      } finally {
        setHistoryLoading(false)
      }
    }

    loadEmployeeAttendanceHistory()
  }, [selectedEmployeeId])

  function updateFormValue(field, value) {
    setFormValues((current) => ({ ...current, [field]: value }))
    setFormErrors((current) => ({ ...current, [field]: '' }))
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
    setPagination((current) => ({ ...current, page: 1 }))
  }

  async function submitAttendance(event) {
    event.preventDefault()

    const nextErrors = validateAttendance(formValues)
    setFormErrors(nextErrors)
    setSubmitError('')
    setSuccessMessage('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitLoading(true)

    try {
      await createAttendanceRequest(formValues)
      setSuccessMessage('Attendance marked successfully.')
      await loadAttendance(filters, pagination.page, pagination.limit)
      if (selectedEmployeeId) {
        const historyResponse = await fetchEmployeeAttendance(selectedEmployeeId)
        setEmployeeAttendanceHistory(historyResponse.data.attendance_records || [])
      }
    } catch (submitRequestError) {
      setSubmitError(getApiErrorMessage(submitRequestError, 'Unable to mark attendance'))
    } finally {
      setSubmitLoading(false)
    }
  }

  async function changePage(_, page) {
    await loadAttendance(filters, page, pagination.limit)
  }

  return {
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
    retry: () => loadAttendance(filters, pagination.page, pagination.limit),
  }
}

export default useAttendance
