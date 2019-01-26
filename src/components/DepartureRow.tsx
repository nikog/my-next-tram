import React from 'react';
import { DepartureRow as DepartureRowType, Route } from '../types';
import { lineColors, colors } from '../colors';
import styled from 'styled-components';

import { ReactComponent as SvgIcon } from '../icons/arrow-alt-circle-light-solid.svg';

type StopsProps = {
  stop: DepartureRowType;
  distance: number;
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

  :first-child {
    border-radius: 3px 3px 0 0;
  }
`;

const RouteInfo = styled.div`
  display flex;
  flex-flow: column;
`;

const RouteName = styled.h3`
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
  distance,
  stop: {
    stop: { name },
    pattern: {
      route: { mode, shortName }
    },
    stoptimes
  }
}) => {
  if (!stoptimes.length) {
    return null;
  }

  const {
    realtimeDeparture,
    trip: { tripHeadsign }
  } = stoptimes[0];

  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(realtimeDeparture);
  const time = t.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const lineColor = lineColors[parseInt(shortName, 10)] || colors[mode];

  return (
    <React.Fragment>
      <StyledDepartureRow lineColor={lineColor}>
        <RouteInfo>
          <RouteName lineColor={lineColor}>{shortName}</RouteName>
          <Destination>
            <StyledSvgIcon />
            {tripHeadsign}
          </Destination>
          <Stopname>
            {name} ({distance}m)
          </Stopname>
        </RouteInfo>
        <DepartureTime>{time}</DepartureTime>
      </StyledDepartureRow>
    </React.Fragment>
  );
};

export default DepartureRow;
