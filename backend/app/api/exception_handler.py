from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler


def hrms_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    if isinstance(exc, ValidationError):
        return Response(
            {
                "error": "Validation error",
                "details": response.data,
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    return response
