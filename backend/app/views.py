from datetime import date

from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import render

from app.db.database import database_healthcheck


def health_check(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    return JsonResponse(
        {
            "status": "ok",
            "service": "hrms-lite-backend",
            "today": date.today().isoformat(),
            "database": "ok" if database_healthcheck() else "unavailable",
        }
    )


def api_docs(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    return render(
        request,
        "app/api_docs.html",
        {
            "today": date.today().isoformat(),
            "sample_employee_id": "EMP001",
        },
    )


def api_overview(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    return JsonResponse(
        {
            "service": "HRMS Lite API",
            "version": "v1",
            "endpoints": {
                "health": "/api/health/",
                "employees_v1": "/api/v1/employees/",
                "employee_attendance_v1": "/api/v1/employees/<employee_id>/attendance/",
                "attendance_v1": "/api/v1/attendance/",
                "compatibility_employees": "/api/employees/",
                "compatibility_attendance": "/api/attendance/",
            },
        }
    )
