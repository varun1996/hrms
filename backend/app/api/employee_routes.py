import logging

from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.schemas import AttendanceSerializer, EmployeeCreateSerializer, EmployeeSerializer
from app.services.attendance_service import AttendanceService
from app.services.employee_service import EmployeeService
from app.services.exceptions import DuplicateResourceError, ResourceNotFoundError

logger = logging.getLogger(__name__)


class EmployeeCollectionAPIView(APIView):
    def get(self, request):
        queryset = EmployeeService.list_employees()
        page = max(int(request.query_params.get("page", 1)), 1)
        limit = min(max(int(request.query_params.get("limit", 20)), 1), 100)
        paginator = Paginator(queryset, limit)
        page_obj = paginator.get_page(page)
        serializer = EmployeeSerializer(page_obj.object_list, many=True)

        return Response(
            {
                "employees": serializer.data,
                "pagination": {
                    "page": page_obj.number,
                    "limit": limit,
                    "total_items": paginator.count,
                    "total_pages": paginator.num_pages,
                },
            }
        )

    def post(self, request):
        serializer = EmployeeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            employee = EmployeeService.create_employee(serializer.validated_data)
        except DuplicateResourceError as exc:
            logger.warning("Duplicate employee creation attempt: %s", serializer.validated_data["employee_id"])
            return Response({"error": str(exc)}, status=status.HTTP_409_CONFLICT)

        logger.info("Employee created %s", employee.employee_id)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_201_CREATED)


class EmployeeDetailAPIView(APIView):
    def delete(self, request, employee_id):
        try:
            EmployeeService.soft_delete_employee(employee_id)
        except ResourceNotFoundError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)

        logger.info("Employee soft-deleted %s", employee_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class EmployeeAttendanceAPIView(APIView):
    status_case = "title"

    def get(self, request, employee_id):
        try:
            employee, records = AttendanceService.get_employee_attendance(employee_id)
        except ResourceNotFoundError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)

        return Response(
            {
                "employee": EmployeeSerializer(employee).data,
                "attendance_records": AttendanceSerializer(
                    records,
                    many=True,
                    context={"status_case": self.status_case},
                ).data,
            }
        )


class LegacyEmployeeAttendanceAPIView(EmployeeAttendanceAPIView):
    status_case = "lower"
