//TODO handle not having muminum technology requirements

import React, {useState, useMemo} from 'react';
import {Trans} from '@lingui/macro';
import exprEval from 'expr-eval'
import {useSelector} from 'react-redux'

//Components
import Form from '@/components/form/Form';
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import {useClient} from '@/components/game/Game';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import sortAlphabeticalOnObjPath from '@/helpers/sorting/sort-alphabetical-on-obj-path';

//Consts
const componentProperties = [
  'rp', 'bp', 'mass', 'hitpoints', 'crew', 'explosionChance',
  //engines
  'thermal', 'thrust', 'fuelConsumption', 'fuelConsumptionPerETH'
];//minerals are special/handled separately

const parser = new exprEval.Parser();


//The component
export default function TechnologyDesignWindow(props) {
  const faction = useSelector(state => state.entities.byId[state.factionId]);
  const componentTypes = useSelector(state => state.componentTypes);

  const i18n = useI18n();
  const client = useClient();

  const componentTypeOptions = useMemo(() => mapToSortedArray(
    componentTypes,
    (componentType, componentTypeId) => ({label: componentType.name, value: componentTypeId}),//map func
    sortAlphabeticalOnObjPath('label', i18n.language),//sort function
    null,
    true//sort on mapped
  ), [componentTypes, i18n.language]);

  //local state
  const [selectedComponentType, setSelectedComponentType] = useState(componentTypeOptions[0].value);
  const [componentName, setComponentName] = useState('');
  const selectedComponent = componentTypes[selectedComponentType];

  const [componentOptions, setComponentOptions] = useState(() => getComponentDefaults(selectedComponent, faction));

  return <div>
    <Form>
      <Form.Row columns={12}>
        <Form.Field inline width={12} columns={12}>
          <Form.Label width={4}><Trans>Component type</Trans></Form.Label>
          <Form.Select
            width={8}
            options={componentTypeOptions}
            value={selectedComponentType}
            setValue={(newValue) => {
              setSelectedComponentType(newValue);
              setComponentOptions(getComponentDefaults(componentTypes[newValue], faction));//TODO initial/default values
            }}
          />
        </Form.Field>
      </Form.Row>
      <Form.Group>
        <Form.Legend>
          <Trans>Technologies</Trans>
        </Form.Legend>
        {selectedComponent.options.map(option => {
          return <Form.Row columns={12} key={option.id}>
            <Form.Field inline width={12} columns={12}>
              <Form.Label width={4}>{option.name}</Form.Label>
              <Form.Select
                width={8}
                options={filterAvailableValues(option.values, faction)}
                value={componentOptions[option.id] || ''}
                setValue={(newValue) => {
                  setComponentOptions(currentOptions => ({
                    ...currentOptions,
                    [option.id]: newValue
                  }))
                }}
              />
            </Form.Field>
          </Form.Row>
        })}
      </Form.Group>
      <Form.Group>
        <Form.Legend>
          <Trans>Proposed component parameters</Trans>
        </Form.Legend>
        <Form.Row columns={12}>
          <Form.Field inline width={12} columns={12}>
            <Form.Label width={4}><Trans>Component name</Trans></Form.Label>
            <Form.Input width={8} value={componentName} setValue={setComponentName} />
          </Form.Field>
        </Form.Row>
        <Form.Row columns={12}>
          {componentProperties.map(property => {
            if(!(property in selectedComponent)) {
              return null;
            }
            const expr = parser.parse(selectedComponent[property]);

            const calculatedValue = expr.evaluate(componentOptions);
            const calculatedValueFormatted = <FormatNumber value={calculatedValue} />

            return <Form.Field inline width={6} columns={6} key={property}>
                <Form.Label width={4}>{property}</Form.Label>{/*TODO translate*/}
                <Form.Output width={2}>{calculatedValueFormatted}</Form.Output>
              </Form.Field>
          })}
        </Form.Row>
      </Form.Group>
      <Form.Row columns={12}>
        <Form.Button width={12} onClick={() => {
          client.addComponentProject(componentName, selectedComponentType, componentOptions);
        }}><Trans>Create component project</Trans></Form.Button>
      </Form.Row>
    </Form>
  </div>;
}

function getComponentDefaults(componentType, faction) {
  const defaults = {};

  componentType.options.forEach(option => {
    const available = filterAvailableValues(option.values, faction);

    if('default' in option && available.find(filteredOptionValue => filteredOptionValue.value === option.default)) {
      defaults[option.id] = option.default;
    } else {
      defaults[option.id] = available[0].value
    }
  })

  return defaults;
}

function filterAvailableValues(values, faction) {
  const technology = faction.faction.technology

  return values.filter(value => !value.requireTechnologyIds || value.requireTechnologyIds.every(techId => technology[techId]));
}
