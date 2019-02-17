import React, { memo } from 'react';

import * as R from 'ramda';

import posed, { PoseGroup } from 'react-pose';

import styled from 'styled-components';
import GroupedDepartureRow from './GroupedDepartureRow';
import { getColor } from '../utils/colors';
import DepartureRow from './DepartureRow';
import { Mode } from '../types/globalTypes';
import {
  NearbyStops_nearest,
  NearbyStops_nearest_edges,
  NearbyStops_nearest_edges_node
} from '../types/NearbyStops';

type ContainerProps = {
  color?: string | null;
};

const Container = styled.div``;

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

const StyledAnimatedRow = styled(AnimatedRow)`
  min-height: 100vh;
  padding-bottom: 5rem;
  background: ${(props: ContainerProps) => props.color};
`;

type GroupedEdges = [NearbyStops_nearest_edges, NearbyStops_nearest_edges];

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

const renderDepartureRows = R.map(
  R.ifElse(
    R.propSatisfies(R.gt(R.__, 1), 'length'),
    (nodes: GroupedEdges) => (
      <GroupedDepartureRow
        nodes={nodes}
        key={R.path([0, 'node', 'id'], nodes)}
      />
    ),
    R.pipe(
      R.path([0, 'node']),
      (node: NearbyStops_nearest_edges_node) => (
        <DepartureRow data={node} key={node && node.id} />
      )
    )
  )
);

const groupAndFilterDepartures = R.pipe(
  R.propOr([], 'edges'),
  filterNoStopTimes,
  groupByRoute,
  distanceSort,
  groupDirectionSort
);

type Props = {
  loading?: boolean;
  transportMode?: Mode[];
  data: NearbyStops_nearest;
};

const NearbyStops: React.FunctionComponent<Props> = ({
  data,
  transportMode,
  loading
}) => {
  const departures = groupAndFilterDepartures(data);
  const departureRows = renderDepartureRows(departures);
  const color = lastPatternColor(departures);

  return (
    <Container>
      <PoseGroup animateOnMount={true} flipMove={false}>
        <StyledAnimatedRow key={JSON.stringify(transportMode)} color={color}>
          {!loading && departureRows}
        </StyledAnimatedRow>
      </PoseGroup>
    </Container>
  );
};

export default memo(NearbyStops);
