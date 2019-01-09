import React from 'react';

import * as EntityRenderers from './svgEntityRenderers';

//Helpers
import reduce from '@/helpers/object/reduce';


//The component
export default function SystemMapSVGRenderer(props) {
  const {windowSize, entities, renderEntities, styles, x, y, zoom, options, elementProps} = props;



  return <div
      className={styles.systemMapWrapper}
      {...elementProps}
    >
      <svg className={styles.systemMap}>
        {renderEntities.map(entity => {
          const Renderer = EntityRenderers[entity.render.type];

          return Renderer && <Renderer windowSize={windowSize} x={x} y={y} zoom={zoom} entity={entity} entities={entities} key={entity.id} options={options} styles={styles} />;
        })}
      </svg>
    </div>
}



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

/*
<filter id="textShadow" height="130%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="1"/> <!-- stdDeviation is how much to blur -->
  {/*<feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
  <feComponentTransfer>
    <feFuncA type="linear" slope="1"/> <!-- slope is the opacity of the shadow -->
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/> <!-- this contains the offset blurred image -->
    <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
  </feMerge>
</filter>
*/
