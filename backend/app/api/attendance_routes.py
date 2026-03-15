import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.models import Attendance
from app.schemas import AttendanceCreateSerializer, AttendanceSerializer
from app.services.attendance_service import AttendanceService
from app.services.exceptions import DuplicateResourceError, ResourceNotFoundError

logger = logging.getLogger(__name__)


class AttendanceCollectionAPIView(APIView):
    status_case = "title"

    def get(self, request):
        filters = {
            "employee_id": request.query_params.get("employee_id", "").strip(),
            "start_date": request.query_params.get("start_date", "").strip(),
            "end_date": request.query_params.get("end_date", "").strip(),
            "date": request.query_params.get("date", "").strip(),
            "status": self._normalize_status(request.query_params.get("status", "").strip()),
        }
        queryset = AttendanceService.list_attendance(filters)
        serializer = AttendanceSerializer(
            queryset,
            many=True,
            context={"status_case": self.status_case},
        )
        return Response({"attendance_records": serializer.data})

    def post(self, request):
        serializer = AttendanceCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            attendance = AttendanceService.create_attendance(serializer.validated_data)
        except ResourceNotFoundError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except DuplicateResourceError as exc:
            logger.warning(
                "Duplicate attendance creation attempt: %s on %s",
                serializer.validated_data["employee_id"],
                serializer.validated_data["date"],
            )
            return Response({"error": str(exc)}, status=status.HTTP_409_CONFLICT)

        logger.info(
            "Attendance recorded for %s on %s",
            attendance.employee.employee_id,
            attendance.date,
        )
        return Response(
            AttendanceSerializer(
                attendance,
                context={"status_case": self.status_case},
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def _normalize_status(self, value):
        if value.lower() == "present":
            return Attendance.Status.PRESENT
        if value.lower() == "absent":
            return Attendance.Status.ABSENT
        return ""


class LegacyAttendanceCollectionAPIView(AttendanceCollectionAPIView):
    status_case = "lower"
