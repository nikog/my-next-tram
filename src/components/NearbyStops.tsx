import React, { memo, useMemo, useLayoutEffect, useEffect } from 'react';

import * as R from 'ramda';

import posed, { PoseGroup } from 'react-pose';

import styled, { createGlobalStyle } from 'styled-components';
import GroupedDepartureRow from './GroupedDepartureRow';
import { getColor } from '../utils/colors';

import { Mode } from '../types/globalTypes';
import {
  NearbyStops_nearest,
  NearbyStops_nearest_edges,
  NearbyStops as NearbyStopsType
} from '../types/NearbyStops';
import Messages from './Messages';
import { usePrevious } from '../utils/hooks';

type ContainerProps = {
  color?: string | null;
  loading?: boolean;
};

const Container = styled.div`
  ${(props: ContainerProps) => props.loading && 'opacity: 0.5;'};
`;

const AnimatedRow = posed.div({
  enter: {
    opacity: 1,
    delay: 300,
    transition: {
      duration: 300,
      ease: [0, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 250,
      ease: [0.4, 0, 1, 1]
    }
  }
});

const BackgroundColor = createGlobalStyle`
  html {
    background-color: ${(props: ContainerProps) => props.color};
  }

  html, body, .root {
    height: 100vh;
  }
`;

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

const lastPatternColor = R.pipe(
  (arr: any[]) => R.last(arr),
  R.pathOr({}, [0, 'node', 'place', 'pattern', 'route']),
  R.props(['shortName', 'mode']),
  getColor
);

const renderDepartureRows = R.map((nodes: NearbyStops_nearest_edges[]) => (
  <GroupedDepartureRow nodes={nodes} key={R.path([0, 'node', 'id'], nodes)} />
));

const groupAndFilterDepartures = R.pipe(
  R.propOr([], 'edges'),
  filterNoStopTimes,
  groupByRoute,
  distanceSort,
  groupDirectionSort
);

type Props = {
  loading?: boolean;
  data: NearbyStops_nearest | {};
  onUpdated: Function;
};

const NearbyStops: React.FunctionComponent<Props> = ({
  data,
  loading = false,
  onUpdated
}) => {
  const { departureRows, color } = useMemo(() => {
    const departures = groupAndFilterDepartures(data);
    const departureRows = renderDepartureRows(
      departures as NearbyStops_nearest_edges[][]
    );
    const color = lastPatternColor(departures);

    return { departureRows, color };
  }, [data]);

  useEffect(() => {
    // if (departureRows.length) {
    onUpdated();
    // }
  }, [departureRows.length]);

  return (
    <Container loading={loading}>
      <BackgroundColor color={color} />
      {/* <PoseGroup animateOnMount={true} flipMove={false}> */}
      {/* <AnimatedRow key={0}> */}
      {departureRows}
      {/* {!departureRows.length && <Mssages message="empty" />} */}
      {/* </AnimatedRow> */}
      {/* </PoseGroup> */}
    </Container>
  );
};

export default memo(NearbyStops);
