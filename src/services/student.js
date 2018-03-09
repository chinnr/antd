import graphRequest from '../utils/graphRequest';

export function studentList(v) {
	const query = `query
    getStudentList($v: FormQuery) {
      me {
        users(query: $v) {
          data {
            uid
            base {
              phone
              profile {
                realName
              }
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
  `;
  return graphRequest(query, { v }, 'young-admin');
}

export function studentDetail(uid) {
  const query = `
    query getStudentDetail($uid: String!) {
      me {
        userOne(uid: $uid) {
          base {
            profile {
              realName
              sex
              birth
              ethnic
              religion
              id
              address
              phone
              province
              city
            }
          }
          group {
            name
          }
          number
          isLead
          leadList
          classNameAlias
          level
          guardian {
            relativeName1
            relativeRelation1
            relativePhone1
            relativeName2
            relativeRelation2
            relativePhone2
          }
        }
      }
    }
  `;
  return graphRequest(query, { uid }, 'young-admin');
}

export function updatePassword({ uid, form }) {
  console.log('receive data ', uid, form);
  const mutation = `
  mutation updatePassword($uid: String, $form: FormUser!) {
    meExec {
      userEdit(uid: $uid, form: $form) {
        uid
      }
    }
  }
  `;
  return graphRequest(mutation, { uid, form }, 'user-admin');
}
