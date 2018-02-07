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
  let _token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmUiOjE1MTc5Njc4MDEsImV4cCI6MTUxODA1NDIwMSwiaWQiOiI5NjA2MzMzNTQ4NDEiLCJpcCI6IjE5Mi4xNjguOC4xODgiLCJwc3ciOiI3LTJGRUEzZWQ4M2VkODNlZDgiLCJ1aWQiOiJlNDQ3YmQ0Ny02NjJiLTRkNWUtYjA5Ny1hODE5MTQ2NTJiMWMifQ.VJGU2XWbSobfcXdwBV-jkApTkuFPsnMygda_UMDOoRPuN8MS7xmaGogxNFuxjuj61Xxuo1Q2ZJUZyn_kOefGRVcFcKoJiBH6QG2i6L_cF3UdZhB5jT0WPsdzC5IulcgbmITBOVBrsjGW7oj4BNP5RoZcbbzpNrD6rcT18ht4Qx4o6zqen0SPDT7rYkJeSbJJlH0xAZsuh9YBsH0PMtYNcXovq2qfUJlAGnoUZUQmLOTIQB5oNrq-1VNcId8yqWkPWwbyjMxKk6mLut98NahuS6lc0uwxrjl6_4w_bnsaJrMK25_iDOjpSlljEnMoFHYzpqh6cBuQ3IPrKe0Ba9F6mA";
  
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
