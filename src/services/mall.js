import graphRequest from '../utils/graphRequest';

export function goodsType(q) {
  const query = `query getGoodsType($q: FormQuery) {
    me {
      goodsType {
        getGoodsTypes(query: $q) {
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
  return graphRequest(query, { q }, 'mall-admin')
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
  return graphRequest(mutation, { formData }, 'mall-admin')
}

export function delGoodsType() {
  const mutation = `
    mutation delGoodsType {
      me {
        goodsType {
          deleteGoodsType 
        }
      }
    }
  `;
  return graphRequest(mutation, {  }, 'mall-admin')
}

export function goodsList(v) {
  const query = `
    query getGoodsList($v: FormQuery) {
      me {
        goods {
          getAll(query: $v) {
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
  return graphRequest(query, { v }, 'mall-admin')
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

// 添加商品
export function goodsAdd(form) {
  const goodsAdd = `mutation goodsAdd($form: CreateGoodsInput){
    me {
      goods {
        createGoods(form:$form){
          gid
          name
        }
      }
    }
  }`;
  return graphRequest(goodsAdd, {form}, 'mall-admin')
}
