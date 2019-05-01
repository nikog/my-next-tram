import React, { useReducer, useEffect } from 'react';
import { Mode } from '../types/globalTypes';
import { reducer, initialState, State } from '../state/reducer';

const StoreContext = React.createContext<{
  state: State;
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
