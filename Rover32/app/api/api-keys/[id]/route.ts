import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// DELETE handler to remove an API key
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // First check if the API key exists and belongs to the user
    const apiKey = await db.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "API key not found" }, { status: 404 });
    }

    if (apiKey.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "You don't have permission to delete this API key" }, { status: 403 });
    }

    // Delete the API key
    await db.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json({ success: false, message: "Failed to delete API key" }, { status: 500 });
  }
}
