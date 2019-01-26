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

export type DepartureRow = {
  stop: Stop;
  stoptimes: Array<StopTime>;
};

export type Stop = {
  name: string;
  id: string;
  vehicleMode: vehicleMode;
  cluster: Cluster;
  stoptimesWithoutPatterns: Array<StopTime>;
};

export type Cluster = {
  stops: Array<Stop>;
};

export type StopTime = {
  trip: Trip;
  serviceDay: number;
  realtimeArrival: number;
  realtimeDeparture: number;
  pickupType: PickupType;
};

export type Route = {
  shortName: string;
  mode: vehicleMode;
};

export type Trip = {
  routeShortName: string;
  tripHeadsign: string;
  route: Route;
};

export type Node = {
  id: string;
  distance: number;
  place: DepartureRow;
};

export interface GetNearbyStopsQuery {
  nearest: {
    edges: Array<{
      node: Node;
    }>;
  };
}

export interface GetNearbyStopsVariables {
  transportMode: vehicleMode | null;
}
