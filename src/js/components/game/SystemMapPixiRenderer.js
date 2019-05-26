import React from 'react';
import * as PIXI from 'pixi.js'

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
  systemBodyTypeMinRadius,
  scaleLength
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

    PIXI.settings.RESOLUTION = window.devicePixelRatio;

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

    const scaleText = this._scaleText = new PIXI.Text('', {
      fill: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeWidth: 2,
      strokeOpacity: 1,
    });

    scaleText.anchor.set(0, 1);
    scaleText.resolution = window.devicePixelRatio;
    scaleText.position.x = 16 + 3;
    scaleText.position.y = app.renderer.height - 16;

    app.stage.addChild(scaleText);

    // Listen for animate update
    // app.ticker.add(function(delta) {
    //   //Called each tick of the renderer
    // });
  }

  _children = {};
  _usedChildren = {};

  render() {
    const {windowSize, renderPrimitives, styles, x, y, zoom, options, elementProps} = this.props;

    const systemBodyStyles = this._systemBodyStyles;


    if(this._app) {
      this._app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    if(this._background) {
      const stage = this._app.stage;
      const children = this._children;
      const usedChildren = this._usedChildren;

      this._background.width = window.innerWidth;
      this._background.height = window.innerHeight;

      const graphics = this._graphics

      graphics.clear();

      renderPrimitives.forEach(primitive => {
        switch(primitive.t) {
          case 'circle':
            drawCircle(graphics, primitive.x, primitive.y, primitive.r, systemBodyStyles[primitive.subType][primitive.type], primitive.opacity);
            break;
          case 'text':
            //get or create label entity
            const labelName = primitive.id;
            let text = children[labelName];

            if(!text) {
              text = children[labelName] = new PIXI.Text(primitive.text, systemBodyStyles[primitive.subType][primitive.type]);
              text.resolution = window.devicePixelRatio;//1.25;
              text.anchor.set(0.5, 0);

              stage.addChild(text);
            }

            //record that this entity is in use
            usedChildren[labelName] = text;

            //position text
            text.position.x = primitive.x;
            text.position.y = primitive.y;
            text.alpha = primitive.opacity;
            break;
          default:
            debugger;
            break;
        }
      });

      //tidy up unused children
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

      //render scale
      const scalePadding = 16;
      const markLength = 4;

      const leftX = scalePadding + 0.5;
      const bottomY = windowSize.height - scalePadding + 0.5;

      const rightX = leftX + scaleLength;
      const topY = bottomY - markLength;

      graphics.lineStyle(1, 0xFFFFFF, 1);
      graphics.moveTo(leftX, bottomY);
      graphics.lineTo(rightX, bottomY);

      graphics.moveTo(leftX, bottomY);
      graphics.lineTo(leftX, topY);

      graphics.moveTo(rightX, bottomY);
      graphics.lineTo(rightX, topY);

      const scaleText = this._scaleText;

      scaleText.position.y = window.innerHeight - 16;

      scaleText.text = formatDistanceSI(scaleLength / zoom, 1, 3);
    }

    return <div
        className={styles.systemMapWrapper}
        {...elementProps}
      >
        <div className={styles.systemMap} ref={this._getRef}></div>
      </div>
  }
}



function drawCircle(graphics, x, y, r, style, opacity = 1) {
  if(style.strokeWidth) {
    graphics.lineStyle(style.strokeWidth, style.stroke[0], opacity * style.strokeOpacity);
  } else {
    graphics.lineStyle(0);
  }

  if(style.fill) {
    graphics.beginFill(style.fill[0], style.fill[1] * opacity);
  }

  graphics.drawCircle(x, y, r);

  if(style.fill) {
    graphics.endFill();
  }
}


//Init code
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
      systemBody: {
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
      systemBodyLabel: getTextStyle({
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
      colonyHighlight: {
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

    //hard coded, because I can't be bothered to work out how to convert css drop shadows into pixi.js
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
