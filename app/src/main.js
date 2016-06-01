/**
 * @module Main module
 * @file demo file with default hops app
 * @summary hops demo app
 * @description 
 *   Very simple example app for hops.
 *   The app folder acts as template root for new hops apps
 * @name src/main
 * @exports Home
 * @exports select
 * @exports update
 * @exports routes
 * @exports render
 * @author Daniel Dembach <daniel@dmbch.net>
 * @author Gregor Adams <greg@pixelass.com>
 */


import React, { createClass, PropTypes } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import { render, register } from 'hops';

import { headline } from './style.css';

/**
 * @const select
 * @const update
 */
export const { select, update } = register('home');

/**
 * simple hello hops
 * @const Home
 */
export const Home = connect(select, { update })(
  // create a React class with display name and propTypes
  createClass({
    displayName: 'Home',
    propTypes: {
      greeting: PropTypes.string,
      update: PropTypes.func
    },
    /**
     * @summary React.js internal method
     * @description 
     *    method is executed when component has been mounted
     *    when mounted set the greeting to "Hello World"
     *    uses redux's immutability helpers
     * @method Home/componentDidMount
     * @name componentDidMount
     * @alias Home/componentDidMount
     * @private
     */
    componentDidMount() {
      this.props.update({ greeting: {'$set': 'Hello World!'}});
    },
    /**
     * render the view
     * @method render
     * @private
     * @return {HTMLElement}         returns an h1 with the headline styles.
     *                               the geeting is internaly set when the component
     *                               is mounted {@link module:src/main~componentDidMount}
     */
    render() {
      return (
        <h1 className={ headline }>{ this.props.greeting }</h1>
      );
    }
  })
);


/**
 * route export
 * @const routes
 */
export const routes = (
  <Route path='/' component={ Home }/>
);


export default render({ routes });
