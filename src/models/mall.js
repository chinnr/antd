import * as mallService from '../services/mall';
import * as badgeService from "../services/badge";

export default {
  namespace: 'mall',
  state: {
  	goodsType: [],
    goodsTypeMeta: {},
    goodsList: [],
    goodsListMeta: {},
    myVirtualGoods: [],
    advertiseList: [],
    orderList: [],
    orderListMeta: {},
    allPayRecord: [],
    allPayRecordMeta:{}
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
            goodsTypeMeta: data.me.goodsType.getGoodsTypes.meta
          }
        })
      }
    },

    *getGoodsList({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsList, payload);
      console.log('goods  ====>  ', data)
      if(errors) {
        throw new Error(errors[0].message);
      }

      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            goodsList: data.me.goods.getAll.data,
            goodsListMeta: data.me.goods.getAll.meta
          }
        })
      }
    },

    *getUserVirtualGoods({ payload: uid }, { call, put }) {
      console.log("modal getUserVirtualGoods: ", uid);
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

    *deleteGoods({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.deleteGoods, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("deleteGoods ==> ", data);
      }
    },

    *orderList({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.orderList, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("orderList ==> ", data.me.order.getAll);
        yield put({
          type: 'updateState',
          payload: {
            orderList: data.me.order.getAll.data,
            orderListMeta: data.me.order.getAll.meta
          }
        })
      }
    },

    *donateVirtualGoods({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.donateVirtualGoods, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("donateVirtualGoods ==> ", data);
      }
    },

    *getAdvertiseList({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.getAdvertiseList);
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            advertiseList: data.me.goods.getDiscovery,
          }
        })
      }
    },

    *getAllPayRecord({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.getAllPayRecord, payload);
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            allPayRecord: data.me.payRecord.getAllPayRecord.data,
            allPayRecordMeta: data.me.payRecord.getAllPayRecord.meta,
          }
        })
      }
    }
  },
  subscriptions: {
  	setup({ dispatch, history }) {
      const reg = /\/student-detail\/(.+)/;
  		history.listen(({ pathname }) => {
        if(pathname === '/mall/goods-type') {
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
              query: {
                page: 0,
                limit: 10,
                sort:["-createdAt"]
              }
            }
          })
        }
        if(pathname === '/mall/order-list') {
          dispatch({
            type: 'orderList',
            payload: {
              query: {
                limit: 10,
                page: 0
              },
              timeSpan: {
                "startTime": "2000/01/01",
                "endTime": "2099/12/31"
              }
            }
          })
        }
        if(pathname.match(reg)) {
          const uid = pathname.match(reg)[1];
          console.log("pathname: ", pathname);
          if(uid.length > 0) {
            console.log("uid.length > 0 ");
            dispatch({
              type: 'getUserVirtualGoods',
              payload: uid
            });
            dispatch({
              type: 'getStudentDetail',
              payload: uid
            })
          }
        }
        if(pathname === '/mall/goods-add') {
          dispatch({
            type: 'getGoodsType',
            payload: {
              page: 0,
              limit: 10,
              sort: ["-createdAt"]
            }
          });
          dispatch({
            type: 'getGoodsList',
            payload: {
              query: {
                page: 0,
                limit: 10,
                sort: ["-createdAt"]
              }
            }
          })
        }
        if(pathname === '/mall/advertising') {
          dispatch({
            type: 'getAdvertiseList'
          });
        }
      })
  	}
  }
}
