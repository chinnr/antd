import * as mallService from '../services/mall';
import * as badgeService from "../services/badge";

export default {
  namespace: 'mall',
  state: {
  	goodsType: [],
    goodsList: [],
    myVirtualGoods: [],
    count: null,
    limit: null,
    page: null
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    add(state, { payload: goods }) {
      const goodsType = state.goodsType.concat();
      goodsType.unshift(goods);
      return { ...state, goodsType };
    }
  },
  effects: {
    *getGoodsType({ payload: query }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsType, query);
      if(errors) {
        throw new Error(errors[0].message);
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

    *getGoodsList({ payload: v }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsList, v);
      console.log('goods ', data)
      if(errors) {
        throw new Error(errors[0].message);
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
    },

    *getUserVirtualGoods({ payload: uid }, { call, put }) {
      const { data, errors } = yield call(mallService.virtualGoods, { limit: 10 }, { uid })
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            myVirtualGoods: data.me.virtualGoods.getOneUserVirtualGoods.data
          }
        })
      }
    },

    *addGoodsType({ payload: formData }, { call, put }) {
      const { data, errors } = yield call(mallService.addGoodsType, formData);
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'add',
          payload: data.me.goodsType.createGoodsType
        })
      }
    },

    *delGoodsType({ payload }, { call, put }) {

    },

    *addGoods({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsAdd, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("addGoods ==> ", data);
      }
    },

    *orderList({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.orderList, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("orderList ==> ", data);
      }
    }
  },
  subscriptions: {
  	setup({ dispatch, history }) {
  		history.listen(({ pathname }) => {
        if(pathname === '/mall/goods-type' || pathname === '/mall/goods-add') {
          dispatch({
            type: 'getGoodsType',
            payload: {
              page: 0,
              limit: 10,
              sort: ["-createdAt"]
            }
          })
        }
        if(pathname === '/mall/goods-list') {
          dispatch({
            type: 'getGoodsList',
            payload: {
              page: 0,
              limit: 10,
              sort:["-createdAt"]
            }
          })
        }
        if(pathname === '/mall/order-list') {
          dispatch({
            type: 'orderList',
            payload: {
              page: 0,
              limit: 10,
              sort:["-createdAt"]
            }
          })
        }
      })
  	}
  }
}
