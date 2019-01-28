import React from 'react';
import styled, { css, AnyStyledComponent } from 'styled-components';

import * as R from 'ramda';

import { darken, transparentize, lighten } from 'polished';

import { vehicleMode } from '../types';

import { ReactComponent as TramIcon } from '../icons/tram.svg';
import { ReactComponent as RailIcon } from '../icons/rail.svg';
import { ReactComponent as SubwayIcon } from '../icons/subway.svg';
import { ReactComponent as BusIcon } from '../icons/bus.svg';

import { colors } from '../utils/colors';

interface VehicleProps {
  dispatch: Function;
  activeFilters: vehicleMode[];
}

type ButtonProps = {
  color: string;
  isActive?: boolean;
};

const ButtonContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const buttonActiveStyles = css`
  background: ${(props: ButtonProps) => darken(0.15, props.color)};
  box-shadow: inset 0 3px 0 0
      ${(props: ButtonProps) => darken(0.2, props.color)},
    0 3px 0 0 ${(props: ButtonProps) => darken(0.15, props.color)};

  :hover {
    background: ${(props: ButtonProps) => darken(0.1, props.color)};
  }
`;

const Button = styled.button`
  background: ${(props: ButtonProps) => props.color};
  border: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  box-shadow: 0 3px 0 0 ${(props: ButtonProps) => darken(0.1, props.color)};

  :hover {
    background: ${(props: ButtonProps) => lighten(0.05, props.color)};
  }

  ${(props: ButtonProps) => props.isActive && buttonActiveStyles};

  :focus {
    z-index: 1;
  }

  :not(:last-child) {
    border-right: 1px solid rgba(100, 100, 100, 0.3);
  }

  :first-child {
    border-radius: 6px 0 0 6px;
  }

  :last-child {
    border-radius: 0 6px 6px 0;
  }

  svg {
    height: 2rem;
    width: 2rem;
    fill: white;
  }
`;

const icons: { [index: string]: React.SFC } = {
  RAIL: RailIcon,
  TRAM: TramIcon,
  BUS: BusIcon,
  SUBWAY: SubwayIcon
};

const Vehicles: React.SFC<VehicleProps> = ({ dispatch, activeFilters }) => (
  <ButtonContainer>
    {R.pipe(
      R.mapObjIndexed((val: vehicleMode) => {
        const Icon = icons[val];

        const isActive = activeFilters.includes(val);

        return (
          <Button
            key={val}
            type="button"
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
);

export default Vehicles;
