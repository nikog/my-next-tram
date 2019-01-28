import React, { useEffect, useRef, useState } from 'react';
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

type GroupedDepartureRowProps = {
  nodes: Array<{ node: Node }>;
};

const GroupedDepartureRow: React.SFC<GroupedDepartureRowProps> = ({
  nodes
}) => {
  const [{ node: firstNode }, { node: secondNode }] = nodes;
  const firstNodeRef = useRef<HTMLElement>(null);
  const secondNodeRef = useRef<HTMLElement>(null);

  const [entries, containerRef] = useIntersection(
    [firstNodeRef, secondNodeRef],
    {
      threshold: 0.5
    }
  );

  return (
    <Container>
      <PageIndicatorList>
        {R.addIndex<{}, any>(R.map)((node, key) => {
          const entry = entries[key];

          return (
            <PageIndicator
              key={key}
              active={entry ? entry.isIntersecting : false}
            />
          );
        })(nodes)}
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
