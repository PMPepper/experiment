import React from 'react';
import {compose} from 'recompose';

import styles from './styles.scss';

import * as EntityRenderers from './entityRenderers';

import WindowSizeComponent from '@/HOCs/WindowSizeComponent';

import reduce from '@/helpers/object/reduce';


class SystemMap extends React.Component {

  render() {
    const props = this.props;
    const {windowSize, entities, zoom} = props;

    const renderableEntities = reduce(entities, (output, entity) => {
      if(entity.render) {
        output.push(entity);
      }

      return output
    }, [])//[];//server.getEntitiesByIds(server.getCachedEntities('renderable'))

    return <svg className={styles.systemMap}>
      {renderableEntities.map(entity => {
        const Renderer = EntityRenderers[entity.render.type];

        return Renderer && <Renderer {...props} entity={entity} key={entity.id} />;
      })}
    </svg>
  }

  static defaultProps = {
    zoom: 1/1000000000,
    x: 0,
    y: 0,
  };
}


export default compose(
  WindowSizeComponent()
)(SystemMap);




/*
<canvas className={styles.systemMap} {...windowSize} ref={(ref) => {
  if(ref) {
    const ctx = ref.getContext('2d');

    ctx.fillStyle = 'rgb(0, 0, 20)';
    ctx.fillRect(0, 0, windowSize.width, windowSize.height);

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(400, 100, 50, 50);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(430, 130, 50, 50);
  }
}}></canvas>
*/
