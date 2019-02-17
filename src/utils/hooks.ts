import { useState, useEffect } from 'react';

import { Position } from '../types';

export const useLocation = () => {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const success = ({
      coords: { latitude, longitude }
    }: {
      coords: Position;
    }) => setPosition({ latitude, longitude });
    const err = (err: any) => console.error(err);
    const options = {
      // maximumAge: 60 * 1000,
      // timeout: 30 * 1000
    };

    navigator.geolocation.getCurrentPosition(success, err, options);
  }, []);

  return position;
};

export const useOnMinuteInterval = (callback: Function, time: number) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout, interval: number;
    const seconds = Math.ceil((time / 1000) % 60);
    const minutes = Math.ceil((time / 1000 / 60) % 60);

    if (minutes > 1) {
      timeout = setTimeout(() => {
        callback();
        interval = setInterval(callback, 60 * 1000);
      }, seconds * 1000);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [time]);
};
