import React from 'react';
import styled from 'styled-components';

import { vehicleMode } from '../types';

import { ReactComponent as TramIcon } from '../icons/tram.svg';
import { ReactComponent as RailIcon } from '../icons/rail.svg';
import { ReactComponent as SubwayIcon } from '../icons/subway.svg';
import { ReactComponent as BusIcon } from '../icons/bus.svg';

import { colors } from '../colors';

interface VehicleProps {
  onSelectVehicle: Function;
}

type ButtonProps = {
  color: string;
};

const ButtonContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
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

  :focus {
    z-index: 1;
  }

  :not(:last-child) {
    border-right: 1px solid rgba(100, 100, 100, 0.3);
  }

  :first-child {
    border-radius: 3px 0 0 3px;
  }

  :last-child {
    border-radius: 0 3px 3px 0;
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

const Vehicles: React.SFC<VehicleProps> = ({ onSelectVehicle }) => (
  <ButtonContainer>
    {Object.keys(vehicleMode).map(val => {
      const Icon = icons[val];

      return (
        <Button
          key={val}
          type="button"
          color={colors[val]}
          onClick={() => onSelectVehicle(val)}
        >
          {Icon ? <Icon /> : val}
        </Button>
      );
    })}
  </ButtonContainer>
);

export default Vehicles;
