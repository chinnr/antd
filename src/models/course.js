import * as courseService from '../services/course';

export default {
  namespace: 'course',
  state: {
    courseTemplatePubList: [],
    courseTemplatePubListMeta: {},
    courseList: [],
    courseListMeta: {},
    courseDetail: {},
    courseObj: {},
    briefArray: [{
      title: "",
      picture: [],
      text: ""
    }],
  },
  reducers: {
    // 存储模板列表信息到 store
    storeTemCourseList(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    // 存储上课列表信息到 store
    storeCourseList(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    // 存储课程详细信息到 store
    storeCourseDetail(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *createCourseTemplate({ payload }, { call, put }) {
      const { data, errors } = yield call(courseService.createCourseTemplate, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('createCourseTemplate==>', data);
      }
    },

    *updateCourseTemplate({ payload }, { call, put }) {
      const { data, errors } = yield call(courseService.updateCourseTemplate, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('updateCourseTemplate ==>', data);
      }
    },

    *deleteCourseTemplate({ payload }, { call, put }) {
      const { data, errors } = yield call(courseService.deleteCourseTemplate, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('deleteCourseTemplate==>', data);
      }
    },

    *courseTemplatePubList({ payload }, { call, put }) {
      const { data, errors } = yield call(
        courseService.courseTemplatePubList,
        payload
      );
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('courseTemplatePubList==>', data);
        const courseTemplatePubList = data.me.courseTemplatePubList.data;
        const courseTemplatePubListMeta = data.me.courseTemplatePubList.meta;
        yield put({
          type: 'storeTemCourseList',
          payload: { courseTemplatePubList, courseTemplatePubListMeta }
        });
      }
    },

    *courseTemplateByName({ payload }, { call, put }) {
      const { data, errors } = yield call(
        courseService.courseTemplateByGroupName,
        payload
      );
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('courseTemplateListByName==>', data);

        let courseTemplatePubList,
          courseTemplatePubListMeta;

        try{
          courseTemplatePubList = data.me.courseListByGroupName.data;
          courseTemplatePubListMeta = data.me.courseListByGroupName.meta;
          yield put({
            type: 'storeTemCourseList',
            payload: { courseTemplatePubList, courseTemplatePubListMeta }
          });
        }catch(err){
          console.log("err",err);
        }
      }
    },

    *courseTemplateByCity({ payload }, { call, put }) {
      const { data, errors } = yield call(
        courseService.courseTemplateByCity,
        payload
      );
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('courseTemplateListByCity==>', data);

        let courseTemplatePubList,
          courseTemplatePubListMeta;

        try{
          courseTemplatePubList = data.me.courseListByGroupCity.data;
          courseTemplatePubListMeta = data.me.courseListByGroupCity.meta;
          yield put({
            type: 'storeTemCourseList',
            payload: { courseTemplatePubList, courseTemplatePubListMeta }
          });
        }catch(err){
          console.log("err",err);
        }
      }
    },

    *courseList({ payload }, { call, put }) {
      const { data, errors } = yield call(courseService.courseList, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('courseList-->', data);
        const courseList = data.me.courseList.data;
        const courseListMeta = data.me.courseList.meta;
        yield put({
          type: 'storeCourseList',
          payload: { courseList, courseListMeta }
        });
      }
    },

    *courseDetail({ payload }, { call, put }) {
      const { data, errors } = yield call(courseService.courseDetail, payload);
      if (errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('courseDetail-->', data);
        const courseDetail = data.me.course;
        yield put({
          type: 'storeCourseDetail',
          payload: { courseDetail }
        });
        return  courseDetail;
      }
    },

    *courseReview({ payload }, { call }) {
      let data = {};
      if (payload.type === 'resolve') {
        data = yield call(courseService.resolveCourse, {argv: payload.argv});
      }
      if (payload.type === 'reject') {
        data = yield call(courseService.rejectCourse, {argv: payload.argv});
      }
      if (data.errors) {
        const err = errors[0].message;
        throw new Error(err);
      } else {
        console.log('courseReview-->', data);
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/course/template-list') {
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
          });
        }
        // if (pathname === '/course/course-record') {
        //   dispatch({
        //     type: 'courseList',
        //     payload: {
        //       page: 0,
        //       limit: 10
        //     }
        //   });
        // }
      });
    }
  }
};
