import React from 'react';
import { Query } from 'react-apollo';

import * as R from 'ramda';

import { getNearbyStops } from '../queries';
import {
  GetNearbyStopsQuery,
  GetNearbyStopsVariables,
  vehicleMode,
  Position,
  Node
} from '../types';

import DepartureRow from './DepartureRow';
import { object } from 'prop-types';

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
  R.ascend(R.path([0, 'node', 'distance'])),
  R.ascend(
    R.pipe(
      R.path([0, 'node', 'place', 'stoptimes', 0, 'realtimeDeparture']),
      getTime
    )
  )
]);

const groupByStopAndPattern = R.pipe(
  R.groupBy(
    R.pathOr<string>('unknown', [
      'node',
      'place',
      'pattern',
      'route',
      'shortName'
    ])
  ),
  R.values
  // R.map<object, object[]>(
  //   R.groupBy(R.pathOr<string>('unknown', ['node', 'place', 'stop', 'name']))
  // )
);

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

      const departures = R.pipe<any[], any[], any[], any>(
        filterNoStopTimes,
        groupByStopAndPattern,
        distanceDepartureSort
      )(edges);

      const departureRows = R.pipe<object, object, object[]>(
        R.mapObjIndexed(
          (
            nodes: [{ node: Node }, { node: Node | undefined }],
            key: string
          ) => {
            const [
              { node: firstNode },
              { node: secondNode } = { node: undefined }
            ] = nodes;

            return (
              <React.Fragment key={key}>
                {firstNode && (
                  <DepartureRow
                    stop={firstNode.place}
                    distance={firstNode.distance}
                  />
                )}
                {secondNode && (
                  <DepartureRow
                    stop={secondNode.place}
                    distance={secondNode.distance}
                  />
                )}
              </React.Fragment>
            );
          }
        ),
        R.values
      )(departures);

      return (
        <div>
          {departureRows}
          {/* {R.map(
            R.map(
              R.map(({ node: { place, id } }: { node: Node }) => (
                <DepartureRow stop={place} key={id} />
              ))
            )
          )(departures)} */}
        </div>
      );
    }}
  </NearbyStopsQuery>
);

export default NearbyStops;
