'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR to avoid ref errors
const VehicleList = dynamic(
  () => import('@/src/components/vehicles/VehicleList').then(mod => mod.VehicleList),
  { ssr: false }
);

export default function VehicleListWrapper() {
  return <VehicleList />;
}
