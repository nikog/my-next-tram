import React, { useState } from 'react';
import { DepartureRow as DepartureRowType, Route, vehicleMode } from '../types';
import { lineColors, colors } from '../utils/colors';
import styled, { AnyStyledComponent } from 'styled-components';
import { differenceInMinutes } from 'date-fns';

import * as R from 'ramda';

import { ReactComponent as RealtimeIcon } from '../icons/realtime.svg';

import { ReactComponent as SvgIcon } from '../icons/arrow-alt-circle-light-solid.svg';
import { useInterval } from '../utils/hooks';
import {
  NearbyStops_nearest_edges_node_place_DepartureRow,
  NearbyStops_nearest_edges_node_place_DepartureRow_stop,
  NearbyStops_nearest_edges_node_place_DepartureRow_stoptimes,
  NearbyStops_nearest_edges_node
} from '../types/NearbyStops';
import { Mode } from '../types/globalTypes';

type StyledDepartureRowProps = {
  lineColor: string;
};

const StyledDepartureRow: AnyStyledComponent = styled.div`
  background: ${(props: StyledDepartureRowProps) => props.lineColor};
  color: white;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  flex-flow: row;
`;

const RouteInfo = styled.div`
  display flex;
  flex-flow: column;
`;

const RouteName = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const RouteNameCircled = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  background: white;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  color: ${(props: StyledDepartureRowProps) => props.lineColor};

  margin-bottom: 0.25rem;
`;

const DepartureTimeContainer = styled.div`
  margin-left: auto;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Time = styled.p`
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Units = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 300;
`;

const Destination = styled.p`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const StyledSvgIcon = styled(SvgIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;

  fill: white;
`;

const Stopname = styled.p`
  font-size: 0.75rem;
  font-weight: 300;
`;

const StyledRealtimeIcon = styled(RealtimeIcon)`
  position: absolute;
  right: -1rem;
  top: -0.25rem;
  width: 1rem;
  height: 1rem;

  path {
    fill: white;
  }

  transform: rotate(45deg);
`;

type Props = {
  data: NearbyStops_nearest_edges_node;
  ref?: React.Ref<HTMLElement> | null;
  rowRef?: React.Ref<HTMLElement> | null;
};

const DepartureRow: React.FunctionComponent<Props> = ({ data, rowRef }) => {
  const place = R.propOr({}, 'place', data);
  const distance = R.prop('distance', data);
  const stopName = R.pathOr('', ['stop', 'name'], place);
  const headsign = R.path(['pattern', 'headsign'], place);
  const shortName = R.pathOr('', ['pattern', 'route', 'shortName'], place);
  const mode = R.pathOr(null, ['pattern', 'route', 'mode'], place);
  const lineColor = R.prop(parseInt(shortName, 10), lineColors) || colors[mode];
  const departureTime = R.pipe(
    R.pathOr({}, ['stoptimes', 0]),
    R.props<string, number>(['serviceDay', 'realtimeDeparture']),
    R.sum,
    R.multiply(1000)
  )(place);
  const realtime = R.pathOr(false, ['stoptimes', 0, 'realtime'], place);

  const currentTime = Date.now();
  const timeDiffToNow = differenceInMinutes(departureTime, currentTime);

  return (
    <StyledDepartureRow lineColor={lineColor} ref={rowRef}>
      <RouteInfo>
        <RouteName>{shortName}</RouteName>
        <Destination>
          <StyledSvgIcon />
          {headsign}
        </Destination>
        <Stopname>
          {stopName} ({distance}m)
        </Stopname>
      </RouteInfo>
      <DepartureTimeContainer>
        <Time>
          {timeDiffToNow}
          {realtime && <StyledRealtimeIcon />}
        </Time>
        <Units> minutes</Units>
      </DepartureTimeContainer>
    </StyledDepartureRow>
  );
};

const DepartureRowWithRefForward: React.ComponentType<Props> = React.forwardRef(
  (props, ref) => <DepartureRow rowRef={ref} {...props} />
);

export default DepartureRowWithRefForward;
