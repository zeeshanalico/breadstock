import { NextResponse, NextRequest } from "next/server";
import { HttpException } from "./HttpException";
type Handler = (request: NextRequest, ...args: any[]) => Promise<Response>;

export function withTryCatch(handler: Handler): (request: NextRequest, ...args: any[]) => Promise<Response> {
  return async function (
    request: NextRequest,
    ...args: any[]
  ): Promise<Response> {
    try {
      return await handler(request, ...args);
    } catch (error: any) {
      console.error(`${error.name}: ${error.message}`, error.stack);
      const statusCode = error instanceof HttpException ? error.statusCode : 500;

      const responsePayload = {
        success: false,
        message: error.message || "Internal server error",
        data: null,
        meta: null,
      };

      return NextResponse.json(responsePayload, { status: statusCode });
    }
  };
}