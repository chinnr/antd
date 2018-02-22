import graphRequest from '../utils/graphRequest';

// 管理员登录
export function login(form) {
  const adminLogin = `mutation adminLogin($form: FormLogin!) {
    login(form: $form) {
      token
      exp
      uid
      level
      cre
      psw
      ip
      id
    }
  }`;
  return graphRequest(adminLogin, { form }, 'user-admin')
}