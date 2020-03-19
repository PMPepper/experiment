import React, {useMemo, useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';
import {useSelector} from 'react-redux'

//Components
import Tree from '@/components/tree/Tree';
import Layout, {Row, Cell} from '@/components/layout/Layout';

import ColonyInfo from './ColonyInfo';

//Hooks
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import useActions from '@/hooks/useActions';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import filter from '@/helpers/object/filter';
import reduce from '@/helpers/object/reduce';

//Redux
import {setTab, setSelectedColonyId} from '@/redux/reducers/coloniesWindow';
import {setSelectedSystemId} from '@/redux/reducers/selectedSystemId';
import {setFollowing as setSystemMapFollowing} from '@/redux/reducers/systemMap';

//Consts
const coloniesTreeId = 'colonies';
const actions = {
  setTab,
  setSelectedSystemId,
  setSystemMapFollowing,
  setSelectedColonyId,
};


//The component
export default React.memo(function WindowColonies() {
  const factionId = useSelector(state => state.game.factionId);

  const factionEntityNames = useSelector(state => state.factionEntityNames);
  const colonies = useSelector(state => state.entitiesByType.colony);
  const tab = useSelector(state => state.coloniesWindow.tab);
  const selectedSystemId = useSelector(state => state.selectedSystemId);
  const selectedColonyId = useSelector(state => state.coloniesWindow.selectedColonyId);
  const selectedColony = colonies[selectedColonyId]
  const selectedColonyName = factionEntityNames[selectedColony.systemBodyId]

  const {
    setTab,
    setSelectedSystemId,
    setSystemMapFollowing,
    setSelectedColonyId
  } = useActions(actions);

  const [isNodeOpen, _setIsNodeOpen] = useState(() => {
    return selectedColonyId ? {
      [getColonySystemNodeId(selectedColonyId, colonies)]: true
    } : {}
  });

  const setIsNodeOpen = useCallback((node, isOpen) => {
    return _setIsNodeOpen(isNodeOpen => ({...isNodeOpen, [node]: !!isOpen}));
  }, [_setIsNodeOpen]);

  const [selectedNode] = useState(() => {
    return selectedColonyId ? {
      [getColonyNodeId(selectedColonyId, colonies)]: true
    } : {}
  });

  const colonyTreeNodes = useMemo(() => mapToSortedArray(
    coloniesBySystemBySystemBody(colonies, factionId),
    (coloniesBySystemBodyId, systemId) => {

      return {
        id: systemId,
        label: factionEntityNames[systemId],
        onClick: () => {setSelectedSystemId(systemId)},
        children: mapToSortedArray(
          coloniesBySystemBodyId,
          (colony, systemBodyId) => {
            return {
              id: systemBodyId,
              label: factionEntityNames[systemBodyId],
              onClick: () => {
                setSelectedSystemId(systemId);
                setSystemMapFollowing(systemBodyId);
                setSelectedColonyId(colony.id);
              },
            };
          },
          (a, b) => {
            return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0);
          },
          null,
          true
        )
      };
    },
    (a, b) => {
      return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0);
    },
    null,
    true
  ), [colonies, factionId]);

  return <Layout>
    <Row>
      <Cell large={2} medium={1}>
        <Tree nodes={colonyTreeNodes} id={coloniesTreeId} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} selectedNode={selectedNode} />
      </Cell>
      <Cell large={10} medium={2}>
        <ColonyInfo name={selectedColonyName} colonyId={selectedColonyId} tab={tab} setTab={setTab} />
      </Cell>
    </Row>
  </Layout>;
});

function getColonyNodeId(colonyId, colonies) {
  const colony = colonies[colonyId];

  return `colonies/${colony.systemId}/${colony.systemBodyId}`;
}

function getColonySystemNodeId(colonyId, colonies) {
  const colony = colonies[colonyId];

  return `colonies/${colony.systemId}`;
}

function coloniesBySystemBySystemBody(colonies, factionId) {
  return reduce(colonies, (output, colony) => {
    if(colony.factionId == factionId) {
      if(!output[colony.systemId]) {
        output[colony.systemId] = {}
      }

      output[colony.systemId][colony.systemBodyId] = colony;

      return output
    }
  }, {})
}
