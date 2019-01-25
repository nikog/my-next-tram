export type Route = {
  shortName: string;
};

export interface GetRoutesQuery {
  routes: Array<Route>;
}

export interface GetRoutesVariables {
  transportMode: vehicleMode | null;
}

export type Position = {
  latitude?: number;
  longitude?: number;
};

export enum vehicleMode {
  BUS = 'BUS',
  TRAM = 'TRAM',
  RAIL = 'RAIL'
}

export enum PickupType {
  SCHEDULED = 'SCHEDULED',
  NONE = 'NONE'
}

export type Place = {
  name: string;
  id: string;
  vehicleMode: vehicleMode;
  cluster: Cluster;
  stoptimesWithoutPatterns: Array<StopTime>;
};

export type Cluster = {
  stops: Array<Place>;
};

export type StopTime = {
  trip: Trip;
  realtimeArrival: number;
  realtimeDeparture: number;
  pickupType: PickupType;
};

export type Trip = {
  routeShortName: string;
  tripHeadsign: string;
};

export interface GetNearbyStopsQuery {
  nearest: {
    edges: Array<{
      node: {
        id: string;
        place: Place;
      };
    }>;
  };
}

export interface GetNearbyStopsVariables {
  transportMode: vehicleMode | null;
}
