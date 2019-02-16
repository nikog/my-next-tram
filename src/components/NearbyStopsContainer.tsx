import React from 'react';

import * as R from 'ramda';

import { getNearbyStops } from '../queries';

import NearbyStops from './NearbyStops';
import { useQuery } from 'react-apollo-hooks';
import { Mode } from '../types/globalTypes';
import { Position } from '../types';

type Props = {
  vehicleModeFilters: Mode[];
  position: Position;
};

const NearbyStopsContainer: React.FunctionComponent<Props> = ({
  vehicleModeFilters,
  position: { latitude, longitude }
}) => {
  const transportMode = vehicleModeFilters.length
    ? vehicleModeFilters
    : R.values(Mode);

  const { data, loading, error } = useQuery(getNearbyStops, {
    variables: {
      transportMode,
      latitude,
      longitude
    },
    pollInterval: 30 * 1000,
    suspend: false
  });

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
};

export default NearbyStopsContainer;
