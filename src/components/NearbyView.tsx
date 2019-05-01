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

const StyledStopsList = styled.div`
  position: relative;
  top: calc(100vh - 10.875rem);
`;

const debugPosition = { latitude: 60.164829, longitude: 24.93425 };

const NearbyView = () => {
  const { state, dispatch } = useContext(StoreContext)!;
  // const position = useLocation();
  const initialised = useRef(false);
  const position = debugPosition;
  const mapRef = useRef<HTMLDivElement>(null);
  const offset = useElementScrollOffset(mapRef);
  const [mapHeight, setMapHeight] = useState(0);

  useLayoutEffect(() => {
    setMapHeight(offset && offset.height ? offset.top : 0);
  }, [offset]);

  useEffect(() => {
    dispatch({ type: 'setLocation', payload: position });
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

    dispatch({
      type: 'setLoading',
      payload: false
    });
  }, [dispatch, setMapHeight, mapRef, initialised]);

  const listComponents = useMemo(
    () => (
      <>
        <StyledStopsList ref={mapRef}>
          <NearbyStops onLoad={handleLoad} />
        </StyledStopsList>
        <Vehicles />
      </>
    ),
    [mapRef, handleLoad]
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
