import {notification, message} from "antd";
import * as teamService from '../services/team';

export default {
  namespace: 'team',
  state: {
    addressInfo: {},
    teams: [],
    teamsMeta: {},
    loading: true,
  },
  reducers: {
    storeAddressInfo(state, {payload}) {
      console.log("storeAddressInfo: ", payload);
      return {
        ...state,
        ...payload
      }
    },
    storeAllTeams(state, {payload}) {
      console.log("storeAllTeams: ", payload);
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *createTeam({payload}, {call, put}) {
      console.log("createTeam...payload: ", payload);
      const {data, errors} = yield call(teamService.createTeam, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err);
      }else {
        console.log("createTeam==>", data);
        notification['success']({
          message: '新建团成功',
        });
      }
    },

    *updateTeam({payload}, {call, put}) {
      console.log("updateTeam...payload==>: ", payload);
      const {data, errors} = yield call(teamService.updateTeam, payload);
      if(errors) {
        message.destroy();
        const err = errors[0].message;
        throw new Error(err);
      }else {
        console.log("updateTeam==>", data);
        notification['success']({
          message: '修改团信息成功',
        });
      }
    },

    *getAllTeams({payload}, {call, put}) {
      console.log("getAllTeams...payload: ", payload);
      const {data, errors} = yield call(teamService.getAllTeams, payload)
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        const teams = data.me.groups.data;
        const teamsMeta = data.me.groups.meta;
        console.log("getAllTeams==>", teams, teamsMeta);
        yield put({
          type: "storeAllTeams",
          payload: {teams, teamsMeta}
        })
      }
    },

    *addrInfo({payload}, {call, put}) {
      console.log("addrInfo...payload ", payload);
      const {data, errors} = yield call(teamService.addrInfo, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("addrInfo...", data);
        return data;
      }
    },

    *locationInfo({payload}, {call, put}) {
      console.log("addrInfo...payload ", payload);
      const {data, errors} = yield call(teamService.locationInfo, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("locationInfo...", data);
        return data;
      }
    },

    *modifyTeamPsw({payload}, {call, put}) {
      console.log("modifyTeamPsw...payload==> ", payload);
      const {data, errors} = yield call(teamService.modifyTeamPsw, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("modifyTeamPsw...", data);
      }
    }
  }
}
