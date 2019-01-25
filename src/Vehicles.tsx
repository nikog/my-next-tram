import React from 'react';

import { vehicleMode } from './types';

interface VehicleProps {
  onSelectVehicle: Function;
}

const Vehicles: React.SFC<VehicleProps> = ({ onSelectVehicle }) => (
  <React.Fragment>
    {Object.keys(vehicleMode).map(val => (
      <button key={val} onClick={() => onSelectVehicle(val)}>
        {val}
      </button>
    ))}
  </React.Fragment>
);

export default Vehicles;
