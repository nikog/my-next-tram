import { Mode } from '../types/globalTypes';
import { LatLng } from '../types';

export interface State {
  loading: boolean;
  location: LatLng | null;
  filters: Mode[];
}

export type Action =
  | { type: 'addFilter'; payload: Mode }
  | { type: 'removeFilter'; payload: Mode }
  | { type: 'setLocation'; payload: LatLng }
  | { type: 'setLoading'; payload: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'addFilter': {
      const vehicleMode = action.payload as Mode;

      console.log('add');

      return {
        ...state,
        filters: [...state.filters, vehicleMode]
      };
    }

    case 'removeFilter': {
      const vehicleMode = action.payload as Mode;

      console.log('remove');

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

    case 'setLoading': {
      return {
        ...state,
        loading: action.payload
      };
    }
  }
  return state;
};

const persistedFiltersString = localStorage.getItem('filters');

export const initialState = {
  loading: false,
  location: null,
  filters: persistedFiltersString ? JSON.parse(persistedFiltersString) : []
};
