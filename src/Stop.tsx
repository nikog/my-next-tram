import React from 'react';
import { Place } from './types';

type StopsProps = {
  stop: Place;
};

const Stop: React.SFC<StopsProps> = ({
  stop: {
    vehicleMode,
    name,
    stoptimesWithoutPatterns = [],
    cluster: { stops }
  }
}) => {
  return (
    <div>
      {vehicleMode} {name}
      {stoptimesWithoutPatterns.map(
        ({
          realtimeDeparture,
          pickupType,
          trip: { tripHeadsign, routeShortName }
        }) => {
          var t = new Date(1970, 0, 1); // Epoch
          t.setSeconds(realtimeDeparture);
          const time = t.toLocaleTimeString('fi-FI');

          return (
            <div key={realtimeDeparture}>
              <p>
                {routeShortName} to {tripHeadsign} at {time}
              </p>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Stop;
