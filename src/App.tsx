import React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';

import './reset.css';
import './style.css';
import { StoreProvider } from './components/Store';
import NearbyView from './components/NearbyView';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <NearbyView />
      </StoreProvider>
    </ApolloProvider>
  );
};

export default App;
