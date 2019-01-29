import React, { useState, useEffect, useReducer } from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Vehicles from './components/Vehicles';
import NearbyStops from './components/NearbyStopsContainer';
import { vehicleMode } from './types';

import { useLocation } from './utils/hooks';

import './reset.css';
import './style.css';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

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

const persistedFiltersString = localStorage.getItem('filters');

const initialState = {
  filters: persistedFiltersString ? JSON.parse(persistedFiltersString) : []
};

const App = () => {
  const position = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() =>
    localStorage.setItem('filters', JSON.stringify(state.filters))
  );

  // const position = { latitude: 60.164829, longitude: 24.93425 };

  return (
    <ApolloProvider client={client}>
      <Vehicles dispatch={dispatch} activeFilters={state.filters} />
      {!position && <p>Waiting for location</p>}
      {position && (
        <NearbyStops vehicleModeFilters={state.filters} position={position} />
      )}
    </ApolloProvider>
  );
};

export default App;
