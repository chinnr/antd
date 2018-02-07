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
      const {data, errors} = yield call(teamService.createTeam, payload)
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("createTeam==>", data);
        return data;
      }
    },

    *addrInfo({payload}, {call, put}) {
      console.log("addrInfo...payload ", payload);
      const {data, errors} = yield call(teamService.addrInfo, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("addrInfo...", data.data);
        return data;
      }
      // yield put({
      //   type: 'storeAddressInfo',
      //   payload: data.data
      // })
    }
  }
}
