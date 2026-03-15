from django.test import TestCase
from django.urls import reverse

from app.models import Attendance, Employee


class ProductionApiTests(TestCase):
    def test_health_check_returns_database_status(self):
        response = self.client.get(reverse("health-check"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
        self.assertEqual(response.json()["database"], "ok")

    def test_create_employee_v1(self):
        response = self.client.post(
            reverse("v1-employees-collection"),
            data={
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john@example.com",
                "department": "Engineering",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Employee.objects.count(), 1)
        self.assertEqual(Employee.objects.get().employee_id, "EMP001")

    def test_duplicate_employee_returns_conflict(self):
        Employee.all_objects.create(
            employee_id="EMP001",
            full_name="John Doe",
            email="john@example.com",
            department="Engineering",
        )

        response = self.client.post(
            reverse("v1-employees-collection"),
            data={
                "employee_id": "EMP001",
                "full_name": "Jane Smith",
                "email": "jane@example.com",
                "department": "Engineering",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)

    def test_invalid_employee_payload_returns_422(self):
        response = self.client.post(
            reverse("v1-employees-collection"),
            data={
                "employee_id": "",
                "full_name": "JD",
                "email": "bad-email",
                "department": "",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 422)

    def test_soft_delete_employee(self):
        employee = Employee.all_objects.create(
            employee_id="EMP002",
            full_name="Taylor Smith",
            email="taylor@example.com",
            department="Finance",
        )

        response = self.client.delete(
            reverse("v1-employee-detail", kwargs={"employee_id": employee.employee_id})
        )

        self.assertEqual(response.status_code, 204)
        employee.refresh_from_db()
        self.assertFalse(employee.is_active)
        self.assertIsNotNone(employee.deleted_at)

    def test_mark_attendance_and_filter_by_employee(self):
        employee = Employee.all_objects.create(
            employee_id="EMP003",
            full_name="Morgan Patel",
            email="morgan@example.com",
            department="People Ops",
        )

        create_response = self.client.post(
            reverse("v1-attendance-collection"),
            data={
                "employee_id": employee.employee_id,
                "date": "2026-03-15",
                "status": "Present",
            },
            content_type="application/json",
        )

        self.assertEqual(create_response.status_code, 201)

        list_response = self.client.get(
            reverse("v1-attendance-collection"),
            data={"employee_id": employee.employee_id},
        )

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()["attendance_records"]), 1)

    def test_duplicate_attendance_returns_conflict(self):
        employee = Employee.all_objects.create(
            employee_id="EMP004",
            full_name="Alex Johnson",
            email="alex@example.com",
            department="Engineering",
        )
        Attendance.objects.create(
            employee=employee,
            date="2026-03-15",
            status=Attendance.Status.PRESENT,
        )

        response = self.client.post(
            reverse("v1-attendance-collection"),
            data={
                "employee_id": employee.employee_id,
                "date": "2026-03-15",
                "status": "Absent",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)

    def test_employee_attendance_history_endpoint(self):
        employee = Employee.all_objects.create(
            employee_id="EMP005",
            full_name="Jamie Lee",
            email="jamie@example.com",
            department="Operations",
        )
        Attendance.objects.create(
            employee=employee,
            date="2026-03-15",
            status=Attendance.Status.PRESENT,
        )

        response = self.client.get(
            reverse("v1-employee-attendance", kwargs={"employee_id": employee.employee_id})
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["employee"]["employee_id"], "EMP005")
        self.assertEqual(len(response.json()["attendance_records"]), 1)
