import * as badgeService from "../services/badge";

export default {
  namespace: "badge",
  state: {
    badges: [],
    badgesMeta: {}
  },
  reducers: {
    storeAllBadges(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *createBadge({ payload }, { call, put }) {
      const { data, errors } = yield call(badgeService.createBadge, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("createBadge ==> ", data);
      }
    },
    *updateBadge({ payload }, { call, put }) {
      const { data, errors } = yield call(badgeService.updateBadge, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("updateBadge ==> ", data);
      }
    },
    *deleteBadge({ payload }, { call, put }) {
      const { data, errors } = yield call(badgeService.deleteBadge, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("deleteBadge ==> ", data);
      }
    },
    *getAllBadges({ payload }, { call, put }) {
      console.log("getAllBadges...payload: ", payload);
      const { data, errors } = yield call(badgeService.getAllBadges, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("getAllBadges ==>  ", data);
        const badges = data.me.badge.getAllBadge.data;
        const badgesMeta = data.me.badge.getAllBadge.meta;
        yield put({
          type: "storeAllBadges",
          payload: { badges, badgesMeta }
        });
      }
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === "/badge/new" && location.query) {
          localStorage.setItem("isEditBadge", "true");
        }else if(location.pathname === "/badge/new" && !location.query) {
          localStorage.setItem("isEditBadge", "false");
        }
      });
    },
  }
};
