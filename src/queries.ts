import gql from 'graphql-tag';

export const getRoutes = gql`
  query Routes($transportMode: [Mode]) {
    routes(transportModes: $transportMode) {
      shortName
      id
    }
  }
`;

export const getNearbyStops = gql`
  query NearbyStops(
    $transportMode: [Mode]
    $latitude: Float!
    $longitude: Float!
  ) {
    nearest(
      lat: $latitude # 60.164829
      lon: $longitude # 24.934250
      filterByModes: $transportMode
      filterByPlaceTypes: STOP
    ) {
      edges {
        node {
          place {
            ... on Stop {
              name
              id
              # direction
              vehicleMode

              cluster {
                stops {
                  name
                  id
                  vehicleMode
                }
              }

              stoptimesWithoutPatterns {
                trip {
                  routeShortName
                  tripHeadsign
                }
                pickupType
                realtimeArrival
                realtimeDeparture
              }
            }
          }
        }
      }
    }
  }
`;
