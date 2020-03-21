import React from 'react';
import {useSelector} from 'react-redux'

//Components
import Time from '@/components/time/Time';

export default function GameTime() {
  const gameTimeDate = useSelector(state => state.gameTime) * 1000;

  return <Time value={new Date(gameTimeDate)} format="datetime" />
}
