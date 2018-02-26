import graphRequest from '../utils/graphRequest';

// 管理员创建证章
export function createBadge(form) {
  const newBadge = `mutation newBadge($form: CreateInputModel) {
    me {
      badge {
        createBadge(form: $form) {
          bid
          name
          uid
        }
      }
    }
  }`;
  return graphRequest(newBadge, form, 'grow-admin');
}

// 证章列表
export function getAllBadges(query) {
  console.log("证章列表 ==> ", query)
  const badgeList = `query badgeList($t: String,$query: FormQuery) {
    me(token: $t) {
      badge {
        getAllBadge(query: $query) {
          data {
            bid
            name
            uid
            level
            stage
            class
            normalImg
            grayImg
          }
          meta {
            count
            limit
            page
          }
        }
      }
    }
  }`;
  return graphRequest(badgeList, query, 'grow-admin');
}
