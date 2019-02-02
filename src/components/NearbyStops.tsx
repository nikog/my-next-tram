import React, { useState, useLayoutEffect, memo } from 'react';

import * as R from 'ramda';

import posed, { PoseGroup } from 'react-pose';

import styled from 'styled-components';
import GroupedDepartureRow from './GroupedDepartureRow';
import { getColor } from '../utils/colors';
import DepartureRow from './DepartureRow';
import { Node } from '../types';

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

const lastPatternColor = R.pipe(
  R.ifElse(
    R.isEmpty,
    R.always(null),
    R.pipe(
      R.last,
      R.pathOr({}, [0, 'node', 'place', 'pattern', 'route']),
      R.props(['shortName', 'mode']),
      getColor
    )
  )
);

const renderDepartureRows = R.pipe<object, object, React.ReactElement<any>[]>(
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

      component = <DepartureRow stop={place} distance={distance} key={key} />;
    }

    return component;
  }),
  R.values
);

type Props = {
  data: {
    edges?: Array<{
      node: Node;
    }>;
  };
};

const NearbyStops: React.FunctionComponent<Props> = ({ data }) => {
  const { edges = [] } = data;

  const departures = R.pipe<any[], any[], any[], any>(
    filterNoStopTimes,
    groupByStopAndPattern,
    distanceDepartureSort
  )(edges);

  const departureRows = renderDepartureRows(departures);

  const color = lastPatternColor(departures);

  return (
    <Container>
      <PoseGroup animateOnMount={true} flipMove={false}>
        <StyledAnimatedRow key={Date.now()} color={color}>
          {departureRows}
        </StyledAnimatedRow>
      </PoseGroup>
    </Container>
  );
};

NearbyStops.defaultProps = {
  data: {}
};

export default memo(NearbyStops);
