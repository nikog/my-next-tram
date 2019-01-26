import React from 'react';

import { Query } from 'react-apollo';

import { getRoutes } from '../queries';
import { GetRoutesQuery, GetRoutesVariables, vehicleMode } from '../types';
import Route from './Route';
import styled from 'styled-components';

class RouteQuery extends Query<GetRoutesQuery, GetRoutesVariables> {}

const RouteList = styled.div`
  display: flex;
  flex-flow: row;
`;

const Routes = () => (
  <RouteQuery query={getRoutes} variables={{ transportMode: vehicleMode.TRAM }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading</p>;
      }

      if (error) {
        return <p>Error</p>;
      }

      if (!data) {
        return <p>no data</p>;
      }

      const { routes } = data;

      return (
        <RouteList>
          {routes.map(route => (
            <button>{route.shortName}</button>
          ))}
        </RouteList>
      );
    }}
  </RouteQuery>
);

export default Routes;
