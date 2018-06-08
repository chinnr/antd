import * as studentService from '../services/student';

export default {
  namespace: 'student',
  state: {
    studentList: [],
    studentDetail: {},
    page: null,
    limit: null,
    count: null
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getStudentList({ payload: v }, { call, put }) {
      const { data, errors } = yield call(studentService.studentList, v);
      console.log('student list  data ', data)
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            studentList: data.me.users.data,
            page: data.me.users.meta.page,
            count: data.me.users.meta.count,
            limit: data.me.users.meta.limit
          }
        })
      }
    },
    *getStudentListByAge({ payload: v,age:a }, { call, put }) {
      const { data, errors } = yield call(studentService.studentListByAge, v,a);
      console.log('student list by age  data ', data)
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            studentList: data.me.usersByAge.data,
            page: data.me.usersByAge.meta.page,
            count: data.me.usersByAge.meta.count,
            limit: data.me.usersByAge.meta.limit
          }
        })
      }
    },
    *getStudentListByCity({ payload: v,city:a }, { call, put }) {
      const { data, errors } = yield call(studentService.studentListByCity, v,a);
      console.log('student list by city  data ', data)
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            studentList: data.me.usersByCity.data,
            page: data.me.usersByCity.meta.page,
            count: data.me.usersByCity.meta.count,
            limit: data.me.usersByCity.meta.limit
          }
        })
      }
    },
    *getStudentListByProfile({ payload: v }, { call, put }) {
      const { data, errors } = yield call(studentService.studentListByProfile, v);
      console.log('student list by age  data ', data)
      if(errors) {
        throw new Error(errors[0].message);
      }
      if(data.me) {
        yield put({
          type: 'updateState',
          payload: {
            studentList: data.me.usersByProfile.data,
            page: data.me.usersByProfile.meta.page,
            count: data.me.usersByProfile.meta.count,
            limit: data.me.usersByProfile.meta.limit
          }
        })
      }
    },
    *getStudentDetail({ payload: uid }, { call, put }) {
      const { data, error } = yield call(studentService.studentDetail, uid);
      // console.log('data 334 4 ', data)
      if(error) {
        throw new Error(errors);
      }

      if(data.me) {
        const studentDetail = {
          ...data.me.userOne.base.profile,
          ...data.me.userOne.guardian,
          group: data.me.userOne.group ? data.me.userOne.group.name : '',
          isLead: data.me.userOne.isLead,
          leadList: data.me.userOne.leadList,
          level: data.me.userOne.level,
          number: data.me.userOne.number,
          classNameAlias: data.me.userOne.classNameAlias
        };

        yield put({
          type: 'updateState',
          payload: {
            studentDetail
          }
        })

        return studentDetail
      }
    },
    *updateUserPassword({ payload: { uid, form } }, { call, put }) {
      const { data, error } = yield call(studentService.updatePassword, { uid, form });
      if(error) {
        throw new Error(errors);
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname}) => {
        const reg = /\/student-detail\/(.+)/;
        if(pathname === '/student') {
          dispatch({
            type: 'getStudentList',
            payload: {
              page: 0,
              limit: 10,
              sort:["-createdAt"]
            }
          })
        }
        if(pathname.match(reg)) {
          const uid = pathname.match(reg)[1];
          if(uid.length > 0) {
            /*dispatch({
              type: 'getUserVirtualGoods',
              payload: uid
            });*/
            dispatch({
              type: 'getStudentDetail',
              payload: uid
            })
          }
        }
      })
    }
  }
}
