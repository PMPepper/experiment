import React from 'react';

import {scaleLength} from './GameConsts';

//Helpers
import formatDistanceSI from '@/helpers/string/format-distance-si';


//The component
export default function SystemMapSVGRenderer({windowSize, renderPrimitives, styles, x, y, zoom, options, ...props}) {

  return <div
      className={styles.systemMapWrapper}
      {...props}
    >
      <svg className={styles.systemMap}>
        {renderPrimitives.map(primitive => {
          switch(primitive.t) {
            case 'circle':
              return <circle
                className={`${styles[primitive.type]} ${styles[primitive.subType]}`}
                cx={primitive.x}
                cy={primitive.y}
                r={primitive.r}
                opacity={primitive.opacity}
                key={primitive.id}
              />
            case 'text':
              return <text
                className={`${styles[primitive.type]} ${styles[primitive.subType]}`}
                x={primitive.x}
                y={primitive.y}
                fillOpacity={primitive.opacity}
                key={primitive.id}
              >
                {primitive.text}
              </text>;
            default:
              debugger;//shouldn't happen!
              return null;
          }

        })}
        <g transform={`translate(16, ${windowSize.height - 16})`}>
          <text x="5.5" y="-5.5" fill="#FFF">{formatDistanceSI(scaleLength / zoom, 1, 3)}</text>
          <line x1="0.5" y1="0.5" x2="0.5" y2="-4.5" stroke="#FFF" />
          <line x1="0.5" y1="0.5" x2={scaleLength + 0.5} y2="0.5" stroke="#FFF" />
          <line x1={scaleLength + 0.5} y1="0.5" x2={scaleLength + 0.5} y2="-4.5" stroke="#FFF" />
        </g>
      </svg>
    </div>
}
