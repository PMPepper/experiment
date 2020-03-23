import React, {useState, useMemo} from 'react';
import {Trans} from '@lingui/macro';
//import exprEval from 'expr-eval'
import {useSelector, shallowEqual} from 'react-redux'

//Components
import Form from '@/components/form/Form';
//import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';
//import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import {useClient} from '@/components/game/Game';

//Helpers
import filter from '@/helpers/object/filter';
import containsAll from '@/helpers/array/contains-all';
//import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
//import sortAlphabeticalOnObjPath from '@/helpers/sorting/sort-alphabetical-on-obj-path';


//The component
export default function WindowShipDesign() {
  const faction = useSelector(state => state.entities.byId[state.factionId]);
  const componentTypes = useSelector(state => state.componentTypes);
  const components = useSelector(state => state.components);

  const factionComponents = useMemo(() => {
    return filter(components, (component) => {
      return (!component.factionId || component.factionId == faction.id) && (!component.requiredTechnologyIds || containsAll(Object.keys(faction.faction.technology), component.requiredTechnologyIds));
    })
  }, [components, faction.faction.technology])

  const i18n = useI18n();
  const client = useClient();


  return <Form onSubmit={e => {
    e.preventDefault();

    alert('TODO create blueprint');
  }}>
    <Form.Row columns={12}>
      Name, type, etc
    </Form.Row>
    <Form.Row columns={12}>
      <Form.Column width={2}>
        Info
      </Form.Column>
      <Form.Column width={8}>
        <p>available components + summary</p>
        <pre>{JSON.stringify(factionComponents, null, 2)}</pre>
      </Form.Column>
      <Form.Column width={2}>
        selected components & issues
      </Form.Column>
    </Form.Row>
    <Form.Row columns={12}>
      Totals, etc
    </Form.Row>


  </Form>
}
