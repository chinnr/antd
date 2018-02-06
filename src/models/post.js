import * as postService from '../services/post';

export default {
  namespace: 'post',
  state: {
    classes: [],
  },
  reducers: {
    storeClasses(state, {payload}){
      const {classes} = payload;
      return {
        ...state,
        classes
      }
    }
  },
  effects: {
    *getClasses({payload}, {call, put}) {
      const data = yield call(postService.getClasses, payload);
      const classes = data.data.public.classes.data;
      yield put({
        type: "storeClasses",
        payload: {classes}
      });
    },

    *createPost({payload}, {call, put}) {
      console.log("createPost payload ==>", payload);
      const data = yield call(postService.createPost, payload);
      console.log("createPost ==> ", data);
    }
  }
}
