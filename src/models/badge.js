import * as badgeService from '../services/badge';

export default {
  namespace: 'badge',
  state: {
    badges: [],
    badgesMeta: {}
  },
  reducers: {
    storeAllBadges(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *createBadge({payload}, {call, put}) {
      const {data, errors} = yield call(badgeService.createBadge, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("createBadge ==> ", data);
      }
    },
    *getAllBadges({payload}, {call, put}) {
      console.log("getAllBadges...payload: ", payload);
      const {data, errors} = yield call(badgeService.getAllBadges, payload)
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        const badges = data.me.badge.getAllBadge.data;
        const badgesMeta = data.me.badge.getAllBadge.meta;
        yield put({
          type: "storeAllBadges",
          payload: {badges, badgesMeta}
        })
      }
    },
  }
}
