import React from 'react';
import * as PIXI from 'pixi.js'

import * as EntityRenderers from './pixiEntityRenderers';
import colorParse from 'color-parse';
import rgb from 'color-space/rgb';
import hsl from 'color-space/hsl';

//Helpers
import reduce from '@/helpers/object/reduce';
import map from '@/helpers/object/map';
import formatDistanceSI from '@/helpers/string/format-distance-si';
import getStyleBySelector from '@/helpers/dom/get-style-by-selector';

//Consts
import {
  systemBodyTypeMinRadius
} from './GameConsts';


//The component
export default class SystemMapPixiRenderer extends React.Component {

  constructor(props) {
    super(props);

    this._systemBodyStyles = getSystemBodyStyles(props.styles);
  }

  _getRef = (ref) => {
    this._ref = ref;



    // Create our application instance
    var app = this._app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x2c3e50,
        antialias: true,
    });

    ref.appendChild(app.view);

    // Load the bunny texture
    app.loader
      .add('bg', 'images/bg.png')
      .load(this._onAssetsLoaded);
  }

  _onAssetsLoaded = () => {
    const app = this._app;

    var background = this._background = new PIXI.TilingSprite(
      app.loader.resources.bg.texture,
      app.renderer.width,
      app.renderer.height
    );

    app.stage.addChild(background);

    const graphics = this._graphics = new PIXI.Graphics();

    app.stage.addChild(this._graphics);

    this._renderProps = {
      app,
      background,
      graphics,
      children: {},
      usedChildren: {}
    };

    // Listen for animate update
    // app.ticker.add(function(delta) {
    //   //Called each tick of the renderer
    // });
  }

  render() {
    const {windowSize, entities, renderEntities, colonies, styles, x, y, zoom, options, elementProps} = this.props;

    const scaleLength = 288;

    if(this._app) {
      this._app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    if(this._background) {
      this._background.width = window.innerWidth;
      this._background.height = window.innerHeight;

      this._graphics.clear();

      renderEntities.forEach(entity => {
        const renderer = EntityRenderers[entity.render.type];

        renderer && renderer(this._renderProps, windowSize, x, y, zoom, entity, entities, colonies, options, this._systemBodyStyles);
      });

      //tidy up unused children
      const {children, usedChildren} = this._renderProps;
      const stage = this._app.stage;

      for(let keys = Object.keys(children), l = keys.length, i = 0; i < l; i++) {
        const key = keys[i];

        if(!usedChildren[key]) {
          //this child is no longer used, so remove and destroy it
          const child = children[key];

          stage.removeChild(child);
          child.destroy();

          delete children[key];
        } else {
          delete usedChildren[key];//empty usedChildren as we go
        }
      }

      //TODO render scale
    }

    return <div
        className={styles.systemMapWrapper}
        {...elementProps}
      >
        <div className={styles.systemMap} ref={this._getRef}></div>
      </div>
  }
}

//Orbit
// stroke: #FFF;
// stroke-width: 1px;
// stroke-opacity: 0.25;
// fill: none;

// .colonyHighlight {
//   stroke: #3D3;
//   stroke-width: 1.5px;
//   fill: none;
// }

// .systemBodyLabel {
//   fill: #FFF;
//   font: normal 12px sans-serif;
//   text-anchor: middle;
// }

// systemBody {
//   &.star {
//     fill: #FDFF00;
//   }


