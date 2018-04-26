import graphRequest from "../utils/graphRequest";

export function getStatics(form) {
  const getStatics = `mutation generateExcel($form: CostTime) {
  me {
    virtualGoods {
      generateExcel(form: $form)
    }
  }
}`;
  return graphRequest(getStatics, form, "mall-admin");
}

export function getUserExcel(payload) {
  const getUser = `mutation getUserExcel {
  me {
    usersDownLoad
  }
}`
  return graphRequest(getUser,{},"young-admin")
}

export function getTeamExcel(payload) {
  const getTeam = `mutation getTeamExcel {
  me {
    groupsDownLoad
  }
}`
  return graphRequest(getTeam,{},"young-admin")
}
