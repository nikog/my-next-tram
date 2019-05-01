import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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

export const useOnMinuteInterval = (callback: Function, time: number) => {
  useEffect(() => {
    let timeout: number, interval: number;
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

export const useElementScrollOffset = (
  elementRef: React.RefObject<HTMLDivElement>
) => {
  const [offset, setOffset] = useState<ClientRect | DOMRect>();

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) {
        return;
      }

      const element = elementRef.current;

      const offset = element.getBoundingClientRect();

      setOffset(offset);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef]);

  return offset;
};

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = R.isEmpty(value) ? ref.current : value;
  });
  return ref.current;
};
