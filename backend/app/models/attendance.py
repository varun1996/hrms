import uuid

from django.db import models

from .employee import Employee


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "Present", "Present"
        ABSENT = "Absent", "Absent"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="attendance_records",
    )
    date = models.DateField()
    status = models.CharField(max_length=7, choices=Status.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "attendance"
        ordering = ["-date", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["employee", "date"],
                name="uniq_attendance_employee_date",
            )
        ]
        indexes = [
            models.Index(fields=["employee", "date"], name="idx_attendance_employee_date"),
            models.Index(fields=["date"], name="idx_attendance_date"),
        ]

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"
