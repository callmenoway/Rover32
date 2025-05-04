import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import * as z from 'zod';

const vehicleReceiveSchema = z.object({
    apiKey: z.string().min(1, 'API key is required'),
    macAddress: z.string().min(1, 'MAC address is required'),
    date: z.string().optional(), // Optional date in 'YYYY-MM-DD' format
    uptimeHours: z.number().min(0, 'Uptime hours must be a positive number'),
    controlHours: z.number().min(0, 'Control hours must be a positive number'),
    kilometersDriven: z.number().min(0, 'Kilometers driven must be a positive number'),
});

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { apiKey, macAddress, date, uptimeHours, controlHours, kilometersDriven } = vehicleReceiveSchema.parse(body);

        // Parse date from request or use current date, handling timezone correctly
        let statsDate;
        if (date) {
            // Create date with the format YYYY-MM-DDT00:00:00.000Z
            // This ensures the date is treated as UTC midnight
            statsDate = new Date(date + 'T00:00:00.000Z');
            
            // Alternative approach: create as local date and then normalize
            // const tempDate = new Date(date);
            // statsDate = new Date(Date.UTC(
            //    tempDate.getFullYear(),
            //    tempDate.getMonth(),
            //    tempDate.getDate()
            // ));
        } else {
            // Use current date and set to midnight UTC
            statsDate = new Date();
            statsDate = new Date(Date.UTC(
                statsDate.getFullYear(),
                statsDate.getMonth(),
                statsDate.getDate()
            ));
        }

        console.log(`Parsed date: ${statsDate.toISOString()}`);
        console.log(`Date string: ${date}`);
        console.log(`Local date: ${statsDate.toString()}`);

        // Verify API key exists
        const apiKeyRecord = await db.apiKey.findUnique({
            where: { key: apiKey },
            include: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!apiKeyRecord) {
            return NextResponse.json(
            { success: false, message: "Unauthorized: Invalid API key" },
            { status: 401 }
            );
        }

        // Find vehicle by MAC address and verify it belongs to the API key's user
        const vehicle = await db.vehicle.findFirst({
            where: { 
                macAddress: macAddress,
                userId: apiKeyRecord.user.id
            }
        });

        if(!vehicle) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Vehicle not found or does not belong to this user" },
                { status: 401 }
            );
        }

        // Update API key last used timestamp
        await db.apiKey.update({
            where: { id: apiKeyRecord.id },
            data: { lastUsed: new Date() }
        });

        // Debug logging
        console.log(`Processing request for vehicle: ${vehicle.id}`);
        console.log(`Date: ${statsDate.toISOString()}`);
        console.log(`Stats to add: Uptime=${uptimeHours}, Control=${controlHours}, KM=${kilometersDriven}`);

        // Update vehicle total stats
        await db.vehicle.update({
            where: { id: vehicle.id },
            data: {
                // Increment total values
                uptimeHours: { increment: uptimeHours },
                controlHours: { increment: controlHours },
                kilometersDriven: { increment: kilometersDriven }
            }
        });
        console.log("Vehicle total stats updated successfully");

        try {
            // Check if a stats record already exists for this date
            console.log("Checking for existing stats record...");
            const existingStats = await db.vehicleStats.findFirst({
                where: {
                    vehicleId: vehicle.id,
                    date: statsDate
                }
            });
            console.log("Existing stats check completed:", existingStats ? "Found" : "Not found");

            if (existingStats) {
                // Update existing record
                console.log(`Updating existing stats record ID: ${existingStats.id}`);
                await db.vehicleStats.update({
                    where: {
                        id: existingStats.id
                    },
                    data: {
                        uptimeHours: { increment: uptimeHours },
                        controlHours: { increment: controlHours },
                        kilometersDriven: { increment: kilometersDriven },
                        updatedAt: new Date()
                    }
                });
                console.log("Existing stats record updated successfully");
            } else {
                // Create new record
                console.log("Creating new stats record");
                const newStats = await db.vehicleStats.create({
                    data: {
                        vehicleId: vehicle.id,
                        date: statsDate,
                        uptimeHours,
                        controlHours,
                        kilometersDriven
                    }
                });
                console.log(`New stats record created with ID: ${newStats?.id || 'unknown'}`);
            }
        } catch (statsError) {
            console.error("Error handling vehicle stats:", statsError);
            console.error("Error details:", JSON.stringify(statsError, null, 2));
            
            // Continue execution despite stats error
            // This allows the vehicle totals to be updated even if stats fail
        }

        // Log the operation for debugging
        console.log(`Updated stats for vehicle ${vehicle.id} on date ${statsDate.toISOString().split('T')[0]}`);

        return NextResponse.json({
            success: true,
            message: "Vehicle stats updated successfully"
        });

    } catch (error) {
        // More detailed error logging
        console.error("Vehicle stats update error:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: error.errors[0].message },
                { status: 400 }
            );
        }
        
        // Handle other errors
        console.error("Vehicle stats update error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}