import React from 'react';
import { Query } from 'react-apollo';

import * as R from 'ramda';

import posed, { PoseGroup } from 'react-pose';

import { getNearbyStops } from '../queries';
import {
  GetNearbyStopsQuery,
  GetNearbyStopsVariables,
  vehicleMode,
  Position,
  Node
} from '../types';

import NearbyStops from './NearbyStops';
import DepartureRow from './DepartureRow';
import GroupedDepartureRow from './GroupedDepartureRow';
import styled from 'styled-components';
import { tween } from 'popmotion';

const Container = styled.div``;

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
      R.path([0, 'node', 'place', 'stoptimes', 0]),
      getTime
    )
  )
]);

const groupByStopAndPattern = R.pipe(
  R.groupBy(
    R.pathOr<string>('unknown', ['node', 'place', 'pattern', 'route', 'id'])
  ),
  R.values
);

class NearbyStopsQuery extends Query<
  GetNearbyStopsQuery,
  GetNearbyStopsVariables
> {}

type NearbyStopsProps = {
  vehicleModeFilters: vehicleMode[];
  position: Position;
};

const NearbyStopsContainer: React.SFC<NearbyStopsProps> = ({
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
    >
      {({ loading, error, data }) => {
        // if (loading && R.empty(data)) {
        //   return <p>Loading</p>;
        // }

        if (error) {
          return <p>Error</p>;
        }

        if (!data) {
          return <p>no data</p>;
        }

        const { nearest: { edges = [] } = {} } = data;

        const departures = R.pipe<any[], any[], any[], any>(
          filterNoStopTimes,
          groupByStopAndPattern,
          distanceDepartureSort
        )(edges);

        const departureRows = R.pipe<object, object, React.ReactElement<any>[]>(
          R.mapObjIndexed((nodes: Array<{ node: Node }>) => {
            const key = nodes[0].node.place.pattern.route.id;
            let component;

            if (nodes.length === 2) {
              component = <GroupedDepartureRow nodes={nodes} key={key} />;
            } else {
              const [
                {
                  node: { place, distance }
                }
              ] = nodes;

              component = (
                <DepartureRow stop={place} distance={distance} key={key} />
              );
            }

            return component;
          }),
          R.values
        )(departures);

        return (
          <NearbyStops
            departures={departureRows}
            data={data}
            loading={loading}
          />
        );
      }}
    </NearbyStopsQuery>
  );
};

export default NearbyStopsContainer;
