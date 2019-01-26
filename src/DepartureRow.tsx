import React from 'react';
import { DepartureRow as DepartureRowType } from './types';

type StopsProps = {
  stop: DepartureRowType;
};

const DepartureRow: React.SFC<StopsProps> = ({
  stop: {
    stop: { name },
    stoptimes
  }
}) => {
  if (!stoptimes.length) {
    return null;
  }

  return (
    <div>
      {stoptimes.map(
        ({ realtimeDeparture, trip: { tripHeadsign, routeShortName } }) => {
          var t = new Date(1970, 0, 1); // Epoch
          t.setSeconds(realtimeDeparture);
          const time = t.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={realtimeDeparture}>
              <p>
                {routeShortName} to {tripHeadsign} at {time} from {name}
              </p>
            </div>
          );
        }
      )}
    </div>
  );
};

export default DepartureRow;
