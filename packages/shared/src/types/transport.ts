export interface BusRoute {
  id: string;
  tenantId: string;
  name: string;
  driverId: string;
  vehicleNumber: string;
  stops: BusStop[];
  isActive: boolean;
}

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
  estimatedTime?: string;
}

export interface BusLocation {
  routeId: string;
  tenantId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  updatedAt: string;
}
