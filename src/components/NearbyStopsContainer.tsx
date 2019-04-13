import React, { useContext } from 'react';

import * as R from 'ramda';

import { getNearbyStops } from '../queries';

import NearbyStops from './NearbyStops';
import { useQuery } from 'react-apollo-hooks';
import { Mode } from '../types/globalTypes';
import { Position } from '../types';
import { NearbyStops as NearbyStopsType } from '../types/NearbyStops';
import Messages from './Messages';
import { StoreProvider, StoreContext } from './Store';

type Props = {};

const NearbyStopsContainer: React.FunctionComponent<Props> = () => {
  const { state } = useContext(StoreContext)!;

  const transportMode = state.filters.length ? state.filters : R.values(Mode);

  const { data, loading, error } = useQuery<NearbyStopsType>(getNearbyStops, {
    variables: {
      transportMode,
      ...state.location
    },
    pollInterval: 30 * 1000,
    suspend: false
  });

  if (error) {
    return <Messages message="error" />;
  }

  if (!data) {
    return <Messages message="error" />;
  }

  return (
    <NearbyStops
      data={data.nearest || {}}
      transportMode={transportMode}
      loading={loading}
    />
  );
};

export default NearbyStopsContainer;
