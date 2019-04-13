import React, { useReducer, useEffect } from 'react';
import { Mode } from '../types/globalTypes';

type StateType = {
  location: { latitude: number; longitude: number };
  filters: Mode[];
};

type ActionType = {
  type: 'addFilter' | 'removeFilter' | 'setLocation';
  payload: any;
};

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'addFilter': {
      const vehicleMode = action.payload as Mode;

      return {
        ...state,
        filters: [...state.filters, vehicleMode]
      };
    }

    case 'removeFilter': {
      const vehicleMode = action.payload as Mode;

      return {
        ...state,
        filters: state.filters.filter(filter => filter !== vehicleMode)
      };
    }

    case 'setLocation': {
      return {
        ...state,
        location: action.payload
      };
    }
  }
  return state;
};

const persistedFiltersString = localStorage.getItem('filters');

const initialState = {
  location: null,
  filters: persistedFiltersString ? JSON.parse(persistedFiltersString) : []
};

const StoreContext = React.createContext<{
  state: StateType;
  dispatch: React.Dispatch<any>;
} | null>(null);

type StoreProviderProps = {
  children: React.ReactNode;
};

const StoreProvider: React.FunctionComponent<StoreProviderProps> = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () => localStorage.setItem('filters', JSON.stringify(state.filters)),
    [state.filters]
  );

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
