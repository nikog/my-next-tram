/* tslint:disable */
// This file was automatically generated and should not be edited.

import { Mode, PickupDropoffType } from "./globalTypes";

// ====================================================
// GraphQL query operation: NearbyStops
// ====================================================

export interface NearbyStops_nearest_edges_node_place_Stop {
  __typename: "Stop" | "BikeRentalStation" | "BikePark" | "CarPark";
}

export interface NearbyStops_nearest_edges_node_place_DepartureRow_stop {
  __typename: "Stop";
  /**
   * Global object ID provided by Relay. This value can be used to refetch this object using **node** query.
   */
  id: string;
  /**
   * Name of the stop, e.g. Pasilan asema
   */
  name: string;
}

export interface NearbyStops_nearest_edges_node_place_DepartureRow_pattern_route {
  __typename: "Route";
  /**
   * Global object ID provided by Relay. This value can be used to refetch this object using **node** query.
   */
  id: string;
  /**
   * Transport mode of this route, e.g. `BUS`
   */
  mode: Mode | null;
  /**
   * Short name of the route, usually a line number, e.g. 550
   */
  shortName: string | null;
}

export interface NearbyStops_nearest_edges_node_place_DepartureRow_pattern {
  __typename: "Pattern";
  /**
   * Global object ID provided by Relay. This value can be used to refetch this object using **node** query.
   */
  id: string;
  /**
   * Vehicle headsign used by trips of this pattern
   */
  headsign: string | null;
  /**
   * Direction of the pattern. Possible values: 0, 1 or -1.  
   *  -1 indicates that the direction is irrelevant, i.e. the route has patterns only in one direction.
   */
  directionId: number | null;
  /**
   * The route this pattern runs on
   */
  route: NearbyStops_nearest_edges_node_place_DepartureRow_pattern_route;
}

export interface NearbyStops_nearest_edges_node_place_DepartureRow_stoptimes {
  __typename: "Stoptime";
  /**
   * Whether the vehicle can be boarded at this stop. This field can also be used
   * to indicate if boarding is possible only with special arrangements.
   */
  pickupType: PickupDropoffType | null;
  /**
   * Departure date of the trip. Format: Unix timestamp (local time) in seconds.
   */
  serviceDay: any | null;
  /**
   * Realtime prediction of departure time. Format: seconds since midnight of the departure date
   */
  realtimeDeparture: number | null;
  /**
   * true, if this stoptime has real-time data available
   */
  realtime: boolean | null;
  /**
   * Vehicle headsign of the trip on this stop. Trip headsigns can change during
   * the trip (e.g. on routes which run on loops), so this value should be used
   * instead of `tripHeadsign` to display the headsign relevant to the user. 
   */
  headsign: string | null;
}

export interface NearbyStops_nearest_edges_node_place_DepartureRow {
  __typename: "DepartureRow";
  /**
   * Stop from which the departures leave
   */
  stop: NearbyStops_nearest_edges_node_place_DepartureRow_stop | null;
  /**
   * Pattern of the departure row
   */
  pattern: NearbyStops_nearest_edges_node_place_DepartureRow_pattern | null;
  /**
   * Departures of the pattern from the stop
   */
  stoptimes: (NearbyStops_nearest_edges_node_place_DepartureRow_stoptimes | null)[] | null;
}

export type NearbyStops_nearest_edges_node_place = NearbyStops_nearest_edges_node_place_Stop | NearbyStops_nearest_edges_node_place_DepartureRow;

export interface NearbyStops_nearest_edges_node {
  __typename: "placeAtDistance";
  /**
   * Global object ID provided by Relay. This value can be used to refetch this object using **node** query.
   */
  id: string;
  /**
   * Walking distance to the place along streets and paths
   */
  distance: number | null;
  place: NearbyStops_nearest_edges_node_place | null;
}

export interface NearbyStops_nearest_edges {
  __typename: "placeAtDistanceEdge";
  /**
   * The item at the end of the edge
   */
  node: NearbyStops_nearest_edges_node | null;
}

export interface NearbyStops_nearest {
  __typename: "placeAtDistanceConnection";
  edges: (NearbyStops_nearest_edges | null)[] | null;
}

export interface NearbyStops {
  /**
   * Get all places (stops, stations, etc. with coordinates) within the specified
   * radius from a location. The returned type is a Relay connection (see
   * https: // facebook.github.io/relay/graphql/connections.htm). The placeAtDistance
   * type has two fields: place and distance. The search is done by walking so the
   * distance is according to the network of walkable streets and paths.
   */
  nearest: NearbyStops_nearest | null;
}

export interface NearbyStopsVariables {
  transportMode: Mode[];
  latitude: number;
  longitude: number;
}
