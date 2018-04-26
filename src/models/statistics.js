import * as statisticsService from "../services/statistics";
import {rootUrl} from '../utils/constant';
export default {
  namespace: "statistics",
  state: {
    statistics: []
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *getStatics({ payload }, { call, put }) {
      console.log("*getStatics的参数payload：", payload);
      const { data, errors } = yield call(
        statisticsService.getStatics,
        payload
      );
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        const statistics = data.me.virtualGoods.generateExcel;
        console.log("请求成功后的data ---> ", statistics);
        window.open(
          rootUrl+`/download/young/mall/${statistics}.xlsx`
        );
      }
    },
    *getExcel({payload},{call}){
      console.log("type:      ",payload);
      const { data, errors } = yield call(statisticsService[payload],{});
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        let statistics ;
        if(data.me.usersDownLoad)
          statistics = data.me.usersDownLoad;
        else
          statistics = data.me.groupsDownLoad;
        console.log("请求成功后的data ---> ", statistics);
        window.open(
          rootUrl+`/download/young/${statistics}.xlsx`
        );
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
};
