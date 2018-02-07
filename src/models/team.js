import * as teamService from '../services/team';

export default {
  namespace: 'team',
  state: {
    addressInfo: {}
  },
  reducers: {
    storeAddressInfo(state, {payload}) {
      console.log("storeAddressInfo: ", payload);
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *createTeam({payload}, {call, put}) {
      console.log("createTeam...payload ", payload);
      const data = yield call(teamService.createTeam, payload)
      console.log("createTeam==>", data);
    },

    *addrInfo({payload}, {call, put}) {
      console.log("addrInfo...payload ", payload);
      const data = yield call(teamService.addrInfo, payload);
      return data.data;
      console.log("addrInfo...", data.data);
      // yield put({
      //   type: 'storeAddressInfo',
      //   payload: data.data
      // })
    }
  }
}
