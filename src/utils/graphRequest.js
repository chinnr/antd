import {gqlNetworkInterface} from './constant';

/**
 * graph 请求函数
 * @param query   graph查询语句
 * @param variables  graph请求参数
 * @param service    请求的节点代理
 * @returns {Promise<any>}
 */

export default async function graphRequest(query = '', variables = {}, service = '') {
  let _headers = {
    Accept: 'application/json;charset=utf-8',
    'Content-Type': 'application/json',
    'Accept-Language': 'zh-CN'
  };
  let _token = await localStorage.getItem('token');
  if (_token != null) {
    _headers.Authorization = 'Bearer ' + _token;
  }
  if (service.length > 0) {
    _headers['X-SERVER'] = service;
  }
  return await fetch(gqlNetworkInterface, {
    method: 'POST',
    headers: _headers,
    body: JSON.stringify({query, variables})
  })
    .then(response => response.json())
    .then(responseJson => {
        return responseJson;
    })
}
