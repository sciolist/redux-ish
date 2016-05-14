// @flow
const REDUCER_KEY = '@@ish/Reducer';
const ISH_ACTION = '@@ish/ISH_ACTION';
const PREFIX = '@@ish/';

/*::
type IshReducer = {
  ISH_ACTION: function
};

type IshConfig = {
  initialState?: any,
  dispatchType?: string
}
*/

export default createActions;

export function combine(ishActions /*: IshReducer[]*/) {
  return ishActions.reduce((val, next) => (
    Object.assign(val, next[REDUCER_KEY])
  ), {});
}

export const middleware = (reduxStore /*:Object*/) => (next /*:function*/) => (action /*:Object*/) => {
  if (ISH_ACTION in action) {
    let { dispatch, getState } = reduxStore;
    let { type, reduxDispatchType, next } = action;
    let state = (payload, extra) => dispatch({ ...extra, type: reduxDispatchType, payload });
    if (typeof next !== 'function') {
      return state(next);
    }
    state.initial = getState()[type];
    // $flow-ignore
    Object.defineProperty(state, 'current', {
      get() { return getState()[type] }
    });
    return next(state, dispatch, getState);
  }
  return next(action);
};

function createActions/*::<T : Object>*/(name /*:string*/, stateCreator /*:T*/, actionConfig /*:?IshConfig*/) /*: T*/ {
  let config /*: IshConfig*/ = actionConfig || {};

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

  let fn /*: any*/ = functions;
  return fn;
}

function wrapActionCall(type, reduxDispatchType, inner) {
  return (...args) => ({ [ISH_ACTION]: true, reduxDispatchType, type, next: inner(...args) });
}
