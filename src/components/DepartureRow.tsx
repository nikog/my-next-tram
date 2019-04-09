import React from 'react';
import { getColor } from '../utils/colors';
import styled, { AnyStyledComponent } from 'styled-components';

import { ReactComponent as RealtimeIcon } from '../icons/realtime.svg';

import { ReactComponent as SvgIcon } from '../icons/arrow-alt-circle-light-solid.svg';
import {
  NearbyStops_nearest_edges_node,
  NearbyStops_nearest_edges_node_place_DepartureRow
} from '../types/NearbyStops';
import Counter from './Counter';

const StyledDepartureRow: AnyStyledComponent = styled.div`
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
  ref?: React.Ref<HTMLInputElement> | null;
  rowRef?: React.Ref<HTMLInputElement> | null;
};

const DepartureRow: React.FunctionComponent<Props> = ({ data, rowRef }) => {
  const place = data.place as NearbyStops_nearest_edges_node_place_DepartureRow;
  const distance = data.distance;

  const stop = place.stop!;
  const stoptime = place.stoptimes![0]!;
  const pattern = place.pattern!;

  const route = pattern.route;
  const departureTime =
    (stoptime.serviceDay + stoptime.realtimeDeparture) * 1000;

  return (
    <StyledDepartureRow ref={rowRef}>
      <RouteInfo>
        <RouteName>{route && route.shortName}</RouteName>
        <Destination>
          <StyledSvgIcon />
          {pattern.headsign}
        </Destination>
        <Stopname>
          {stop.name} ({distance}m)
        </Stopname>
      </RouteInfo>
      <DepartureTimeContainer>
        <Time>
          <Counter departureTime={departureTime} />
          {stoptime.realtime && <StyledRealtimeIcon />}
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
