import * as statisticsService from "../services/statistics";

export default {
  namespace: "statistics",
  state: {
    statistics: []
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *getStatics({ payload }, { call, put }) {
      console.log("getStatics modal ", payload)
      const {data, errors} = yield call(statisticsService.getStatics, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err);
      }else {
        console.log("getStatics ---> ", data);
        const statistics = data.me.virtualGoods.generateExcelData
        yield put({
          type: 'updateState',
          payload: {statistics}
        })
      }
    }
  },
  subscriptions: {
    /*setup ({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === "/statistics/detail") {
          dispatch({
            type: 'getStatics',
            payload: {
              "form": {
                "startTime": "2017/01/01",
                "endTime": "2020/12/31"
              }
            }
          })
        }
      });
    },*/
  }
}
