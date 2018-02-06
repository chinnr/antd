import graphRequest from '../utils/graphRequest';

// 获取课程列表
export function createTeam(formHead,formGroup) {
  const createTeamMutation = `mutation newHead($formHead: FormHeadRegister!,$formGroup: FormGroupNew!) {
  me {
    newHead(formHead: $formHead, formGroup: $formGroup) {
      uid
      level
    }
  }
}`;
  return graphRequest(createTeamMutation, {formHead,formGroup}, 'course')
}
