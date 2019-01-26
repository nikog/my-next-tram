import { vehicleMode } from './types';

const colors: { [index: string]: string } = {
  BUS: '#007AC9',
  TRAM: '#00985F',
  SUBWAY: '#ff6319',
  RAIL: '#8c4799'
  // FERRY: '#00b9e4',
  // BIKE: '#fcb919'
};

const lineColors: { [index: number]: string } = {
  1: 'rgb(0,187,232)', // colors.ferry,
  2: 'rgb(96,187,70)', // #64be1e
  3: 'rgb(0,135,205)', // #007AC9
  4: 'rgb(237,29,96)', // #dc0451
  5: 'rgb(108,109,112)', // #636363
  6: 'rgb(4,166,101)', // colors.tram
  7: 'rgb(213,14,140)',
  8: 'rgb(121,96,170)', // colors.train
  9: 'rgb(240,152,193)', // #f092cd
  10: 'rgb(252,182,22)' // colors.bike
};

export { colors, lineColors };
