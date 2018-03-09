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

export function addGoodsType(formData) {
  const mutation = `mutation addGoodsType($formData: GoodsTypeInputCreate) {
    me {
      goodsType {
        createGoodsType(form: $formData) {
          tid
          name
          type
          level
          typeImg
          priority
        }
      }
    }
  }`;
  return graphRequest(mutation, formData, 'mall-admin')
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

export function virtualGoods(query , adminVirtual) {
  console.log('ss111222 ', query, adminVirtual)
  const virtualGoodsQuery = `
    query getUserVirtualGoods($query: FormQuery!, $adminVirtual: AdminVirtualQuery) {
      me {
        virtualGoods {
          getOneUserVirtualGoods(query: $query, adminVirtual: $adminVirtual) {
            data {
              count
              status
              cardType
              value
              createdAt
            }
          }
        }
      }
    }
  `;
  return graphRequest(virtualGoodsQuery, { query, adminVirtual }, 'mall-admin');
}