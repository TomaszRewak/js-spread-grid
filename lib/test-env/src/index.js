import React from 'react';
import ReactDOM from 'react-dom/client';
import { componentFactories } from './src/test-utils/puppeteerTesting';

require(process.env.REACT_APP_FILE_NAME);

const testName = new URLSearchParams(window.location.search).get('testName');
const root = ReactDOM.createRoot(document.getElementById('root'));

const app = testName
  ? componentFactories[testName]()
  : <div className='ready' />;

root.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>
);