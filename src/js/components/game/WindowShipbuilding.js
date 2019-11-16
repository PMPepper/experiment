import React from 'react';


//Components


//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import {useClient} from '@/components/game/Game';


//The component
export default function WindowShipbuilding({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));

  const i18n = useI18n();
  const client = useClient();

  const gameConfig = clientState.initialGameState;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];


  return <div>TODO</div>
}
