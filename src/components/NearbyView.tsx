import React, {
  useRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useCallback
} from 'react';

import ApolloClient from 'apollo-boost';

import Vehicles from './Vehicles';
import NearbyStops from './NearbyStopsContainer';

import { useLocation, useElementScrollOffset } from '../utils/hooks';

import Messages from './Messages';
import Map from './Map';
import styled from 'styled-components';
import { StoreContext } from './Store';
import { setLocation, setLoading } from '../state/actions';

type StopsListProps = {
  loading: boolean;
};

const StyledStopsList = styled.div`
  position: relative;
  top: calc(100vh - 10.875rem);

  ${(props: StopsListProps) => props.loading && 'filter: brightness(50%);'}
`;

const debugLatLng = { latitude: 60.164829, longitude: 24.93425 };

const NearbyView = () => {
  const { state, dispatch } = useContext(StoreContext)!;
  // const position = useLocation();
  const initialised = useRef(false);
  const position = debugLatLng;
  const mapRef = useRef<HTMLDivElement>(null);
  const offset = useElementScrollOffset(mapRef);
  const [mapHeight, setMapHeight] = useState(0);

  useLayoutEffect(() => {
    setMapHeight(offset && offset.height ? offset.top : 0);
  }, [offset]);

  useEffect(() => {
    dispatch(setLocation(position));
  }, [position]);

  const handleLoad = useCallback(() => {
    // call only once
    if (!initialised.current) {
      window.scrollTo(0, 115 * 3);
      initialised.current = true;
    }

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMapHeight(rect.height ? rect.top : 0);
    }

    dispatch(setLoading(false));
  }, [dispatch, setMapHeight, mapRef, initialised]);

  const listComponents = useMemo(
    () => (
      <>
        <StyledStopsList ref={mapRef} loading={state.loading}>
          <NearbyStops onLoad={handleLoad} />
        </StyledStopsList>
        <Vehicles />
      </>
    ),
    [mapRef, handleLoad, state.loading]
  );

  return state.location ? (
    <>
      <Map height={mapHeight} />
      {listComponents}
    </>
  ) : (
    <Messages message="waiting-location" />
  );
};

export default NearbyView;