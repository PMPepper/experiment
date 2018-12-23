import {Component} from 'react';

export default function isReactComponent(obj) {
  return (typeof(obj) === 'string') || (obj instanceof Function) || (obj instanceof Component);
}
