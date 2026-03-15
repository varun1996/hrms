import uuid

from django.db import models
from django.db.models import Q
from django.utils import timezone


class ActiveEmployeeManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee_id = models.CharField(max_length=32)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    department = models.CharField(max_length=120)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActiveEmployeeManager()
    all_objects = models.Manager()

    class Meta:
        db_table = "employees"
        ordering = ["full_name", "employee_id"]
        constraints = [
            models.UniqueConstraint(
                fields=["employee_id"],
                condition=Q(is_active=True),
                name="uniq_active_employee_employee_id",
            ),
            models.UniqueConstraint(
                fields=["email"],
                condition=Q(is_active=True),
                name="uniq_active_employee_email",
            ),
        ]
        indexes = [
            models.Index(fields=["employee_id"], name="idx_employee_employeeid"),
            models.Index(fields=["email"], name="idx_employee_email"),
        ]

    def soft_delete(self):
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_active", "deleted_at", "updated_at"])

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"
