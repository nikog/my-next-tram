import React, { useEffect, useRef, useContext } from 'react';
import leaflet, { map } from 'leaflet';
import { StoreContext } from './Store';

type MapProps = {
  position: { latitude: number; longitude: number };
  height: number;
};

const Map: React.FunctionComponent<MapProps> = ({ position, height }) => {
  const { dispatch } = useContext(StoreContext)!;

  const map = useRef<leaflet.Map>();
  const renderOptions = useRef<any>({});
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const mapInstance = leaflet.map(mapRef.current, {
      center: [position.latitude, position.longitude],
      zoom: 16,
      zoomControl: false,
      layers: [
        leaflet.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        )
      ]
    });

    mapInstance.on('moveend', () => {
      if (renderOptions.current.preventEvents) {
        return;
      }

      const center = mapInstance.getCenter();

      dispatch({
        type: 'setLocation',
        payload: { latitude: center.lat, longitude: center.lng }
      });
    });

    map.current = mapInstance;
  }, []);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    renderOptions.current.preventEvents = true;

    // @ts-ignore
    map.current.invalidateSize({ debounceMoveEnd: true });

    map.current.once('moveend', () => {
      renderOptions.current.preventEvents = false;
    });
  }, [height]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100vw',
        height: `${height}px`,
        position: 'fixed'
      }}
    />
  );
};

export default Map;
