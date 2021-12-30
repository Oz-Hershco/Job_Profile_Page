import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import store from './Redux/store';
import '@shopify/polaris/build/esm/styles.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <AppProvider i18n={enTranslations}>
    <Provider store={store}>
      <App />
    </Provider>
  </AppProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
