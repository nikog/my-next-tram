import React from 'react';
import { Query } from 'react-apollo';

import * as R from 'ramda';

import { getNearbyStops } from '../queries';
import {
  GetNearbyStopsQuery,
  GetNearbyStopsVariables,
  vehicleMode,
  Position
} from '../types';

import NearbyStops from './NearbyStops';

class NearbyStopsQuery extends Query<
  GetNearbyStopsQuery,
  GetNearbyStopsVariables
> {}

type Props = {
  vehicleModeFilters: vehicleMode[];
  position: Position;
};

const NearbyStopsContainer: React.FunctionComponent<Props> = ({
  vehicleModeFilters,
  position: { latitude, longitude }
}) => {
  const transportMode = vehicleModeFilters.length
    ? vehicleModeFilters
    : R.values(vehicleMode);

  return (
    <NearbyStopsQuery
      query={getNearbyStops}
      variables={{ transportMode, latitude, longitude }}
      pollInterval={30 * 1000}
    >
      {({ loading, error, data }) => {
        if (error) {
          return <p>Error</p>;
        }

        if (!data) {
          return <p>no data</p>;
        }

        return (
          <NearbyStops
            data={data.nearest}
            transportMode={transportMode}
            loading={loading}
          />
        );
      }}
    </NearbyStopsQuery>
  );
};

export default NearbyStopsContainer;
