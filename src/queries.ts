import gql from 'graphql-tag';

export const getNearbyStops = gql`
  query NearbyStops(
    $transportMode: [Mode!]!
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
                headsign

                route {
                  id
                  mode
                  shortName
                }
              }
              stoptimes(omitNonPickups: true, timeRange: 3600) {
                pickupType
                serviceDay
                realtimeDeparture
                headsign

                trip {
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
