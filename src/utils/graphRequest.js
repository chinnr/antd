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
  let _token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmUiOjE1MTgwNjA5MTgsImV4cCI6MTUxODE0NzMxOCwiaWQiOiI4Mjk0MTg1NTk0OTUiLCJpcCI6IjE5Mi4xNjguOC4xODgiLCJwc3ciOiI3LTJGRUEzZWQ4M2VkODNlZDgiLCJ1aWQiOiJlNDQ3YmQ0Ny02NjJiLTRkNWUtYjA5Ny1hODE5MTQ2NTJiMWMifQ.ezW8qT5qIXc0caboU4vGReUt4n8krH9Uz8z11Br3LIFDUxuig4CyZYamv-ihflJFQdWfiGrTouIlpTLbW_PgSJB1WQgnUOVGm1evsurzqL5Wt1n7tF3d440OPgYTXoBLEYfGzRYdFLZ7WF7s0EO1W2aM8Defr2DBj1sU9N-aHNoALUsmwjJasnTNnGrjIqpJo8fSFvmH4mstHRvZv5IxBFQ_TvyA6hywmXUSCm1cwpRIlwJ-WsXEnpWJ3Q4NTxhvIkG6yMQfwes7-i-hDtcBKdfMaxC7-5DRXjBdSM-lJkmvj8r4GA3AWlqg6C4Wt4PgV2kXoRUEUllSeQIPbULREA";

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
