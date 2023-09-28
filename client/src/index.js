import React from 'react';
import { createRoot } from 'react-dom/client';

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import './index.css';
import App from './App';

import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();