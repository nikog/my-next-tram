import React from 'react';
import { DepartureRow as DepartureRowType, Route, vehicleMode } from '../types';
import { lineColors, colors } from '../colors';
import styled, { AnyStyledComponent } from 'styled-components';

import { ReactComponent as SvgIcon } from '../icons/arrow-alt-circle-light-solid.svg';

type StopsProps = {
  stop: DepartureRowType;
  distance: number;
  ref?: React.Ref<HTMLElement> | null;
  rowRef?: React.Ref<HTMLElement> | null;
};

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
  font-size: 0.75rem;
  font-weight: 300;
`;

const DepartureRow: React.SFC<StopsProps> = ({
  distance,
  stop: {
    stop: { name },
    pattern: {
      headsign,
      route: { mode, shortName }
    },
    stoptimes
  },
  rowRef
}) => {
  if (!stoptimes.length) {
    return null;
  }

  const { headsign: longHeadsign, realtimeDeparture } = stoptimes[0];

  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(realtimeDeparture);
  const time = t.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const lineColor = lineColors[parseInt(shortName, 10)] || colors[mode];

  return (
    <StyledDepartureRow lineColor={lineColor} ref={rowRef}>
      <RouteInfo>
        {/* {mode !== vehicleMode.BUS ? (
            <RouteNameCircled lineColor={lineColor}>
              {shortName}
            </RouteNameCircled>
          ) : ( */}
        <RouteName>{shortName}</RouteName>
        {/* )} */}
        <Destination>
          <StyledSvgIcon />
          {mode === vehicleMode.RAIL ? longHeadsign : headsign}
        </Destination>
        <Stopname>
          {name} ({distance}m)
        </Stopname>
      </RouteInfo>
      <DepartureTime>{time}</DepartureTime>
    </StyledDepartureRow>
  );
};

const DepartureRowWithRefForward: React.ComponentType<
  StopsProps
> = React.forwardRef((props, ref) => <DepartureRow rowRef={ref} {...props} />);

export default DepartureRowWithRefForward;
