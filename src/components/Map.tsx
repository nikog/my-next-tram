import React, { useEffect, useRef, useContext } from 'react';
import leaflet, { map } from 'leaflet';
import { StoreContext } from './Store';
import { createGlobalStyle } from 'styled-components';
import { setLoading, setLocation } from '../state/actions';

type MapProps = {
  // position: { latitude: number; longitude: number };
  height: number;
};

const MapStyles = createGlobalStyle`
  .my-div-icon {
    width: 2rem;
    height: 2rem
    border-radius: 50%;
    background-color: red;
  }
`;

const Map: React.FunctionComponent<MapProps> = ({ height }) => {
  const { state, dispatch } = useContext(StoreContext)!;

  const map = useRef<leaflet.Map>();
  const renderOptions = useRef<any>({});
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const mapInstance = leaflet.map(mapRef.current, {
      center: [state.location!.latitude, state.location!.longitude],
      zoom: 16,
      zoomControl: false,
      layers: [
        leaflet.tileLayer(
          'https://cdn.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}.png',
          // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            tileSize: 512,
            zoomOffset: -1,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        )
      ]
    });

    mapInstance.on('movestart', () => {
      dispatch(setLoading(true));
    });

    mapInstance.on('moveend', () => {
      const center = mapInstance.getCenter();

      dispatch(setLocation({ latitude: center.lat, longitude: center.lng }));
    });

    const myIcon = leaflet.divIcon({ className: 'my-div-icon' });
    const marker = leaflet
      .marker([state.location!.latitude, state.location!.longitude], {
        icon: myIcon
      })
      .addTo(mapInstance);
    mapInstance.on('move', () => {
      if (!map.current) {
        return;
      }

      const center = map.current.getCenter();

      marker.setLatLng(center);
    });

    map.current = mapInstance;
  }, []);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    // @ts-ignore
    map.current.invalidateSize({ debounceMoveend: true });
  }, [map, height]);

  return (
    <>
      <MapStyles />
      <div
        ref={mapRef}
        style={{
          width: '100vw',
          height: height ? `${height}px` : '100vh',
          position: 'fixed'
        }}
      />
    </>
  );
};

export default Map;
