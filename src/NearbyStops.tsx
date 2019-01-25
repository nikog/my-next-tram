import React from 'react';

import { Query } from 'react-apollo';

import { getNearbyStops } from './queries';
import {
  GetNearbyStopsQuery,
  GetNearbyStopsVariables,
  vehicleMode,
  Position
} from './types';
import styled from 'styled-components';
import Stop from './Stop';

class NearbyStopsQuery extends Query<
  GetNearbyStopsQuery,
  GetNearbyStopsVariables
> {}

type NearbyStopsProps = {
  vehicleMode: vehicleMode | null;
  position: Position;
};

const NearbyStops: React.SFC<NearbyStopsProps> = ({
  vehicleMode,
  position: { latitude, longitude }
}) => (
  <NearbyStopsQuery
    query={getNearbyStops}
    variables={{ transportMode: vehicleMode, latitude, longitude }}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading</p>;
      }

      if (error) {
        return <p>Error</p>;
      }

      if (!data) {
        return <p>no data</p>;
      }

      const {
        nearest: { edges }
      } = data;

      return (
        <div>
          {edges.map(({ node: { place, id } }) => (
            <Stop stop={place} key={id} />
            // <div key={id}>
            //   {vehicleMode} {name}
            //   {stoptimesWithoutPatterns.map(
            //     ({
            //       realtimeDeparture,
            //       pickupType,
            //       trip: { tripHeadsign, routeShortName }
            //     }) => {
            //       var t = new Date(1970, 0, 1); // Epoch
            //       t.setSeconds(realtimeDeparture);
            //       const time = t.toLocaleTimeString('fi-FI');

            //       return (
            //         <div key={realtimeDeparture}>
            //           <p>
            //             {pickupType} {tripHeadsign} {routeShortName} {time}
            //           </p>
            //         </div>
            //       );
            //     }
            //   )}
            // </div>
          ))}
        </div>
      );
    }}
  </NearbyStopsQuery>
);

export default NearbyStops;
