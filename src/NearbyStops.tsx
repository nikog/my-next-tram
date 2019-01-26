import React from 'react';
import { Query } from 'react-apollo';

import * as R from 'ramda';

import { getNearbyStops } from './queries';
import {
  GetNearbyStopsQuery,
  GetNearbyStopsVariables,
  vehicleMode,
  Position,
  Node
} from './types';

import DepartureRow from './DepartureRow';

const getTime = ({ serviceDay, realtimeDeparture }: any) =>
  serviceDay + realtimeDeparture;

const filterNoStopTimes = R.reject(
  R.pipe(
    R.pathOr([], ['node', 'place', 'stoptimes']),
    R.length,
    R.equals(0)
  )
);

const distanceDepartureSort = R.sortWith([
  R.ascend(R.path(['node', 'distance'])),
  R.ascend(
    R.pipe(
      R.path(['node', 'place', 'stoptimes', 0, 'realtimeDeparture']),
      getTime
    )
  )
]);

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

      const departures = R.pipe<any[], any[], any[]>(
        filterNoStopTimes,
        distanceDepartureSort
      )(edges);

      return (
        <div>
          {departures.map(({ node: { place, id } }: { node: Node }) => (
            <DepartureRow stop={place} key={id} />
          ))}
        </div>
      );
    }}
  </NearbyStopsQuery>
);

export default NearbyStops;
