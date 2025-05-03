import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from "zod";
import { generateApiKey } from "@/lib/utils/api-key";

// Schema for API key creation
const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
});

// GET handler to list all API keys for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ apiKeys: [], message: "Unauthorized" }, { status: 401 });
    }

    const apiKeys = await db.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
        // Don't return the actual key for security
      }
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json({ apiKeys: [], message: "Failed to fetch API keys" }, { status: 500 });
  }
}

// POST handler to create a new API key
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ apiKey: null, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = apiKeySchema.parse(body);

    // Generate a secure API key
    const apiKeyValue = generateApiKey();

    // Store in database
    const apiKey = await db.apiKey.create({
      data: {
        key: apiKeyValue,
        name,
        userId: session.user.id,
      },
    });

    // Return the API key to the user
    // This is the only time we send the full key back to the client
    return NextResponse.json({
      apiKey: {
        id: apiKey.id,
        key: apiKeyValue,
        name: apiKey.name,
        createdAt: apiKey.createdAt
      },
      message: "API key created successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ apiKey: null, message: error.errors[0].message }, { status: 400 });
    }
    
    console.error("Error creating API key:", error);
    return NextResponse.json({ apiKey: null, message: "Failed to create API key" }, { status: 500 });
  }
}
