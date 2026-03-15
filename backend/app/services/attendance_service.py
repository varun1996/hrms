from django.db import IntegrityError, transaction

from app.models import Attendance
from app.services.employee_service import EmployeeService
from app.services.exceptions import DuplicateResourceError


class AttendanceService:
    @staticmethod
    def list_attendance(filters=None):
        filters = filters or {}
        queryset = Attendance.objects.select_related("employee").filter(employee__is_active=True)

        employee_id = filters.get("employee_id")
        start_date = filters.get("start_date")
        end_date = filters.get("end_date")
        status = filters.get("status")
        exact_date = filters.get("date")

        if employee_id:
            queryset = queryset.filter(employee__employee_id=employee_id)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if exact_date:
            queryset = queryset.filter(date=exact_date)
        if status:
            queryset = queryset.filter(status=status)

        return queryset

    @staticmethod
    def create_attendance(validated_data):
        employee = EmployeeService.get_active_employee_by_business_id(validated_data["employee_id"])

        try:
            with transaction.atomic():
                return Attendance.objects.create(
                    employee=employee,
                    date=validated_data["date"],
                    status=validated_data["status"],
                )
        except IntegrityError as exc:
            raise DuplicateResourceError("Attendance already marked.") from exc

    @staticmethod
    def get_employee_attendance(employee_id):
        employee = EmployeeService.get_active_employee_by_business_id(employee_id)
        records = employee.attendance_records.all().select_related("employee")
        return employee, records
