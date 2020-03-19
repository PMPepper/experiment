import React from 'react';
import {useSelector} from 'react-redux'

//Components
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks



export default function WindowColonySummary({colonyId}) {
  const colony = useSelector(state => state.game.entities[colonyId]);

  return <div>
    <p>Total population: <FormatNumber value={colony.colony.totalPopulation} /></p>
    <p>Total support overhead: <FormatNumber value={colony.colony.totalSupportWorkers} /></p>
    <p>Total effective workers: <FormatNumber value={colony.colony.totalEffectiveWorkers} /></p>
  </div>
}
