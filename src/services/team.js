import graphRequest from '../utils/graphRequest';

// 创建团
export function createTeam(argv) {
  const createTeamMutation = `mutation newHead($formHead: FormHeadRegister!,$formGroup: FormGroupNew!){
    me{
      newHead(formHead: $formHead, formGroup: $formGroup){
        uid
        number
        level
      }
    }
  }`;
  console.log("createTeamMutation==>", argv)
  return graphRequest(createTeamMutation, argv, 'young-admin')
}

// 根据地址获取经纬度
export function addrInfo(input) {
  const getAddrInfo = `query address($input: String!) {
    addressInfo(input: $input) {
      format
      province
      city
      district
      longitude
      latitude
    }
  }`;
  return graphRequest(getAddrInfo, input, 'user');
}

// 根据经纬度获取地址
export function locationInfo() {
  const locationInfo = `query locationInfo($longitude: Float!, $latitude: Float!){
    locationInfo(longitude:$longitude, latitude:$latitude){
      input
      format
      province
      city
      district
    }
  }`;
  return graphRequest(locationInfo, input, 'user');
}
