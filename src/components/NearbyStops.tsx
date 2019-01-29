import React from 'react';

import * as R from 'ramda';

import posed, { PoseGroup } from 'react-pose';

import styled from 'styled-components';

type ContainerProps = {
  color?: string | null;
};

const Container = styled.div``;

const AnimatedRow = posed.div({
  enter: {
    opacity: 1,
    delay: 300,
    transition: {
      duration: 300,
      ease: [0, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 250,
      ease: [0.4, 0, 1, 1]
    }
  }
});

const StyledAnimatedRow = styled(AnimatedRow)`
  min-height: 100vh;
  padding-bottom: 5rem;
  background: ${(props: ContainerProps) => props.color};
`;

type NearbyStopsProps = {
  loading: boolean;
  data: { nearest: {} };
  departures: object[];
  color?: string;
};

class NearbyStops extends React.Component<NearbyStopsProps, {}> {
  state = {
    key: 'unique'
  };

  shouldComponentUpdate(nextProps: NearbyStopsProps) {
    return nextProps.data.nearest !== this.props.data.nearest;
  }

  componentDidUpdate(prevProps: NearbyStopsProps) {
    if (prevProps.data.nearest !== this.props.data.nearest) {
      this.setState({
        key: new Date().getTime()
      });
    }
  }

  render() {
    const { departures, color } = this.props;
    const { key } = this.state;

    return (
      <Container>
        <PoseGroup animateOnMount={true} flipMove={false}>
          <StyledAnimatedRow key={key} color={color}>
            {departures}
          </StyledAnimatedRow>
        </PoseGroup>
      </Container>
    );
  }
}

export default NearbyStops;
