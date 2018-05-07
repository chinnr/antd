import graphRequest from "../utils/graphRequest";
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
            parentId
            name
            type
            level
            typeImg
            skuPrefix
            expireTime
            priority
            show
          }
        }
      } 
    }
  }`;
  return graphRequest(query, {q}, "mall-admin");
}

// 获取单个商品类型
export function oneGoodsType(queryOption) {
  const query = `query getGoodsType($queryOption: QueryGoodsType) {
    me {
      goodsType {
        getGoodsTypes(queryOption: $queryOption) {
          meta {
            count
            limit
            page
          }
          data {
            tid
            parentId
            name
            type
            level
            typeImg
            skuPrefix
            expireTime
            priority
            show
          }
        }
      } 
    }
  }`;
  return graphRequest(query, queryOption, 'mall-admin')
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
  return graphRequest(mutation, {formData}, "mall-admin");
}

// 删除商品类型
export function deleteGoodsType(tid) {
  const deleteGoodsType = `mutation deleteGoodsType($tid: String) {
    me {
      goodsType {
        deleteGoodsType(tid: $tid)
      }
    }
  }`;
  return graphRequest(deleteGoodsType, tid, "mall-admin");
}

// 修改商品类型
export function updateGoodsType(form) {
  const updateGoodsType = `mutation updateGoodsType($form: GoodsTypeInputUpdate) {
    me {
      goodsType {
        updateGoodsType(form: $form) {
          tid
        }
      }
    }
  }`;
  return graphRequest(updateGoodsType, {form}, "mall-admin");
}

// 更新商品
export function updateGoods(payload) {
  const updateGoods = `mutation updateGoods($form: UpdateGoodsInput) {
  me {
    goods{
      updateGoods(form:$form)
    }
  }
}`;
  return graphRequest(updateGoods,payload,"mall-admin");
}

//获取商品类型名称
export function getTypeName(payload){
  const getName = `query getName($query: FormQuery, $queryOption: QueryGoodsType) {
  me {
    goodsType{
      getGoodsTypes(query:$query,queryOption:$queryOption){
        data{
          name
        }
      }
    }
  }
}`
  return graphRequest(getName,payload,'mall-admin');
}

// 获取商品列表
export function goodsList(payload) {
  const getAllGoods = `
    query getGoodsList($query: FormQuery, $queryOption: QueryData) {
      me {
        goods {
          getAll(query: $query, queryOption:$queryOption) {
            data {
              gid
              name
              type
              sku
              imgs{
                url
              }
              listImg
              province
              city
              goodsValue
              sizeImg
              description
              skuPrefix
              skuPure
              skuSize
              goodsJson{
                gid
                count 
                name
              }
              originalPrice
              price
              stock
              upTime
              downTime
              expireTime
              description
              show
              postPrice
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
  return graphRequest(getAllGoods, payload, "mall-admin");
}

// 获取单个商品详情
export function getGoodsDetail(gid) {
  const getGoodsDetail = `query goodsDetail($gid: [String]) {
    me {
      goods {
        getGoodsByIds(ids: $gid) {
          data{
            name
            sku
            skuPrefix
            skuSize
            goodsValue
            description
            upTime
            downTime
            expireTime
            stock
            show
            type
            price
            goodsJson {
              gid
              count
              name
            }
            imgs {
              url
            }
            listImg
            province
            city
            originalPrice
            postPrice
            isPackage
            listDes
          }
        }
      }
    }
  }`;
  return graphRequest(getGoodsDetail, gid, "mall-admin");
}

// 获取卡券列表
export function virtualGoods(query, adminVirtual) {
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
  return graphRequest(virtualGoodsQuery, {query, adminVirtual}, "mall-admin");
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
  return graphRequest(goodsAdd, {form}, "mall-admin");
}

// 添加单个商品
export function singleGoodsAdd(form) {
  const goodsAdd = `mutation singleGoodsAdd($form: CreateGoodsInput){
    me {
      goods {
        createGoods(form:$form){
          gid
        }
      }
    }
  }`;
  return graphRequest(goodsAdd, {form}, "mall-admin");
}

// 删除商品
export function deleteGoods(gid) {
  const deleteGoods = `mutation deleteGoods($t:String, $gid: String) {
    me(token: $t) {
      goods {
        deleteGoods(gid: $gid)
      }
    }
  }`;
  return graphRequest(deleteGoods, gid, "mall-admin");
}

// 订单列表管理
export function orderList(payload) {
  const orderList = `query orderList($query: FormQuery, $queryOption: QueryOrder, $timeSpan:TimeSpan!) {
    me{
      order{
        getAll(query: $query, queryOption: $queryOption, timeSpan:$timeSpan){
          data{
            id
            totalMoney
            gidJson {
              gid
              count
              name
              price
              skuSize
              donate{
                gid
                count
                name
                skuSize
              }
            }
            sku
            status
            statusDelivery
            sender
            address
            tel
            expressNumber
            consignee
            postPrice
            buyTime
            payId
            payTime
            cardId
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
  return graphRequest(orderList, payload, "mall-admin");
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
  return graphRequest(donate, form, "mall-admin");
}

// 获取用户卡券统计
export function getVirtualGoodsCount(uid) {
  const getVirtualGoodsCount = `query getVirtualGoodsCount($uid: String!) {
    me {
      virtualGoods {
        getVirtualGoodsCount(uid: $uid){
          keshi
          tiyan
        }
      }
    }
  }`;
  return graphRequest(getVirtualGoodsCount, {uid}, "mall-admin");
}

// 获取广告位列表
export function getAdvertiseList() {
  const getAdvertiseList = `query advertisementConfig{
    pub {
      advertisementConfig {
        getDiscovery{
          gid
          img
          sku
        }
      }
    }
  }`;
  return graphRequest(getAdvertiseList, {}, "mall");
}

// 修改广告位
export function updateAdvertiseList(form) {
  const update = `mutation updateDiscovery($form: [DiscoveryConfig]) {
    me{
      goods {
        updateDiscovery(form: $form)
      }
    }
  }`;
  return graphRequest(update, form, "mall-admin");
}

// 获取支付记录
export function getAllPayRecord(payload) {
  const payRecord = `query getAllPayRecord($queryOption: QueryPayRecordOption,$query: FormQuery,$timeSpan: adminTimeSpan!) {
    me{
      payRecord {
        getAllPayRecord(queryOption: $queryOption, query: $query, timeSpan: $timeSpan) {
          data{
            id
            platformName
            returnCode
            uid
            receipt_amount
            buyer_pay_amount
            out_trade_no
          }
          meta{
            page
            limit
            count
          }
        }
      }
    }
  }`;
  return graphRequest(payRecord, payload, "mall-admin");
}

//更新订单状态
export function updateOrderState(payload) {
  console.log("!!!!!!!!========>",payload);
  const update = `mutation stateChange($form: UpdateStatusModel) {
  me {
    Order{
      UpdateOrderState(form:$form)
    }
  }
}
`;
  return graphRequest(update, payload, "mall-admin");
}
