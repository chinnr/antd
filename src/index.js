import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import {notification} from "antd";
import {parseError} from './utils/utils';
import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './rollbar';

import './index.less';
import {routerRedux} from "dva/router";
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    e.preventDefault();
    console.log("错误警告==>", e.message);
    if( e.message === "rest136|会话已过期") {
      notification['error']({
        message: '错误警告',
        description: "会话已过期, 请重新登录",
        duration: 2
      });
      setTimeout(function () {
        localStorage.setItem('authority', 'guest');
        window.location.reload();
      },2500)
    }else {
      notification['error']({
        message: '错误警告',
        description: parseError(e.message),
      });
    }
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
