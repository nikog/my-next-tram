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

type BackgroundProps = {
  color: string;
};

const BackgroundColor = createGlobalStyle`
  html {
    background-color: ${(props: BackgroundProps) => props.color};
  }

  html, body, .root {
    height: 100vh;
  }
`;

const lastPatternColor = R.pipe(
  (arr: any[]) => R.last(arr),
  R.pathOr({}, [0, 'node', 'place', 'pattern', 'route']),
  R.props(['shortName', 'mode']),
  getColor
);

const renderDepartureRows = R.map((nodes: NearbyStops_nearest_edges[]) => (
  <GroupedDepartureRow nodes={nodes} key={R.path([0, 'node', 'id'], nodes)} />
));

type Props = {
  data: NearbyStops_nearest_edges[][];
};

const NearbyStops: React.FunctionComponent<Props> = ({ data }) => {
  const { departureRows, color } = useMemo(
    () => ({
      departureRows: renderDepartureRows(data),
      color: lastPatternColor(data)
    }),
    [data]
  );

  return (
    <>
      <BackgroundColor color={color} />
      {/* <PoseGroup animateOnMount={true} flipMove={false}> */}
      {/* <AnimatedRow key={0}> */}
      {departureRows}
      {/* {!departureRows.length && <Mssages message="empty" />} */}
      {/* </AnimatedRow> */}
      {/* </PoseGroup> */}
    </>
  );
};

export default memo(NearbyStops);
