import graphRequest from '../utils/graphRequest';

export function goodsType() {
  const query = `query getGoodsType {
    me {
      goodsType {
        getGoodsTypes {
          meta {
            count
            limit
            page
          }
          data {
            tid
            name
            type
            level
            typeImg
          }
        }
      } 
    }
  }`;
  return graphRequest(query, {}, 'mall-admin')
}
