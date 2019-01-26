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
      maxResults: 100
      lat: $latitude
      lon: $longitude
      filterByModes: $transportMode
      filterByPlaceTypes: DEPARTURE_ROW
    ) {
      edges {
        node {
          id
          distance
          place {
            ... on DepartureRow {
              stop {
                id
                name
              }
              pattern {
                id
                route {
                  id
                  mode
                  shortName
                }
              }
              stoptimes(omitNonPickups: true, timeRange: 7200) {
                pickupType
                serviceDay
                realtimeDeparture

                trip {
                  tripHeadsign
                  directionId
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ... on Stop {
//   name
//   id
//   # direction
//   vehicleMode

//   cluster {
//     stops {
//       name
//       id
//       vehicleMode
//     }
//   }

//   stoptimesWithoutPatterns {
//     trip {
//       routeShortName
//       tripHeadsign
//     }
//     pickupType
//     realtimeArrival
//     realtimeDeparture
//   }
// }
