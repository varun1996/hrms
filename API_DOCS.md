# HRMS Lite API Docs

## Overview

HRMS Lite exposes a production-style REST API for employee management and daily attendance tracking.

Primary API version:

- `/api/v1`

Compatibility routes are also available under `/api/...` for the current frontend.

Base local URL:

- `http://127.0.0.1:8000`

## Health Check

### `GET /api/health/`

Returns service and database health.

Example response:

```json
{
  "status": "ok",
  "service": "hrms-lite-backend",
  "today": "2026-03-15",
  "database": "ok"
}
```

## Employees

### `POST /api/v1/employees/`

Create an employee.

Request body:

```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

Responses:

- `201 Created`
- `409 Conflict` for duplicate active employee
- `422 Unprocessable Entity` for validation errors

### `GET /api/v1/employees/?page=1&limit=20`

List employees with pagination and attendance summary.

Example response:

```json
{
  "employees": [
    {
      "id": "7d0c9608-5b9a-49bb-a6dd-4c390f44dca6",
      "employee_id": "EMP001",
      "full_name": "John Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "created_at": "2026-03-15T10:20:00Z",
      "attendance_summary": {
        "present_days": 4,
        "absent_days": 1,
        "total_records": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 1,
    "total_pages": 1
  }
}
```

### `DELETE /api/v1/employees/{employee_id}/`

Soft deletes an employee.

Responses:

- `204 No Content`
- `404 Not Found`

### `GET /api/v1/employees/{employee_id}/attendance/`

Returns a single employee and that employee's attendance history.

## Attendance

### `POST /api/v1/attendance/`

Mark attendance for an employee.

Request body:

```json
{
  "employee_id": "EMP001",
  "date": "2026-03-15",
  "status": "Present"
}
```

Responses:

- `201 Created`
- `404 Not Found` if employee does not exist
- `409 Conflict` if attendance is already marked for that date
- `422 Unprocessable Entity` for invalid payloads

### `GET /api/v1/attendance/`

Fetch attendance records.

Supported query params:

- `employee_id`
- `date`
- `start_date`
- `end_date`
- `status`

Example:

```text
/api/v1/attendance/?employee_id=EMP001&start_date=2026-03-01&end_date=2026-03-31
```

Example response:

```json
{
  "attendance_records": [
    {
      "id": "5db44d17-4b8e-4e2f-bbb5-a4f0ebc15917",
      "employee_id": "EMP001",
      "employee_name": "John Doe",
      "date": "2026-03-15",
      "status": "Present",
      "created_at": "2026-03-15T10:30:00Z"
    }
  ]
}
```

## Validation Rules

### Employee

- `employee_id` is required
- `full_name` must be longer than 2 characters
- `email` must be valid
- `department` is required
- active `employee_id` must be unique
- active `email` must be unique

### Attendance

- `employee_id` is required
- `date` is required
- `status` must be `Present` or `Absent`
- one attendance record per employee per date

## Error Format

Validation failures return:

```json
{
  "error": "Validation error",
  "details": {
    "email": [
      "Enter a valid email address."
    ]
  }
}
```

Conflict failures return:

```json
{
  "error": "Employee already exists."
}
```

## Compatibility Routes

These remain available for the current frontend:

- `GET, POST /api/employees/`
- `DELETE /api/employees/{employee_id}/`
- `GET /api/employees/{employee_id}/attendance/`
- `GET, POST /api/attendance/`

## Run Locally

```bash
cd /Users/varun/project_2026/hrms_lite/backend
source venv/bin/activate
python manage.py runserver
```

Interactive docs page:

- `/docs/`
