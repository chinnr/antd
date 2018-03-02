import * as studentService from '../services/student';

export default {
  namespace: 'student',
  state: {
    studentList: [],
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
      const { data, error } = yield call(studentService.studentList, v);
      if(error) {
        throw new Error(errors);
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
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname}) => {
        if(pathname === '/student-manage' || pathname === '/team/list') {
          dispatch({
            type: 'getStudentList',
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
