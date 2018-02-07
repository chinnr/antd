import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import {notification} from "antd";

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    notification['error']({
      message: '错误警告',
      description: e.message,
    });
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');


FastClick.attach(document.body);

export default app._store;  // eslint-disable-line
