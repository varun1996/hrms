export function validateEmployee(values) {
  const errors = {}

  if (!values.employee_id?.trim()) {
    errors.employee_id = 'Employee ID is required.'
  }

  if (!values.full_name?.trim() || values.full_name.trim().length <= 2) {
    errors.full_name = 'Name must be longer than 2 characters.'
  }

  if (!values.department?.trim()) {
    errors.department = 'Department is required.'
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function validateAttendance(values) {
  const errors = {}

  if (!values.employee_id?.trim()) {
    errors.employee_id = 'Employee ID is required.'
  }

  if (!values.date?.trim()) {
    errors.date = 'Date is required.'
  }

  if (!values.status?.trim()) {
    errors.status = 'Status is required.'
  }

  return errors
}
