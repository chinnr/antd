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

export function goodsList() {
  const query = `
    query getGoodsList {
      me {
        goods {
          getAll {
            data {
              name
              sku
              originalPrice
              price
              stock
            }
            meta {
              count
              limit
              page
            }
          }
        }
      }
    }
  `;
  return graphRequest(query, {}, 'mall-admin')
}