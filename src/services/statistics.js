import graphRequest from "../utils/graphRequest";



export function getStatics(form) {
  const getStatics = `mutation generateExcel($form: CostTime) {
  me {
    virtualGoods {
      generateExcel(form: $form)
    }
  }
}`
  return graphRequest(getStatics, form, "mall-admin");
}
