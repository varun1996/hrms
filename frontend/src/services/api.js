import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function fetchEmployees(params = { page: 1, limit: 100 }) {
  return api.get('/api/v1/employees/', { params })
}

export function createEmployee(payload) {
  return api.post('/api/v1/employees/', payload)
}

export function deleteEmployee(employeeId) {
  return api.delete(`/api/v1/employees/${employeeId}/`)
}

export function fetchAttendance(params) {
  return api.get('/api/v1/attendance/', { params })
}

export function createAttendance(payload) {
  return api.post('/api/v1/attendance/', payload)
}

export function fetchEmployeeAttendance(employeeId) {
  return api.get(`/api/v1/employees/${employeeId}/attendance/`)
}

export default api
