/**
 * @module lib/store
 * @exports createContext
 * @author Daniel Dembach <daniel@dmbch.net>
 * @author Gregor Adams <greg@pixelass.com>
 */


var ReactRouterRedux = require('react-router-redux');
var Redux = require('redux');
var ReduxThunkMiddleware = require('redux-thunk').default;
var update = require('react-addons-update');

function getType(namespace) {
  return 'update' + namespace.replace(
      /(?:^|[\W_]+)(\w)/g,
      function(match, p1) {
        return p1.toUpperCase();
      }
    );
}

function getDevTools() {
  if ('devToolsExtension' in global) {
    return global.devToolsExtension();
  } else {
    return function(f) {
      return f;
    };
  }
}

function createReducer(namespace) {
  var type = getType(namespace);
  return function(state, action) {
    if (action && action.type === type) {
      return update(state, action.payload);
    }
    return state || {};
  };
}

/**
 * @typedef {Function} module:lib/store~createActionCreator
 * @param  {String} namespace name of the namespace
 * @return {Function}         retiurns a function that returns the updated object
 */
function createActionCreator(namespace) {
  var type = getType(namespace);
  return function(payload) {
    return {
      type: type,
      payload: payload
    };
  };
}

/**
 * create a selector around a namespace
 * @type Function
 * @param  {String} namespace - name of the namespace
 * @return {Function}         returns a function to extract the current
 *                            namespace's state from the global state
 */
function createSelector(namespace) {
  /**
   * @type Method
   * @param {Object} state - the global state
   * @return {Object} returns the namespace's state extracted from the global state
   */
  return function(state) {
    return state[namespace];
  };
}

function createStore(reducers, options) {
  var store = Redux.createStore(
    Redux.combineReducers(reducers),
    options.initialState,
    Redux.compose(
      Redux.applyMiddleware(
        ReduxThunkMiddleware,
        ReactRouterRedux.routerMiddleware(options.history)
      ),
      getDevTools()
    )
  );
  return Object.assign(store, {
    history: ReactRouterRedux.syncHistoryWithStore(
      options.history,
      store
    )
  });
}

/**
 * create a context for a reducer
 * @type {Function}
 * @name createContext
 * @namespace createContext
 * @param  {Function} reducers - the reducer function
 * @return {Object}          returns the methods
 */
function createContext(reducers) {
  reducers = reducers || {
    routing: ReactRouterRedux.routerReducer
  };
  var store;
  return {
    /**
     * `register()` is a helper to streamline store/state interactions in hops
     * based projects. If passed only a `namespace` string, a generic reducer
     * using React's [immutability helpers](https://facebook.github.io/react/docs/update.html)
     * is created for that namespace. It's return value is an object containing
     * a selector function for use in ReactRedux' `connect()` and a generic action
     * creator (`update()`) working with the update reducer.
     * @typedef {Function} module:lib/store~register
     * @param  {String} namespace - namespace for the reducer
     * @param  {Function} reducer - the reducer function to register in hops
     * @return {Object|module:lib/store~return}           returns the registration
     */
    register: function(namespace, reducer) {
      reducers[namespace] = reducer || createReducer(namespace);
      if (store) {
        store.replaceReducer(Redux.combineReducers(reducers));
      }
      return {
        update: reducer ? null : createActionCreator(namespace),
        select: createSelector(namespace)
      };
      /**
       * @typedef {Object} module:lib/store~return
       * @property {Object|null} update - allow updating the payload and/or type of reducer
       *                                `null` if reducers exists
       * @property {module:lib/store~createActionCreator} update.type -  allow updating the type of reducer
       * @property {Function} update.payload -  allow updating the payload of reducer
       * @property {createSelector} select - a selector function for the namespace
       */
    },
    getReducers: function() {
      return Object.assign({}, reducers);
    },
    createStore: function(options) {
      return store || (store = createStore(reducers, options));
    },
    createContext: createContext
  };
}

module.exports = createContext();
