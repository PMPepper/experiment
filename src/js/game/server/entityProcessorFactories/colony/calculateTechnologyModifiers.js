import forEach from '@/helpers/object/forEach';

//{research: 1, construction: 1, mining: 1}

export default function calculateTechnologyModifiers(factionTechnologies, allTechnologies) {
  const modifiers = {};

  forEach(factionTechnologies, (hasTech, technologyId) => {
    const technology = allTechnologies[technologyId];

    if(hasTech && technology.modifyCapabilities) {
      forEach(technology.modifyCapabilities, (modifier, capability) => {
        if(!(capability in modifiers)) {
          modifiers[capability] = 1;
        }

        modifiers[capability] += modifier;
      });
    }
  });

  return modifiers;
}
