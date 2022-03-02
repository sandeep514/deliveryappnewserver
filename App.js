import * as Sentry from '@sentry/react-native';
import React from 'react';
import Nav from './routes/Nav';
import SplashScreen from 'react-native-splash-screen'

Sentry.init({
  dsn: 'https://ff37d5a526dc466492c466cef6a3dcde@o1147172.ingest.sentry.io/6217087',
});

//Debugger Configuration Start
// To see all the requests in the chrome Dev tools in the network tab.
// XMLHttpRequest = GLOBAL?.originalXMLHttpRequest
//   ? GLOBAL?.originalXMLHttpRequest
//   : GLOBAL?.XMLHttpRequest;

// // fetch logger
// global._fetch = fetch;
// global.fetch = function (uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then(response => {
//     return response;
//   });
// };

//Debugger Configuration End
const App = () => {
  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);
  return <Nav />;
};
export default Sentry.wrap(App);
