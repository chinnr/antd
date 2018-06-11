import * as mallService from '../services/mall';

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
    allPayRecordMeta:{},
    virtualGoodsCount: {},
    goodsTypeDetail: []
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
    *getGoodsById({payload},{call}) {
      const {data,errors} = yield call(mallService.getGoodsDetail, payload);
      if(!errors){
        const res = data.me.goods.getGoodsByIds.data;
        return res;
      }else{
        throw new Error(errors[0].message);
      }
    },
    *updateGoods({payload},{call}) {
      const {data,errors} = yield call(mallService.updateGoods, payload);
      if(!errors){
        const res = data.me.goods.updateGoods;
        if(typeof res == 'number'){
          console.log("更新商品======================>>>>>>>>>>>>>>>>",res);
          return res;
        }

      }else{
        throw new Error(errors[0].message);
      }
    },
    *getTypeName({payload},{call}) {
      // console.log("getTypeName   payload=============================>",payload);
      const {data,errors} = yield call(mallService.getTypeName, payload);
      if(errors) {
        throw new Error(errors[0].message);
      }else{
        const res = data.me.goodsType.getGoodsTypes.data[0].name;
        // console.log("getTypeName!!!!!==========================>>>",res);
        return res;
      }
    },
    *updateOrderState({ payload }, { call, put }){
      const { data, errors } = yield call(mallService.updateOrderState, payload);
      console.log("???????????============>>>>>>>>>>>>>",data);
      if(errors) {
        throw new Error(errors[0].message);
      }else{
        const res = data.me.Order.UpdateOrderState;

        if(typeof res =="number") return res;
      }
    },

    *getGoodsType({ payload: query }, { call, put }) {
      const { data, errors } = yield call(mallService.goodsType, query);
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        console.log("modal getGoodsType >>> ", data.me.goodsType.getGoodsTypes.data);
        yield put({
          type: 'updateState',
          payload: {
            goodsType: data.me.goodsType.getGoodsTypes.data,
            goodsTypeMeta: data.me.goodsType.getGoodsTypes.meta
          }
        });
      }
    },
    *getOneGoodsType({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.oneGoodsType, payload);
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        console.log("modal getOneGoodsType >>> ", data.me.goodsType.getGoodsTypes.data);
        const goodsTypeDetail = data.me.goodsType.getGoodsTypes.data;
        yield put({
          type: 'updateState',
          payload: {
            goodsTypeDetail: goodsTypeDetail,
          }
        });
        return goodsTypeDetail
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
    },

    *updateGoodsType({ payload: formData }, { call, put }) {
      const { data, errors } = yield call(mallService.updateGoodsType, formData);
      if(errors) {
        throw new Error(errors[0].message);
      }
    },

    *deleteGoodsType({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.deleteGoodsType, payload);
      if(errors) {
        throw new Error(errors[0].message);
      }
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

    *addSingleGoods({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.singleGoodsAdd, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("addSingleGoods ==> ", data);
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
        yield put({
          type: 'updateState',
          payload: {
            orderList: data.me.order.getAll.data,
            orderListMeta: data.me.order.getAll.meta
          }
        })
        return data.me.order.getAll.data;
      }
    },

    *virtualList({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.virtualList, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        const  res = data.me.virtualGoods.getAll.data;
        return res;
      }
    },

    *getVirtualGoodsCount({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.getVirtualGoodsCount, payload);
      if(errors) {
        throw new Error(errors[0].message);
      }else {
        const virtualGoodsCount = data.me.virtualGoods.getVirtualGoodsCount;
        yield put({
          type: 'updateState',
          payload: {
            virtualGoodsCount: virtualGoodsCount
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
      if(data.pub) {
        yield put({
          type: 'updateState',
          payload: {
            advertiseList: data.pub.advertisementConfig.getDiscovery,
          }
        })
      }
    },

    *updateAdvertiseList({ payload }, { call, put }) {
      const {data, errors} = yield call(mallService.updateAdvertiseList, payload);
      if (errors) {
        throw new Error(errors[0].message);
      }else {
        return data;
      }
    },

    *getAllPayRecord({ payload }, { call, put }) {
      const { data, errors } = yield call(mallService.getAllPayRecord, payload);
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        console.log("recordPay==============>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data);
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
        if(pathname === '/mall/goods-type' || pathname === '/mall/type-edit') {
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
          // console.log("pathname: ", pathname);
          if(uid.length > 0) {
            // console.log("uid.length > 0 ");
            dispatch({
              type: 'getVirtualGoodsCount',
              payload: uid
            });
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
        if(pathname === '/mall/goods-add'||'/mall/goods-edit') {
          dispatch({
            type: 'getGoodsType',
            payload: {
              page: 0,
              limit: 12,
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
              },
              stockRange:{
                stockStart:0,
                stockEnd:100000000
              }
            },
          })
        }
        if(pathname === '/mall/goods-list'){
          dispatch({
            type: 'getGoodsType',
            payload: {
              page: 0,
              limit: 12,
              sort: ["-createdAt"]
            }
          });
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
