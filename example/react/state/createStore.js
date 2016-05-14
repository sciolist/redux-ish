import { combine, middleware } from 'redux-ish';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import auth from './auth.js';

export default function create() {
  let reducer = combineReducers(combine([
    auth
  ]));
  
  let plugins = [applyMiddleware(middleware)];
  if (window.devToolsExtension) {
    plugins.push(window.devToolsExtension());
  }
  
  return compose(...plugins)(createStore)(reducer);
}

import './test';