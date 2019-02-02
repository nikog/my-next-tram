import { useState, useEffect, useRef } from 'react';

import * as R from 'ramda';

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

export const useIntersection = (
  targets: React.RefObject<HTMLElement>[],
  options: object
): [IntersectionObserverEntry[], React.RefObject<HTMLElement>] => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const containerRef = useRef<HTMLElement>(null);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    setEntries(entries);
  };

  useEffect(
    () => {
      const observer = new IntersectionObserver(handleIntersection, {
        root: containerRef.current,
        ...options
      });

      R.map((target: React.RefObject<HTMLElement>) => {
        if (target && target.current) {
          observer.observe(target.current);
        }
      })(targets);

      return () => observer.disconnect();
    },
    [containerRef]
  );

  return [entries, containerRef];
};
