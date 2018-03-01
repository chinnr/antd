import graphRequest from '../utils/graphRequest';

export function studentList(v) {
	const query = `query
    getStudentList($v: FormQuery) {
      me {
        users(query: $v) {
          data {
            uid
            base {
              username
              nickname
            }
            number
            level
            group {
              name
            }
            isLead
            leadList
          }
          meta {
            count
            limit
            page
          }
        }
      }
    }
  `
  return graphRequest(query, { v }, 'young-admin');
}