const REDUCER_KEY = Symbol('Reducer');
const ISH_ACTION = Symbol('ISH_ACTION');
const PREFIX = '@@ish/';

export function combine(ishActions) {
  return ishActions.reduce((val, next) => (
    Object.assign(val, next[REDUCER_KEY])
  ), {});
}

export const middleware = ({ dispatch, getState }) => next => action => {
  if (ISH_ACTION in action) {
    let { type, reduxDispatchType, next } = action;
    let state = (payload, extra) => dispatch({ ...extra, type: reduxDispatchType, payload });
    if (typeof next !== 'function') {
      return state(next);
    }
    state.initial = getState()[type];
    Object.defineProperty(state, 'current', {
      get() { return getState()[type] }
    });
    return next(state, dispatch, getState);
  }
  return next(action);
};

export default function createActions(name, config, stateCreator) {
  if (arguments.length === 2) {
    stateCreator = config;
    config = {};
  }

  const reduxDispatchType = config.dispatchType || PREFIX + name;
  const reducer = (state, action) => {
    if (action.type === PREFIX + name) return action.payload;
    if (state === null || state === undefined) {
      return config.initialState || {};
    }
    return state;
  };

  let functions = {
    KEY: reduxDispatchType,
    [REDUCER_KEY]: { [name]: reducer }
  };

  Object.keys(stateCreator).forEach(function (key) {
    let wrappedValue = stateCreator[key];
    if (typeof wrappedValue === 'function') {
      wrappedValue = wrapActionCall(name, reduxDispatchType, wrappedValue);
    }
    functions[key] = wrappedValue;
  });
  return functions;
}

function wrapActionCall(type, reduxDispatchType, inner) {
  return (...args) => ({ [ISH_ACTION]: true, reduxDispatchType, type, next: inner(...args) });
}

