import * as mallService from '../services/mall';

export default {
  namespace: 'mall',
  state: {
  	goodsType: [],
    goodsList: [],
    count: 0,
    limit: 0,
    page: 0
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getGoodsType({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsType);
      if(errors) {
        throw new Error(errors);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            goodsType: data.me.goodsType.getGoodsTypes.data,
            count: data.me.goodsType.getGoodsTypes.meta.count,
            limit: data.me.goodsType.getGoodsTypes.meta.limit,
            page: data.me.goodsType.getGoodsTypes.meta.page
          }
        })
      }
    },
    *getGoodsList({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsList);
      if(errors) {
        throw new Error(errors);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            goodsList: data.me.goods.getAll.data,
            count: data.me.goods.getAll.meta.count,
            limit: data.me.goods.getAll.meta.limit,
            page: data.me.goods.getAll.meta.page
          }
        })
      }
    }
  },
  subscriptions: {
  	setup({ dispatch, history }) {
  		history.listen(({ pathname }) => {
        if(pathname === '/mall/goods-type') {
          dispatch({type: 'getGoodsType'})
        }
        if(pathname === '/mall/goods-list') {
          dispatch({type: 'getGoodsList'})
        }
      })
  	}
  }
}
