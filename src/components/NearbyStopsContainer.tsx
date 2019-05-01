import React, { useContext, useEffect } from 'react';

import * as R from 'ramda';

import { getNearbyStops } from '../queries';

import NearbyStops from './NearbyStops';
import { useQuery } from 'react-apollo-hooks';
import { Mode } from '../types/globalTypes';
import { LatLng } from '../types';
import { NearbyStops as NearbyStopsType } from '../types/NearbyStops';
import Messages from './Messages';
import { StoreProvider, StoreContext } from './Store';
import { usePrevious } from '../utils/hooks';

type Props = {
  onLoad: Function;
};

const NearbyStopsContainer: React.FunctionComponent<Props> = ({ onLoad }) => {
  const { state } = useContext(StoreContext)!;

  const transportMode = state.filters.length ? state.filters : R.values(Mode);

  console.log(state.filters);

  const { data, loading, error } = useQuery<NearbyStopsType>(getNearbyStops, {
    variables: {
      transportMode,
      ...state.location
    },
    pollInterval: 30 * 1000,
    suspend: false
  });

  const prevData = usePrevious(data);

  if (error) {
    return <Messages message="error" />;
  }

  if (!data) {
    return <Messages message="error" />;
  }

  const displayedData = loading ? prevData : data;

  return (
    <NearbyStops
      onUpdated={onLoad}
      data={(displayedData && displayedData.nearest) || {}}
      loading={state.loading}
    />
  );
};

export default NearbyStopsContainer;
