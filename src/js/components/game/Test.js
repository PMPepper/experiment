import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from '@lingui/macro';

import Modal from '@/components/modal/Modal';
import AddEditResearchGroup from '@/components/game/AddEditResearchGroup';

export default compose(
  connect(state => {
    return {
      //coloniesWindow: state.coloniesWindow,
      //fleetsWindow: state.fleetsWindow,
      //shipDesignWindow: state.shipDesignWindow,
      clientState: state.game,

      //systemMap: state.systemMap,
      //selectedSystemId: state.selectedSystemId,
    }
  }, {})
)
(function Test({clientState}) {
  const colonyId = 899;//will change if world definition changes
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[colony.factionId];

  return <Modal
    title={<Trans>Create research project</Trans>}
    isOpen={true}
    onRequestClose={() => {}}
  >
    <AddEditResearchGroup
      //key={selectedResearchProject.id}
      //researchProject={selectedResearchProject}
      faction={faction}
      colony={colony}
      gameConfig={clientState.initialGameState}
    />
  </Modal>
})
