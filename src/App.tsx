import React, { useState, useEffect } from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Vehicles from './Vehicles';
import Routes from './Routes';
import NearbyStops from './NearbyStops';
import { Position } from './types';

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

const App = () => {
  const [vehicle, setVehicle] = useState(null);
  // const position = useLocation();

  const position = { latitude: 60.164829, longitude: 24.93425 };
  return (
    <ApolloProvider client={client}>
      <Vehicles onSelectVehicle={setVehicle} />
      {/* <Routes /> */}
      {!position && <p>Waiting for location</p>}
      {position && <NearbyStops vehicleMode={vehicle} position={position} />}
    </ApolloProvider>
  );
};

export default App;
