import React from 'react';
import { differenceInMinutes, differenceInMilliseconds } from 'date-fns';
import { useState } from 'react';
import { useOnMinuteInterval } from '../utils/hooks';

type Props = {
  departureTime: number;
};

const Counter: React.FunctionComponent<Props> = ({ departureTime }) => {
  const currentTime = Date.now();
  const diffMinutes = differenceInMinutes(departureTime, currentTime);
  const diffMilliseconds = differenceInMilliseconds(departureTime, currentTime);

  const [, toggle] = useState<boolean>(false);

  useOnMinuteInterval(() => toggle(state => !state), diffMilliseconds);

  return <span>{diffMinutes}</span>;
};

export default Counter;
