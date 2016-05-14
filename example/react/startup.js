import React from 'react';
import { render } from 'react-dom';
import { Provider, combineReducers } from 'react-redux';

import LoginPage from './components/loginpage.jsx';
import createStore from './state/createStore';

render(
  <Provider store={createStore()}>
    <LoginPage />
  </Provider>
, document.getElementById('app'));
