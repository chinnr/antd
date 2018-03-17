import graphRequest from '../utils/graphRequest';
import MallAdvertising from "../routes/Mall/MallAdvertising";

// 获取全部商品类型
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
            skuPrefix
          }
        }
      } 
    }
  }`;
  return graphRequest(query, { q }, 'mall-admin')
}

// 添加商品类型
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

// 获取商品列表
export function goodsList(v) {
  const query = `
    query getGoodsList($v: FormQuery) {
      me {
        goods {
          getAll(query: $v) {
            data {
              gid
              name
              sku
              imgs{
                url
              }
              listImg
              skuPrefix
              skuPure
              skuSize
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

// 获取卡券列表
export function virtualGoods(query , adminVirtual) {
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
              createdAt,
              cardExpireTime,
              cardBag
              isDonate
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
  const goodsAdd = `mutation goodsAdd($form: CreateGoods){
    me {
      goods {
        createMutiGoods(form:$form)
      }
    }
  }`;
  return graphRequest(goodsAdd, {form}, 'mall-admin')
}

// 订单列表管理
export function orderList(query,queryOption) {
  const orderList = `query orderList($query: FormQuery, $queryOption: QueryOrder) {
    me{
      order{
        getAll(query: $query, queryOption: $queryOption){
          data{
            uid
            sku
            payTime
            consignee
            status
            totalMoney
            address
            gidJson{
              count
              name
            }
          }
          meta{
            limit
            page
            count
          }
        }
      }
    }
  }`;
  return graphRequest(orderList, {query,queryOption}, 'mall-admin')
}

// 赠送卡券
export function donateVirtualGoods(form) {
  const donate = `mutation donate($form: donateUserModel) {
    me{
      virtualGoods{
        donate(form: $form)
      }
    }
  }`;
  return graphRequest(donate, {form}, 'mall-admin')
}

// 获取广告位列表
export function getAdvertiseList() {
  const getAdvertiseList = `query getAdvertiseList {
    me {
      goods {
        getDiscovery {
          gid
          img
        }
      }
    }
  }`;
  return graphRequest(getAdvertiseList, {}, 'mall-admin')
}
