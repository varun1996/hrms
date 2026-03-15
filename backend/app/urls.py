from django.urls import path

from app.api.attendance_routes import (
    AttendanceCollectionAPIView,
    LegacyAttendanceCollectionAPIView,
)
from app.api.employee_routes import (
    EmployeeAttendanceAPIView,
    EmployeeCollectionAPIView,
    EmployeeDetailAPIView,
    LegacyEmployeeAttendanceAPIView,
)
from app.views import api_docs, api_overview, health_check

urlpatterns = [
    path("", api_overview, name="api-overview"),
    path("docs/", api_docs, name="api-docs"),
    path("api/health/", health_check, name="health-check"),
    path("api/v1/employees/", EmployeeCollectionAPIView.as_view(), name="v1-employees-collection"),
    path("api/v1/employees/<str:employee_id>/", EmployeeDetailAPIView.as_view(), name="v1-employee-detail"),
    path(
        "api/v1/employees/<str:employee_id>/attendance/",
        EmployeeAttendanceAPIView.as_view(),
        name="v1-employee-attendance",
    ),
    path("api/v1/attendance/", AttendanceCollectionAPIView.as_view(), name="v1-attendance-collection"),
    path("api/employees/", EmployeeCollectionAPIView.as_view(), name="employees-collection"),
    path("api/employees/<str:employee_id>/", EmployeeDetailAPIView.as_view(), name="employee-detail"),
    path(
        "api/employees/<str:employee_id>/attendance/",
        LegacyEmployeeAttendanceAPIView.as_view(),
        name="employee-attendance",
    ),
    path("api/attendance/", LegacyAttendanceCollectionAPIView.as_view(), name="attendance-collection"),
]
