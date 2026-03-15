from django.contrib import admin

from app.models import Attendance, Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "employee_id",
        "full_name",
        "email",
        "department",
        "is_active",
        "created_at",
    )
    list_filter = ("department", "is_active")
    search_fields = ("employee_id", "full_name", "email", "department")
    ordering = ("full_name", "employee_id")


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("employee", "date", "status", "created_at")
    list_filter = ("status", "date")
    search_fields = ("employee__employee_id", "employee__full_name", "employee__email")
    autocomplete_fields = ("employee",)
