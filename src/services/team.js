import graphRequest from '../utils/graphRequest';

//删除团
export function deleteTeam(gid) {
  const deleteTeam = `mutation($gid:String) {
  me {
    groupDelete(gid:$gid)
  }
}`;
  console.log("!!!!!!!!!!!!==============>>>>>>>>>>",gid);
  return graphRequest(deleteTeam,gid,'young-admin');
}

//通过phone查询user
export function queryByPhone(payload) {
  const queryByPhone = `query queryPhone($phone:String!) {
  me{
    userOneByPhone(phone:$phone){
      uid
      number
      base{
        profile{
          realName
        }
      }
    }
  }
}`;

  return graphRequest(queryByPhone, payload, 'young-admin');
}

// 创建团
// export function createTeam(argv) {
//   const createTeamMutation = `mutation newGroup($uid: String!,$formGroup: FormGroupNew!){
//     me{
//       newGroup(uid: $uid, form: $formGroup){
//         uid
//         name
//         province
//         city
//         district
//         address
//       }
//     }
//   }`;
//
//   return graphRequest(createTeamMutation, argv, 'young-admin');
// }

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

  return graphRequest(createTeamMutation, argv, 'young-admin');
}

// 修改团信息
export function updateTeam(payload) {
  const updateTeam = `mutation updateTeam($gid: String!, $form: FormGroupBase!) {
    me {
      groupInfoSet(gid: $gid, form: $form){
        gid
        uid
        name
      }
    }
  }`;
  const gid = payload.gid;
  const form = payload.form;
  return graphRequest(updateTeam, {gid, form}, 'young-admin');
}

// 管理员获取所有团
export function getAllTeams(payload) {
  const getAllTeams = `query allTeams($query: FormQuery, $groupLevel: String) {
    me {
      groups(query: $query, groupLevel:$groupLevel) {
        data {
          gid
          uid
          createdTime
          numJoin
          name
          city
          province
          address
          district
          groupLevel
          username
          nickname
          type
          coachList{
            uid
            name
            icon
            realName
          }
          head {
            phone
            name
          },
          description {
            icon
            brief
            company
            mien
          }
        }
        meta {
          limit
          page
          count
        }
      }
    }
  }`;
  return graphRequest(getAllTeams, payload, 'young-admin')
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
export function locationInfo(argv) {
  const locationInfo = `query locationInfo($longitude: Float!, $latitude: Float!){
    locationInfo(longitude:$longitude, latitude:$latitude){
      input
      format
      province
      city
      district
      longitude
      latitude
    }
  }`;
  return graphRequest(locationInfo, argv, 'user');
}

// 修改团密码
export function modifyTeamPsw(payload) {
  const modifyPsw = `mutation modifyPsw($username:String, $formUser: FormUser!) {
    meExec{
      userEdit(username:$username, form: $formUser){
        nickname
        username
        uid
      }
    }
  }`;
  const username = payload.username;
  const formUser = {password: {password:payload.password}};
  return graphRequest(modifyPsw,{username, formUser}, 'user-admin');
}

// 指派教官
export function addCoach(payload) {
  // console.log("指派教官 payload==>", payload);
  const addCoachMutate = `mutation addCoach($gid: String!,$uids: [String]!,$isOn: Boolean!) {
    me {
      groupCoachSetPatch(gid: $gid, uids: $uids, isOn:$isOn)
    }
  }`;
  return graphRequest(addCoachMutate, payload, 'young-admin');
}
