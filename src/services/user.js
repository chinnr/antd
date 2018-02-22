import graphRequest from '../utils/graphRequest';

// 获取管理员信息
export function getAdminDetail() {
  const adminDetail = `query adminDetail {
  me {
    detail{
      nickname
      username
      uid
    }
  }
}`;
  return graphRequest(adminDetail, {}, 'user-admin')
}
