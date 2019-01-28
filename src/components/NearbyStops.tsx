import React from 'react';

import posed, { PoseGroup } from 'react-pose';

import styled from 'styled-components';

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

type NearbyStopsProps = {
  loading: boolean;
  data: { nearest: {} };
  departures: object[];
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
    const { departures } = this.props;
    const { key } = this.state;

    return (
      <PoseGroup animateOnMount={true} flipMove={false}>
        <AnimatedRow key={key}>{departures}</AnimatedRow>
      </PoseGroup>
    );
  }
}

export default NearbyStops;
