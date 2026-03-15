HRMS Lite API Reference
=======================

Overview
========

This document describes the backend API exposed by the HRMS Lite Django
application. The API is intended for a single admin user and supports
employee management and daily attendance tracking.

Base URL
========

For local development, the default base URL is::

    http://127.0.0.1:8000

Content Type
============

Requests with a body must use JSON::

    Content-Type: application/json

Authentication
==============

Authentication is currently out of scope. All endpoints are available without
login.

Data Model Summary
==================

Employee
--------

Each employee record contains:

- ``employee_id``: unique business identifier
- ``full_name``: employee full name
- ``email``: unique email address
- ``department``: department name

AttendanceRecord
----------------

Each attendance record contains:

- ``employee_id``: employee business identifier
- ``date``: attendance date in ``YYYY-MM-DD`` format
- ``status``: ``present`` or ``absent``

Business Rules
==============

- ``employee_id`` must be unique.
- ``email`` must be unique.
- Only one attendance record is allowed per employee per date.
- Deleting an employee also deletes that employee's attendance records.

Endpoints
=========

Health Check
------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - GET
     - ``/api/health/``

Returns the current service health status.

Example response::

    {
      "status": "ok",
      "service": "hrms-lite-backend",
      "today": "2026-03-15"
    }


List Employees
--------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - GET
     - ``/api/employees/``

Returns all employees with attendance summary fields.

Example response::

    {
      "employees": [
        {
          "employee_id": "EMP-001",
          "full_name": "Avery Thompson",
          "email": "avery@example.com",
          "department": "Engineering",
          "created_at": "2026-03-15T08:40:00.000000+00:00",
          "updated_at": "2026-03-15T08:40:00.000000+00:00",
          "attendance_summary": {
            "present_days": 4,
            "absent_days": 1,
            "total_records": 5
          }
        }
      ]
    }


Create Employee
---------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - POST
     - ``/api/employees/``

Request body::

    {
      "employee_id": "EMP-001",
      "full_name": "Avery Thompson",
      "email": "avery@example.com",
      "department": "Engineering"
    }

Successful response:

- Status: ``201 Created``

Conflict response:

- Status: ``409 Conflict``
- Returned when ``employee_id`` or ``email`` already exists

Validation error response:

- Status: ``400 Bad Request``


Delete Employee
---------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - DELETE
     - ``/api/employees/<employee_id>/``

Successful response:

- Status: ``204 No Content``

Not found response:

- Status: ``404 Not Found``


List Attendance Records
-----------------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - GET
     - ``/api/attendance/``

Optional query parameters:

- ``employee_id``
- ``date``
- ``status``

Example filtered request::

    /api/attendance/?employee_id=EMP-001&date=2026-03-15&status=present

Example response::

    {
      "attendance_records": [
        {
          "id": 1,
          "employee_id": "EMP-001",
          "employee_name": "Avery Thompson",
          "date": "2026-03-15",
          "status": "present",
          "created_at": "2026-03-15T08:45:00.000000+00:00",
          "updated_at": "2026-03-15T08:45:00.000000+00:00"
        }
      ]
    }


Create Attendance Record
------------------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - POST
     - ``/api/attendance/``

Request body::

    {
      "employee_id": "EMP-001",
      "date": "2026-03-15",
      "status": "present"
    }

Successful response:

- Status: ``201 Created``

Validation error response:

- Status: ``400 Bad Request``

Not found response:

- Status: ``404 Not Found``
- Returned when the employee does not exist

Conflict response:

- Status: ``409 Conflict``
- Returned when attendance already exists for the employee and date


Get Attendance for One Employee
-------------------------------

.. list-table::
   :widths: 20 80
   :header-rows: 1

   * - Method
     - Path
   * - GET
     - ``/api/employees/<employee_id>/attendance/``

Returns one employee and their attendance history.

Example response::

    {
      "employee": {
        "employee_id": "EMP-001",
        "full_name": "Avery Thompson",
        "email": "avery@example.com",
        "department": "Engineering",
        "created_at": "2026-03-15T08:40:00.000000+00:00",
        "updated_at": "2026-03-15T08:40:00.000000+00:00"
      },
      "attendance_records": [
        {
          "id": 2,
          "employee_id": "EMP-001",
          "employee_name": "Avery Thompson",
          "date": "2026-03-15",
          "status": "present",
          "created_at": "2026-03-15T08:45:00.000000+00:00",
          "updated_at": "2026-03-15T08:45:00.000000+00:00"
        }
      ]
    }


Error Response Format
=====================

Application errors are returned as JSON. Example::

    {
      "error": "Attendance data is invalid.",
      "details": {
        "status": [
          "Value 'late' is not a valid choice."
        ]
      }
    }


Running the API
===============

Start the development server from the ``backend`` directory::

    source venv/bin/activate
    python manage.py runserver

Interactive Browser Docs
========================

The project also includes a runnable browser-based docs page at::

    /docs/
