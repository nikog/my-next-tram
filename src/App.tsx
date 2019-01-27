import React, { useState, useEffect, useReducer } from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Vehicles from './components/Vehicles';
import NearbyStops from './components/NearbyStops';
import { Position, vehicleMode } from './types';

import './reset.css';
import './style.css';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

const useLocation = () => {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const success = ({
      coords: { latitude, longitude }
    }: {
      coords: Position;
    }) => setPosition({ latitude, longitude });
    const err = (err: any) => console.error(err);
    const options = {
      maximumAge: 5 * 60 * 1000
    };

    navigator.geolocation.getCurrentPosition(success, err, options);
  }, []);

  return position;
};

type StateType = {
  filters: vehicleMode[];
};

type ActionType = {
  type: 'addFilter' | 'removeFilter';
  payload: vehicleMode;
};

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'addFilter': {
      const vehicleMode = action.payload;

      return {
        filters: [...state.filters, vehicleMode]
      };
    }

    case 'removeFilter': {
      const vehicleMode = action.payload;

      return {
        filters: state.filters.filter(filter => filter !== vehicleMode)
      };
    }
  }
  return state;
};

const App = () => {
  const [vehicle, setVehicle] = useState(null);
  // const position = useLocation();
  const [state, dispatch] = useReducer(reducer, { filters: [] });

  const position = { latitude: 60.164829, longitude: 24.93425 };
  return (
    <ApolloProvider client={client}>
      <Vehicles dispatch={dispatch} activeFilters={state.filters} />
      {/* <Routes /> */}
      {!position && <p>Waiting for location</p>}
      {position && (
        <NearbyStops vehicleModeFilters={state.filters} position={position} />
      )}
    </ApolloProvider>
  );
};

export default App;
