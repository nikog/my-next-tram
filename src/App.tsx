import React, { useEffect, useReducer, useRef, useState } from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';

import Vehicles from './components/Vehicles';
import NearbyStops from './components/NearbyStopsContainer';

import { useLocation, useElementScrollOffset } from './utils/hooks';

import './reset.css';
import './style.css';
import { Mode } from './types/globalTypes';
import Messages from './components/Messages';
import Map from './components/Map';
import styled from 'styled-components';
import { StoreProvider } from './components/Store';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

const StopsList = styled.div`
  position: relative;
  top: calc(100vh - 10.875rem);
`;

const App = () => {
  // const position = useLocation();

  const position = { latitude: 60.164829, longitude: 24.93425 };

  const mapRef = useRef<HTMLDivElement>(null);
  const offset = useElementScrollOffset(mapRef);

  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <Map position={position} height={offset ? offset.top : 0} />
        <Vehicles />
        {!position && <Messages message="waiting-location" />}
        {position && (
          <StopsList ref={mapRef}>
            <NearbyStops />
          </StopsList>
        )}
      </StoreProvider>
    </ApolloProvider>
  );
};

export default App;
