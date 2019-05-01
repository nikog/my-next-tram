import React, { useContext, useMemo, useEffect } from 'react';

import * as R from 'ramda';

import { getNearbyStops } from '../queries';

import NearbyStops from './NearbyStops';
import { useQuery } from 'react-apollo-hooks';
import { Mode } from '../types/globalTypes';
import {
  NearbyStops as NearbyStopsType,
  NearbyStops_nearest_edges
} from '../types/NearbyStops';
import Messages from './Messages';
import { StoreContext } from './Store';
import { usePrevious } from '../utils/hooks';

const filterNoStopTimes = R.reject(
  R.pipe(
    R.pathOr([], ['node', 'place', 'stoptimes']),
    R.length,
    R.equals(0)
  )
);

const distanceSort = R.sortBy(R.pathOr(0, [0, 'node', 'distance']));
const groupDirectionSort = R.map(
  R.sortBy(R.pathOr(0, ['node', 'place', 'pattern', 'directionId']))
);

const groupByRoute = R.pipe(
  R.groupBy(R.pathOr('', ['node', 'place', 'pattern', 'route', 'id'])),
  R.values
);

const groupAndFilterDepartures = R.pipe(
  R.propOr([], 'edges'),
  filterNoStopTimes,
  groupByRoute,
  distanceSort,
  groupDirectionSort
);

type Props = {
  onLoad: Function;
};

const NearbyStopsContainer: React.FunctionComponent<Props> = ({ onLoad }) => {
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

  const prevData = usePrevious(data);

  if (error) {
    return <Messages message="error" />;
  }

  if (!data) {
    return <Messages message="error" />;
  }

  const displayData = loading ? prevData : data;

  const formattedData = useMemo(
    () =>
      groupAndFilterDepartures(displayData ? displayData.nearest || {} : {}),
    [displayData]
  ) as NearbyStops_nearest_edges[][];

  useEffect(() => {
    onLoad();
  }, [onLoad, formattedData]);

  return <NearbyStops data={formattedData} />;
};

export default NearbyStopsContainer;
