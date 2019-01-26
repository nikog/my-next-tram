import React from 'react';
import { DepartureRow as DepartureRowType } from './types';
import { lineColors, colors } from './colors';
import styled from 'styled-components';

import { ReactComponent as SvgIcon } from './icons/arrow-alt-circle-light-solid.svg';

type StopsProps = {
  stop: DepartureRowType;
};

type StyledDepartureRowProps = {
  lineColor: string;
};

const StyledDepartureRow = styled.div`
  background: ${(props: StyledDepartureRowProps) => props.lineColor};
  color: white;
  padding: 1rem;
  border-bottom: 1px solid rgba(100, 100, 100, 0.3);
  display: flex;
  align-items: center;
  flex-flow: row;
`;

const RouteInfo = styled.div`
  display flex;
  flex-flow: column;
`;

const RouteName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  background: white;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: ${(props: StyledDepartureRowProps) => props.lineColor};

  margin-bottom: 0.25rem;
`;

const DepartureTime = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  margin-left: auto;
`;

const Destination = styled.p`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
`;

const StyledSvgIcon = styled(SvgIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;

  fill: white;
`;

const Stopname = styled.p`
  font-size: 0.8rem;
  font-weight: 300;
`;

const DepartureRow: React.SFC<StopsProps> = ({
  stop: {
    stop: { name },
    stoptimes
  }
}) => {
  if (!stoptimes.length) {
    return null;
  }

  const {
    realtimeDeparture,
    trip: {
      tripHeadsign,
      routeShortName,
      route: { mode }
    }
  } = stoptimes[0];

  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(realtimeDeparture);
  const time = t.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const lineColor = lineColors[parseInt(routeShortName, 10)] || colors[mode];

  return (
    <div>
      <StyledDepartureRow lineColor={lineColor}>
        <RouteInfo>
          <RouteName lineColor={lineColor}>{routeShortName}</RouteName>
          <Destination>
            <StyledSvgIcon />
            {tripHeadsign}
          </Destination>
          <Stopname>{name}</Stopname>
        </RouteInfo>
        <DepartureTime>{time}</DepartureTime>
      </StyledDepartureRow>
    </div>
  );
};

export default DepartureRow;
