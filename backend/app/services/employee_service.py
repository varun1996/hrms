from django.db import IntegrityError, transaction
from django.db.models import Count, Q

from app.models import Attendance, Employee
from app.services.exceptions import DuplicateResourceError, ResourceNotFoundError


class EmployeeService:
    @staticmethod
    def list_employees():
        return Employee.objects.annotate(
            present_days=Count(
                "attendance_records",
                filter=Q(attendance_records__status=Attendance.Status.PRESENT),
            ),
            absent_days=Count(
                "attendance_records",
                filter=Q(attendance_records__status=Attendance.Status.ABSENT),
            ),
            total_records=Count("attendance_records"),
        ).order_by("full_name", "employee_id")

    @staticmethod
    def create_employee(validated_data):
        try:
            with transaction.atomic():
                return Employee.all_objects.create(**validated_data)
        except IntegrityError as exc:
            raise DuplicateResourceError("Employee already exists.") from exc

    @staticmethod
    def get_active_employee_by_business_id(employee_id):
        try:
            return Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist as exc:
            raise ResourceNotFoundError("Employee not found.") from exc

    @staticmethod
    def soft_delete_employee(employee_id):
        employee = EmployeeService.get_active_employee_by_business_id(employee_id)
        employee.soft_delete()
        return employee
