import * as postService from '../services/post';

export default {
  namespace: 'post',
  state: {
    classes: [], // 文章类型
    posts: [], // 文章列表
    postsMeta: {}, // 文章分页信息
    post: {},  // 文章详情页
  },
  reducers: {
    storeClasses(state, {payload}){
      const {classes} = payload;
      return {
        ...state,
        classes
      }
    },

    storePosts(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },

    storePostDetail(state, {payload}) {
      console.log("storePostDetail payload==>", payload);
      return {
        ...state,
        ...payload
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
    },

    *getPosts({payload}, {call, put}) {
      const data = yield call(postService.postList, payload);
      console.log("post list: ", data.data.public.posts.data);
      const posts = data.data.public.posts.data;
      const postsMeta = data.data.public.posts.meta;
      yield put({
        type: "storePosts",
        payload: {posts, postsMeta}
      });
    },

    *getPostDetail({payload}, {call, put}) {
      const data = yield call(postService.postDetail, payload);
      const post = data.data.public.post;

      yield put({
        type: "storePostDetail",
        payload: {post}
      })
    },

    *updatePost({payload}, {call, put}) {
      const data = yield call(postService.updatePost, payload);
      console.log("update  post: ", data);
    }
  }
}
