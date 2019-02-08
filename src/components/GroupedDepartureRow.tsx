import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';

import * as R from 'ramda';

import DepartureRow from './DepartureRow';

import { Node } from '../types';

import { useIntersection } from '../utils/hooks';

const Container = styled.div`
  position: relative;
`;

const Group: AnyStyledComponent = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behaviour: smooth;
  position: relative;
  -webkit-overfow-scrolling: touch;

  ::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex: 1 0 100%;
    scroll-snap-align: start;
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

const getTime = ({ serviceDay, realtimeDeparture }: any) =>
  serviceDay + realtimeDeparture;

const distanceDepartureSort = R.sortWith([
  R.ascend(R.path(['node', 'distance'])),
  R.ascend(
    R.pipe(
      R.path(['node', 'place', 'stoptimes', 0]),
      getTime
    )
  )
]);

type Props = {
  nodes: Array<{ node: Node }>;
};

const GroupedDepartureRow: React.FunctionComponent<Props> = ({ nodes }) => {
  const [{ node: firstNode }, { node: secondNode }] = nodes;
  const firstNodeRef = useRef<HTMLElement>(null);
  const secondNodeRef = useRef<HTMLElement>(null);
  const pageRefs = [firstNodeRef, secondNodeRef];

  const [entries, containerRef] = useIntersection(pageRefs, { threshold: 0.6 });

  useLayoutEffect(() => {
    const activeIndex = R.pipe(
      distanceDepartureSort,
      R.pathOr(0, [0, 'node', 'place', 'pattern', 'directionId'])
    )(nodes);

    if (activeIndex && containerRef && containerRef.current) {
      containerRef.current.scrollLeft = 9999;
    }
  }, []);

  const activeEntry = R.ifElse(
    ({ length }) => length > 1,
    R.find(R.propEq('isIntersecting', true)),
    R.prop('0')
  )(entries);

  const activeIndex = R.findIndex<React.RefObject<HTMLElement>>(
    R.propEq('current', R.propOr(null, 'target', activeEntry)),
    pageRefs
  );

  return (
    <Container>
      <PageIndicatorList>
        {R.addIndex<{}, any>(R.map)((node, key) => (
          <PageIndicator key={key} active={key === activeIndex} />
        ))(nodes)}
      </PageIndicatorList>
      <Group ref={containerRef}>
        <DepartureRow
          stop={firstNode.place}
          distance={firstNode.distance}
          ref={firstNodeRef}
        />
        <DepartureRow
          stop={secondNode.place}
          distance={secondNode.distance}
          ref={secondNodeRef}
        />
      </Group>
    </Container>
  );
};

export default GroupedDepartureRow;
