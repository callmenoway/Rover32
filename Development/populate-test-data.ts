// npx ts-node scripts/populate-test-data.ts

// Import PrismaClient but name it differently to avoid conflict
const { PrismaClient } = require('@prisma/client');
const { randomInt } = require('crypto');

// Use a different variable name to avoid conflicting with global prisma
const scriptPrisma = new PrismaClient();

async function populateTestData() {
  try {
    // Find the vehicle by MAC address
    const vehicle = await scriptPrisma.vehicle.findFirst({
      where: { macAddress: 'FF:11:22:33:44:55' }
    });

    if (!vehicle) {
      console.error('Vehicle with MAC address FF:11:22:33:44:55 not found');
      return;
    }

    // Delete any existing stats for this vehicle
    await scriptPrisma.vehicleStats.deleteMany({
      where: { vehicleId: vehicle.id }
    });

    // Calculate date range
    const now = new Date();
    const batchSize = 10; // Process in batches for better performance
    const promises = [];
    
    console.log(`Populating data for vehicle ${vehicle.id}...`);
    
    // Generate 90 days of data
    for (let i = 0; i <= 90; i += batchSize) {
      const batchPromises = [];
      
      for (let j = 0; j < batchSize && i + j <= 90; j++) {
        const day = i + j;
        const date = new Date();
        date.setDate(now.getDate() - (90 - day));
        date.setHours(0, 0, 0, 0);
        
        // Check if date is weekend (0 = Sunday, 6 = Saturday)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        // Generate random values with higher values on weekends
        const uptimeHours = isWeekend 
          ? 3 + Math.random() * 4  // 3-7 hours
          : 1 + Math.random() * 2; // 1-3 hours
        
        const controlHours = isWeekend 
          ? 2 + Math.random() * 3  // 2-5 hours
          : 0.5 + Math.random() * 1.5; // 0.5-2 hours
        
        const kilometersDriven = isWeekend 
          ? 10 + Math.random() * 15 // 10-25 km
          : 3 + Math.random() * 7;  // 3-10 km
        
        batchPromises.push(
          scriptPrisma.vehicleStats.create({
            data: {
              date,
              uptimeHours,
              controlHours,
              kilometersDriven,
              vehicleId: vehicle.id
            }
          })
        );
      }
      
      // Process batch
      promises.push(Promise.all(batchPromises));
    }
    
    // Wait for all insertions to complete
    await Promise.all(promises);
    
    // Update vehicle totals
    const totals = await scriptPrisma.vehicleStats.aggregate({
      where: { vehicleId: vehicle.id },
      _sum: {
        uptimeHours: true,
        controlHours: true,
        kilometersDriven: true
      }
    });
    
    await scriptPrisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        uptimeHours: totals._sum.uptimeHours || 0,
        controlHours: totals._sum.controlHours || 0,
        kilometersDriven: totals._sum.kilometersDriven || 0
      }
    });
    
    console.log('Successfully populated test data!');
  } catch (error) {
    console.error('Error populating test data:', error);
  } finally {
    await scriptPrisma.$disconnect();
  }
}

populateTestData();
