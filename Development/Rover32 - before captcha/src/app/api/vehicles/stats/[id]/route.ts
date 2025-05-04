import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    // Verify user authentication
    if (!session?.user?.id) {
      return NextResponse.json({ stats: [], message: "Unauthorized" }, { status: 401 });
    }

    // Resolve params
    const resolvedParams = await Promise.resolve(params);
    const vehicleId = resolvedParams.id;

    // Verify vehicle ownership
    const vehicle = await db.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: session.user.id
      }
    });

    if (!vehicle) {
      return NextResponse.json({ stats: [], message: "Vehicle not found or access denied" }, { status: 404 });
    }

    // Parse query parameters for filtering
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '90');
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get stats for the vehicle in the date range
    const stats = await db.vehicleStats.findMany({
      where: {
        vehicleId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Format stats for the chart
    const formattedStats = stats.map(stat => ({
      date: stat.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      uptime: stat.uptimeHours,
      control: stat.controlHours
    }));

    // Fill in missing dates with zero values
    const filledStats = fillMissingDates(formattedStats, startDate, endDate);

    return NextResponse.json({ stats: filledStats });
  } catch (error) {
    console.error("Error fetching vehicle stats:", error);
    return NextResponse.json({ stats: [], message: "Failed to fetch vehicle stats" }, { status: 500 });
  }
}

// Helper function to fill in missing dates with zero values
function fillMissingDates(stats: any[], startDate: Date, endDate: Date) {
  const dateMap = new Map();
  
  // Create a map of existing dates
  stats.forEach(stat => {
    dateMap.set(stat.date, stat);
  });
  
  const filledStats = [];
  const currentDate = new Date(startDate);
  
  // Loop through each day in the range
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Use existing stat or create one with zeros
    if (dateMap.has(dateStr)) {
      filledStats.push(dateMap.get(dateStr));
    } else {
      filledStats.push({
        date: dateStr,
        uptime: 0,
        control: 0
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return filledStats;
}
