import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiHeaders } from "@nestjs/swagger";

export function ApiOperationWithSwaggerSummary(summary: string) {
  return ApiOperation({ summary });
}

export function ApiAuthHeaders() {
  return ApiHeaders([
    {
      name: "language",
      description: "enter language",
      required: true,
    },
    {
      name: "device_id",
      description: "enter device id",
      required: true,
    },
    {
      name: "device_type",
      description: "enter device type",
      required: true,
    },
    {
      name: "device_token",
      description: "enter device token",
      required: true,
    },
    {
      name: "os",
      description: "enter os",
      required: true,
    },
    {
      name: "app_version",
      description: "enter appversion",
      required: true,
    },
    {
      name: "authorizations",
      description: "enter authorization token",
      required: true,
    },
  ]);
}
export function ApiAdminAuthHeaders() {
  return ApiHeaders([
    {
      name: "language",
      description: "enter language",
      required: true,
    },
    {
      name: "authorizations",
      description: "enter authorization token",
      required: true,
    },
  ]);
}

export function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse({ status: 200, description: "Api success" }),
    ApiResponse({ status: 401, description: "Invalid Login credentials." }),
    ApiResponse({ status: 404, description: "Not found!" }),
    ApiResponse({ status: 500, description: "Internal server error!" }),
    ApiResponse({
      status: 403,
      description: "Forbidden, The user does not have access.",
    })
  );
}

export function ApiCommonDecorators() {
  return applyDecorators(ApiCommonResponses());
}
