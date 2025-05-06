import { NextResponse, NextRequest } from "next/server";
import { HttpException } from "./HttpException";

interface SuccessResponseOptions<T> {
  data?: T;
  message?: string;
  status?: number;
  meta?: Record<string, any>;
  headers?: Record<string, string>;
}

export function successResponse<T>({
  data = null,
  message = "Operation successful",
  status = 200,
  meta = null,
  headers = {},
}: SuccessResponseOptions<T>) {
  const responsePayload = {
    success: true,
    message,
    data,
    ...(meta && { meta }), // Include metadata only if provided
  };

  return NextResponse.json(responsePayload, {
    status,
    headers,
  });
}
