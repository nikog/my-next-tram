import { Mode } from '../types/globalTypes';
import { LatLng } from '../types';

export const addFilter = (filter: Mode) => ({
  type: 'addFilter',
  payload: filter
});

export const removeFilter = (filter: Mode) => ({
  type: 'removeFilter',
  payload: filter
});

export const setLocation = (location: LatLng) => ({
  type: 'setLocation',
  payload: location
});

export const setLoading = (isLoading: boolean) => ({
  type: 'setLoading',
  payload: isLoading
});
