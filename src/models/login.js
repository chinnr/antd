import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import * as loginService from '../services/login';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { data, errors } = yield call(loginService.login, payload);

      if (errors) {
        console.log("login errors: ", errors);
        const err = errors[0].message.split("|")[1];
        throw new Error(err);
      } else {
        if (data.login.token) {
          console.log("login response: ", data);
          localStorage.setItem('exp', data.login.exp);
          localStorage.setItem('token', data.login.token);
          data["currentAuthority"] = "admin";
          data["status"] = "ok";
          yield put({
            type: 'changeLoginStatus',
            payload: data,
          });
          yield put(routerRedux.push('/dashboard/analysis'));
          window.location.reload();
        }
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      yield put(routerRedux.push('/user/login'));
      window.location.reload();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log("changeLoginStatus ==>", payload);
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
