import graphRequest from "../utils/graphRequest";



export function getStatics(form) {
  const getStatics = `query generateExcelData($form: CostTime) {
  me {
    virtualGoods {
      generateExcelData(form: $form)
    }
  }
}`;
  return graphRequest(getStatics, form, "mall-admin");
}