function getSystemBodyStyles(styles) {
  const orbitStyle = getStyleBySelector(`.${styles.orbit}`);
  const systemBodyStyle = getStyleBySelector(`.${styles.systemBody}`);
  const systemBodyLabelStyle = getStyleBySelector(`.${styles.systemBodyLabel}`);
  const colonyHighlightStyle = getStyleBySelector(`.${styles.colonyHighlight}`);

  //Parse stylesheet to get body styles
  const systemBodyStyles = map(systemBodyTypeMinRadius, (radius, systemBodyType) => {
    //
    const orbitTypeStyle = getStyleBySelector(`.${styles.orbit}.${styles[systemBodyType]}`);
    const systemBodyTypeStyle = getStyleBySelector(`.${styles.systemBody}.${styles[systemBodyType]}`);
    const systemBodyLabelTypeStyle = getStyleBySelector(`.${styles.systemBodyLabel}.${styles[systemBodyType]}`);
    const colonyHighlightTypeStyle = getStyleBySelector(`.${styles.colonyHighlight}.${styles[systemBodyType]}`);

    return {
      body: {
        fill: colorParseOrNull(getProp('fill', systemBodyTypeStyle, systemBodyStyle)),
        stroke: colorParseOrNull(getProp('stroke', systemBodyTypeStyle, systemBodyStyle)),
        strokeWidth: parseFloatOr(getProp('strokeWidth', systemBodyTypeStyle, systemBodyStyle)),
        strokeOpacity: parseFloatOr(getProp('strokeOpacity', systemBodyTypeStyle, systemBodyStyle), 1),
      },
      orbit: {
        fill: colorParseOrNull(getProp('fill', orbitTypeStyle, orbitStyle)),
        stroke: colorParseOrNull(getProp('stroke', orbitTypeStyle, orbitStyle)),
        strokeWidth: parseFloatOr(getProp('strokeWidth', orbitTypeStyle, orbitStyle)),
        strokeOpacity: parseFloatOr(getProp('strokeOpacity', orbitTypeStyle, orbitStyle), 1),
      },
      label: getTextStyle({
        // fontFamily: 'Arial',
        // fontSize: 36,
        // fontStyle: 'italic',
        // fontWeight: 'bold',
        // fill: ['#ffffff', '#00ff99'], // gradient
        // stroke: '#4a1850',
        // strokeThickness: 5,
        // dropShadow: true,
        // dropShadowColor: '#000000',
        // dropShadowBlur: 4,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
        // wordWrap: true,
        // wordWrapWidth: 440,
        fill: colorParseOrNull(getProp('fill', systemBodyLabelTypeStyle, systemBodyLabelStyle)),
        fontSize: getProp('fontSize', systemBodyLabelTypeStyle, systemBodyLabelStyle),
        fontFamily: getProp('fontFamily', systemBodyLabelTypeStyle, systemBodyLabelStyle),
        fontStyle: getProp('fontStyle', systemBodyLabelTypeStyle, systemBodyLabelStyle),
        fontVariant: getProp('fontVariant', systemBodyLabelTypeStyle, systemBodyLabelStyle),
        fontWeight: getProp('fontWeight', systemBodyLabelTypeStyle, systemBodyLabelStyle),

        stroke: colorParseOrNull(getProp('stroke', systemBodyLabelTypeStyle, systemBodyLabelStyle)),
        strokeWidth: parseFloatOr(getProp('strokeWidth', systemBodyLabelTypeStyle, systemBodyLabelStyle)),
        strokeOpacity: parseFloatOr(getProp('strokeOpacity', systemBodyLabelTypeStyle, systemBodyLabelStyle), 1),

        //TODO dropshadow
      }),
      highlight: {
        fill: colorParseOrNull(getProp('fill', colonyHighlightTypeStyle, colonyHighlightStyle)),
        stroke: colorParseOrNull(getProp('stroke', colonyHighlightTypeStyle, colonyHighlightStyle)),
        strokeWidth: parseFloatOr(getProp('strokeWidth', colonyHighlightTypeStyle, colonyHighlightStyle)),
        strokeOpacity: parseFloatOr(getProp('strokeOpacity', colonyHighlightTypeStyle, colonyHighlightStyle), 1),
      }
    };
  });

  return systemBodyStyles;
}

function getTextStyle(styles) {
  return new PIXI.TextStyle({
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontStyle: styles.fontStyle,
    fontVariant: styles.fontVariant,
    fontWeight: styles.fontWeight,
    fill: intToRGB(styles.fill[0]),

    //hard coded, because I can't be bothered to work out how to conver css drop shadows into pixi.js
    dropShadow: false,

    stroke: '#000000',
    strokeThickness: 2,

  });
}

function parseFloatOr(float, or = null) {
  if(float === null || float === undefined) {
    return or;
  }

  return parseFloat(float);
}

function colorParseOrNull(color) {
  if(color) {
    const result = colorParse(color);

    if(result && result.space) {
      switch(result.space) {
        case 'rgb':
          return [rgbToInt(result.values), result.alpha];
        case 'hsl':
          return [rgbToInt(hsl.rgb(result.values)), result.alpha];
        default:
          return null;
      }
    }
  }

  return null;
}

function rgbToInt(values) {
  return (values[0] << 16) + (values[1] << 8) + (values[2]);
}

function intToRGB(color) {
  return "#"+((color)>>>0).toString(16).slice(-6);
}

function getProp(prop, ...args) {
  for(let i = 0; i < args.length; i++) {
    if(args[i] && args[i][prop]) {
      return args[i][prop];
    }
  }

  return null;
}
