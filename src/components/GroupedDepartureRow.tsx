import React, { useRef, useLayoutEffect, createRef } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';

import * as R from 'ramda';

import DepartureRow from './DepartureRow';

import useIntersection from '../utils/useIntersection';
import { NearbyStops_nearest_edges } from '../types/NearbyStops';
import { getColor } from '../utils/colors';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.color};

  &:last-child {
    padding-bottom: 5rem;

    // @supports (padding: max(0px)) {
    //   padding-bottom: max(5rem, calc(env(safe-area-inset-bottom) + 4rem));
    // }
  }
`;

const Group: AnyStyledComponent = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behaviour: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex: 1 0 100%;
    scroll-snap-align: start;
    overflow: visible;
  }
`;

const PageIndicatorList = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  height: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  top: 0;
`;

type PageIndicatorProps = {
  active: boolean;
};

const PageIndicator = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: white;

  opacity: ${(props: PageIndicatorProps) => (props.active ? 1 : 0.2)}

  :not(:first-child) {
    margin-left: 0.25rem;
  }
`;

const nearestNodeDirectionId = R.pipe(
  R.sortBy(R.pathOr(0, ['node', 'distance'])),
  R.pathOr(0, [0, 'node', 'place', 'pattern', 'directionId'])
);

type Props = {
  nodes: NearbyStops_nearest_edges[];
};

const GroupedDepartureRow: React.FunctionComponent<Props> = ({ nodes }) => {
  const containerRef = useRef<HTMLElement>(null);
  // const pageRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
  const pageRefs = useRef<React.RefObject<HTMLInputElement>[]>(
    nodes.map(() => createRef())
  );

  useLayoutEffect(() => {
    const activeIndex = nearestNodeDirectionId(nodes);

    if (activeIndex && containerRef && containerRef.current) {
      containerRef.current.scrollLeft = 9999;
    }
  }, []);

  const activeIndex = useIntersection(pageRefs.current, containerRef, {
    threshold: 0.5
  });

  const color = R.pipe(
    R.pathOr({}, [0, 'node', 'place', 'pattern', 'route']),
    R.props(['shortName', 'mode']),
    getColor
  )(nodes);

  return (
    <Container color={color}>
      {nodes.length > 1 && (
        <PageIndicatorList>
          {nodes.map((node, key) => (
            <PageIndicator key={key} active={key === activeIndex} />
          ))}
        </PageIndicatorList>
      )}
      <Group ref={containerRef}>
        {nodes.map(
          ({ node }, key) =>
            node && (
              <DepartureRow key={key} data={node} ref={pageRefs.current[key]} />
            )
        )}
      </Group>
    </Container>
  );
};

export default GroupedDepartureRow;

export { Container as GroupedDepartureRowContainer };
