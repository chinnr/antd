import * as courseService from "../services/course";

export default {
  namespace: "course",
  state: {
    courseTempList: [],
    courseTempListMeta: {},
  },
  reducers:{
    // 存储模板列表信息到 store
    storeTemCourseList(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
  },
  effects: {
    *getCourseTempList({payload}, {call, put}) {
      const {data, errors} = yield call(courseService.getCourseTempList, payload)
      if(errors) {
        const err = errors[0].message;
        throw new Error(err)
      }else {
        console.log("getCourseTempList==>", data)
        // const courseTempList = data.me.courseList.data;
        // const courseTempListMeta = data.me.courseList.meta;
        // yield put({
        //   type: "storeTemCourseList",
        //   payload: {courseTempList, courseTempListMeta}
        // })
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname}) => {
        // if(pathname === '/course/template-list') {
        //   dispatch({
        //     type: 'getCourseTempList',
        //     payload: {
        //       page: 0,
        //       limit: 10
        //     }
        //   })
        // }
      })
    }
  }
}
