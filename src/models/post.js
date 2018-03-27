import * as postService from "../services/post";

export default {
  namespace: "post",
  state: {
    classes: [], // 文章类型
    posts: [], // 文章列表
    postsMeta: {}, // 文章分页信息
    post: {} // 文章详情页
  },
  reducers: {
    storeClasses(state, { payload }) {
      const classes = payload;
      console.log("storeClasses: ", payload);
      return {
        ...state,
        classes
      };
    },

    storePosts(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    storePostDetail(state, { payload }) {
      console.log("storePostDetail payload==>", payload);
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *getClasses({ payload }, { call, put }) {
      const { data, errors } = yield call(postService.getClasses, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        const classes = data.public.classes.data;
        // console.log("classes ===>", classes)
        yield put({
          type: "storeClasses",
          payload: classes
        });
      }
    },

    *createPost({payload}, {call, put}) {
      console.log("createPost payload ==>", payload);
      const {data, errors} = yield call(postService.createPost, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("createPost ==> ", data);
      }
    },

    *createClasses({payload}, {call, put}) {
      const {data, errors} = yield call(postService.createClassses, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("createClassses ==> ", data);
      }
    },

    *getPosts({ payload }, { call, put }) {
      const { data, errors } = yield call(postService.postList, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("post list: ", data.public.posts.data);
        const posts = data.public.posts.data;
        const postsMeta = data.public.posts.meta;
        yield put({
          type: "storePosts",
          payload: { posts, postsMeta }
        });
      }
    },

    *getPostDetail({ payload }, { call, put }) {
      const { data, errors } = yield call(postService.postDetail, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        const post = data.public.post;
        yield put({
          type: "storePostDetail",
          payload: { post }
        });
      }
    },

    *updatePost({ payload }, { call, put }) {
      const { data, errors } = yield call(postService.updatePost, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log("update  post: ", data);
      }
    }
  }
};
