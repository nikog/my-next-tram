import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Text = styled.p`
  font-size: 1.5rem;
  max-width: 80%;
`;

type Props = {
  message: 'waiting-location' | 'no-location' | 'error' | 'empty';
};

const messages = {
  'waiting-location': 'Waiting for location',
  'no-location': 'Could not locate',
  error: 'Error fetching results',
  empty: 'No nearby lines'
};

const Messages: React.FunctionComponent<Props> = ({ message }) => {
  return (
    <Container>
      <Text>{messages[message]}</Text>
    </Container>
  );
};

export default Messages;
