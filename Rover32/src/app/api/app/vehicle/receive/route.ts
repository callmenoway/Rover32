import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import * as z from 'zod';

const vehicleReceiveSchema = z.object({
    apiKey: z.string().min(1, 'API key is required'),
    macAddress: z.string().min(1, 'MAC address is required'),
    uptimeHours: z.number().min(0, 'Uptime hours must be a positive number'),
    controlHours: z.number().min(0, 'Control hours must be a positive number'),
    kilometersDriven: z.number().min(0, 'Kilometers driven must be a positive number'),
});

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { apiKey, macAddress, uptimeHours, controlHours, kilometersDriven } = vehicleReceiveSchema.parse(body);

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

        // Update vehicle stats
        await db.vehicle.update({
            where: { id: vehicle.id },
            data: {
                uptimeHours,
                controlHours,
                kilometersDriven
            }
        });

        return NextResponse.json({
            success: true,
            message: "Vehicle stats updated successfully"
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
        console.error("Vehicle stats update error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}