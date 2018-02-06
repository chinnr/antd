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
  let _token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmUiOjE1MTc5MTIwMDcsImV4cCI6MTUxNzk5ODQwNywiaWQiOiIyNDY2OTYzMzc2NTYiLCJpcCI6IjE5Mi4xNjguOC4xODgiLCJwc3ciOiI3LTJGRUEzZWQ4M2VkODNlZDgiLCJ1aWQiOiJlNDQ3YmQ0Ny02NjJiLTRkNWUtYjA5Ny1hODE5MTQ2NTJiMWMifQ.C_iAfwzI7OzYik5X7q5N64r40ZmtI7sNJa_MlyZh5dv-htBKUP7k_dR67eNjTAxrFASApRwmxNkgyUMprb_m0acMGCxKlDHoTsaK23DkWJWrzZI4k8lP9XpHF1U1havzb5KpJGxC44MMvSNrsucVy-yCOzEssUzYB65mHS91Safnl6sX_N76jaOSO3x5okDqVKtV8vxl-CmTnEKzpYvLEKWFu-0MMPW6qjVtAyk17cmNlD3kfY17Q1wJHmSY_CKiKxxTdHNweGaMbtdFmL-DGF2QU00m6AaxG9lIJw8kuo-2t3g8LdJ9R2fXZg_MmG3vg7Rvk5hQ1a5-9i6F3zhJ0Q";

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
