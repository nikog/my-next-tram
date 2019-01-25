import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  background: green;
  color: white;
  margin-right: 1rem;
  padding: 1rem;
  border-radius: 3px;
  cursor: pointer;
`;

const Route: React.SFC = ({ children }) => <Container>{children}</Container>;

export default Route;
