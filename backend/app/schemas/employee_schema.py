from rest_framework import serializers

from app.models import Employee


class EmployeeCreateSerializer(serializers.Serializer):
    employee_id = serializers.CharField(max_length=32)
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    department = serializers.CharField(max_length=120)

    def validate_employee_id(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Employee ID is required.")
        return value

    def validate_full_name(self, value):
        value = value.strip()
        if len(value) <= 2:
            raise serializers.ValidationError("Full name must be longer than 2 characters.")
        return value

    def validate_department(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Department is required.")
        return value


class EmployeeSerializer(serializers.ModelSerializer):
    attendance_summary = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "full_name",
            "email",
            "department",
            "created_at",
            "attendance_summary",
        ]

    def get_attendance_summary(self, obj):
        return {
            "present_days": getattr(obj, "present_days", 0),
            "absent_days": getattr(obj, "absent_days", 0),
            "total_records": getattr(obj, "total_records", 0),
        }
