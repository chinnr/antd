import * as courseService from "../services/course";

export default {
  namespace: "course",
  state: {
    courseTemplatePubList: [],
    courseTemplatePubListMeta: {},
    courseList: [],
    courseListMeta: {}
  },
  reducers:{
    // 存储模板列表信息到 store
    storeTemCourseList(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },

    // 存储上课列表信息到 store
    storeCourseList(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
  },
  effects: {
    *createCourseTemplate({payload}, {call, put}) {
      const {data, errors} = yield call(courseService.createCourseTemplate, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("createCourseTemplate==>", data);
      }
    },

    *courseTemplatePubList({payload}, {call, put}) {
      const {data, errors} = yield call(courseService.courseTemplatePubList, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("courseTemplatePubList==>", data)
        const courseTemplatePubList = data.me.courseTemplatePubList.data;
        const courseTemplatePubListMeta = data.me.courseTemplatePubList.meta;
        yield put({
          type: "storeTemCourseList",
          payload: {courseTemplatePubList, courseTemplatePubListMeta}
        })
      }
    },

    *courseList({payload}, {call, put}) {
      const {data, errors} = yield call(courseService.courseList, payload);
      if(errors) {
        const err = errors[0].message;
        throw new Error(err);
      }else{
        console.log("courseList-->", data);
        const courseList = data.me.courseList.data;
        const courseListMeta = data.me.courseList.meta;
        yield put({
          type: "storeCourseList",
          payload: {courseList, courseListMeta}
        })
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname}) => {
        if(pathname === '/course/template-list') {
          dispatch({
            type: 'courseTemplatePubList',
            payload: {
              tempQuery: {
                limit: 10,
                page: 0
              },
              badgeQuery: {
                limit: 10,
                page: 0
              }
            }
          })
        }
        if(pathname === '/course/course-record') {
          dispatch({
            type: 'courseList',
            payload: {
              page: 0,
              limit: 10
            }
          })
        }
      })
    }
  }
}
