from rest_framework import serializers

from app.models import Attendance


class AttendanceCreateSerializer(serializers.Serializer):
    employee_id = serializers.CharField(max_length=32)
    date = serializers.DateField()
    status = serializers.CharField(max_length=10)

    def validate_employee_id(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Employee ID is required.")
        return value

    def validate_status(self, value):
        normalized = value.strip().lower()
        if normalized == "present":
            return Attendance.Status.PRESENT
        if normalized == "absent":
            return Attendance.Status.ABSENT
        raise serializers.ValidationError("Status must be Present or Absent.")


class AttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee_id",
            "employee_name",
            "date",
            "status",
            "created_at",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if self.context.get("status_case") == "lower":
            representation["status"] = representation["status"].lower()
        return representation
