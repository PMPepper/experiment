export const INTERACT = 'lastInteraction.interact';


export function interact(id) {
  return {
    id,
    type: INTERACT,
    time: Date.now()
  };
}
