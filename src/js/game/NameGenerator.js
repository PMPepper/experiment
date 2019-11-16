
//This class is for creating names for entities. Needs a lot of work, basically just a placeholder for now

export default class NameGenerator {
  n = 1;

  constructor() {
    
  }

  getEntityName(entity) {
    switch(entity.type) {
      case 'shipyard':
        return `Shipyard #${this.n++}`

      default:
        return `${entity.type} #${this.n++}`
    }
  }
}
