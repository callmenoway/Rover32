import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import * as z from "zod";

// Schema for validating the login request
const loginSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { apiKey } = loginSchema.parse(body);

    // Find the API key in the database
    const apiKeyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            username: true,
            vehicles: {
              select: {
                name: true,
                ipAddress: true,
                macAddress: true
              }
            }
          }
        }
      }
    });

    // If the API key doesn't exist, return unauthorized
    if (!apiKeyRecord) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid API key" },
        { status: 401 }
      );
    }

    // Update the last used timestamp for the API key
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsed: new Date() }
    });

    // Return the user data with vehicles
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: apiKeyRecord.user
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("API login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
