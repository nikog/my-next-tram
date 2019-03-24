import React from 'react';
import styled, { css } from 'styled-components';

import * as R from 'ramda';

import { darken, lighten } from 'polished';

import { vehicleMode } from '../types';

import { ReactComponent as TramIcon } from '../icons/tram.svg';
import { ReactComponent as RailIcon } from '../icons/rail.svg';
import { ReactComponent as SubwayIcon } from '../icons/subway.svg';
import { ReactComponent as BusIcon } from '../icons/bus.svg';

import { colors } from '../utils/colors';
import { Mode } from '../types/globalTypes';

interface VehicleProps {
  dispatch: Function;
  activeFilters: Mode[];
}

type ButtonProps = {
  color: string;
  isActive?: boolean;
};

const Container = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 3;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  overflow: hidden;

  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);

  border-radius: 4px;
`;

const buttonActiveStyles = css`
  background: ${(props: ButtonProps) => props.color};

  svg {
    fill: white;
  }
`;

const Button = styled.button`
  background: white;
  border: none;
  padding: 0.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  position: relative;
  z-index: 1;

  :focus {
    outline: 0;
  }

  :hover {
    background: ${(props: ButtonProps) => darken(0.1, '#fff')};

    ${(props: ButtonProps) =>
      props.isActive &&
      css`
        background: ${(props: ButtonProps) => lighten(0.1, props.color)};
      `}
  }

  svg {
    height: 2rem;
    width: 2rem;
    fill: ${(props: ButtonProps) => props.color};
  }

  ${(props: ButtonProps) => props.isActive && buttonActiveStyles};
`;

const icons: { [index: string]: React.FunctionComponent } = {
  RAIL: RailIcon,
  TRAM: TramIcon,
  BUS: BusIcon,
  SUBWAY: SubwayIcon
};

const Vehicles: React.FunctionComponent<VehicleProps> = ({
  dispatch,
  activeFilters
}) => (
  <Container>
    <ButtonContainer>
      {R.pipe(
        R.map<typeof vehicleMode, any[]>((val: Mode) => {
          const Icon = icons[val];

          const isActive = activeFilters.includes(val);

          return (
            <Button
              key={val}
              type="button"
              aria-label={`Filter by ${val}`}
              color={colors[val]}
              isActive={isActive}
              onClick={() => {
                if (isActive) {
                  dispatch({ type: 'removeFilter', payload: val });
                } else {
                  dispatch({ type: 'addFilter', payload: val });
                }
              }}
            >
              {Icon ? <Icon /> : val}
            </Button>
          );
        }),
        R.values
      )(vehicleMode)}
    </ButtonContainer>
  </Container>
);

export default Vehicles;
