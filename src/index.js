import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { notification } from 'antd';
import { parseError } from './utils/utils';
import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import { createLogger } from 'redux-logger';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    e.preventDefault();
    if (
      e.message === 'rest136|会话已过期' ||
      e.message === 'rest215|token expired' ||
      e.message.toLocaleLowerCase() === 'token is expired' ||
      e.message.toLocaleLowerCase() === 'token expired' ||
      e.message === 'TokenExpiredError: jwt expired'
    ) {
      notification['error']({
        message: '错误警告',
        description: '会话已过期, 请重新登录',
        duration: 2
      });
      setTimeout(function() {
        localStorage.setItem('authority', 'guest');
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        localStorage.removeItem('exp');
        window.location.reload();
      }, 2500);
    } else {
      notification['error']({
        message: '错误警告',
        description: parseError(e.message)
      });
    }
  },
  onAction: createLogger()
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

export default app._store; // eslint-disable-line
