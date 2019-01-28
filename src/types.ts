export type Position = {
  latitude?: number;
  longitude?: number;
};

export enum vehicleMode {
  BUS = 'BUS',
  TRAM = 'TRAM',
  RAIL = 'RAIL',
  SUBWAY = 'SUBWAY'
}

export enum PickupType {
  SCHEDULED = 'SCHEDULED',
  NONE = 'NONE'
}

export type DepartureRow = {
  stop: Stop;
  stoptimes: Array<StopTime>;
  pattern: {
    headsign: string;
    route: Route;
  };
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
  headsign: string;
};

export type Route = {
  id: string;
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
  transportMode: vehicleMode[] | null;
}
