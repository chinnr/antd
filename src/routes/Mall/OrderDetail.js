import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import colors from '../../static/colors';
import styles from './index.less';
import moment from 'moment';

const { Description } = DescriptionList;
const colorMap = {
  "#ffffff":"白色",
  "#ff0000":"红色",
  "#ffa500":"橙色",
  "#ffff00":"黄色",
  "#008000":"绿色",
  "#00ffff":"青色",
  "#0000ff":"蓝色",
  "#800080":"紫色",
  "#000000":"黑色"
}

@connect(({ mall }) => ({ mall }))
export default class BasicProfile extends Component {
  payId = '';
  state = {
    virtual:''
  };
  componentDidMount() {
    const reg = /\/order-detail\/(.+)/;
    const id = this.props.location.pathname.match(reg)[1];
    const queryOption = {
      id: id
    };
    console.log('路由参数: ', this.props.location.pathname, id);
    this.getOrderDetail(0, queryOption);

  }

  /**
   * 获取单个订单
   * @param p
   * @param queryOption
   * @param timeSpan
   */
  getOrderDetail = (p = 0, queryOption = {}, timeSpan = {
    "startTime": "2000/01/01",
    "endTime": "2099/12/31"
  }) => {
    this.props
      .dispatch({
        type: 'mall/orderList',
        payload: {
          query: {
            limit: 10,
            page: p
          },
          queryOption: queryOption,
          timeSpan: timeSpan
        }
      }).then((res)=>{
      // console.log("orderDetail:     ",res);
      if(res[0].payId){
        this.getAllPayRecord(0, {id:res[0].payId});
      }
      let id = res[0].cardId;
      console.log("cardId:     ",id);
      if(!id) {
        console.log("没有cardId");
        this.setState({
          virtual:0
        });
        return
      } else{
        id = parseInt(id);
      }

      this.props
        .dispatch({
          type: 'mall/virtualList',
          payload: {
            QueryVirtual: {
              id
            }
          }
        }).then(res=>{
        console.log("carId result:",res);
        this.setState({
          virtual:res.value
        });
      }).catch(err=>console.log(err))
    }).catch(err => err);
  };

  /**
   * 获取用户支付记录
   * @param p
   * @param queryOption
   * @param timeSpan
   */
  getAllPayRecord = (p = 0, queryOption = {}, timeSpan = {
    "startTime": "2000/01/01",
    "endTime": "2099/12/31"
  }) => {
    this.props
      .dispatch({
        type: 'mall/getAllPayRecord',
        payload: {
          query: {
            limit: 10,
            page: p
          },
          queryOption: queryOption,
          timeSpan: timeSpan
        }
      }).catch(err => err);
  };

  /**
   * 处理订单状态
   * @param status  0: 已下单 1: 已完成 2: 已付款 3.已确认 4.已取消
   * @returns {*}
   */
  handleOrderStatus = status => {
    const orderStatus = {
      0: '已下单',
      1: '已完成',
      2: '已付款',
      3: '已确认',
      4: '已取消',
      5: '已发货'
    };
    return orderStatus[status];
  };

  getTaskTime = (strDate)=>{
    let date = new Date(strDate);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let str = y+"-"+m+"-"+d+" "+h+":"+minute;
    return str;
  };

  render() {
    const { mall: { orderList, orderListMeta, allPayRecord, allPayRecordMeta } } = this.props;
    const {virtual} = this.state;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '订单列表',
        href: '/mall/order-list'
      },
      {
        title: '订单详情',
        href: '/mall/order-detail'
      }
    ];


    if(orderList.length>0&&orderList[0].status == 2){
      this.payId = orderList[0].payId;
    }


    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {}
      };

      return obj;
    };
    const goodsColumns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '商品规格',
        dataIndex: 'skuSize',
        key: 'skuSize',
        render:record=>{
          if(record){
            const size = record.split('-');
            return <span>{size[0]}-{colorMap[size[1]]}</span>
          }
          return <span>{record}</span>
        }
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: '数量（件）',
        dataIndex: 'count',
        key: 'count'
      },
      {
        title: '金额',
        render: record => {
          if(record.price){
            const amount = record.price * record.count;
            return <span>{amount}</span>;
          }
          return <span></span>
        }
      }
    ];
    let countTotal = 0;
    let goodsData;
    if(orderList.length>0){
      goodsData = orderList[0].gidJson;
      if(goodsData&&goodsData.length>0){
        goodsData.forEach(item=>{
          countTotal+=item.count;
          if(item.donate&&item.donate.length>0){
            item.children = item.donate;
            item.children.forEach(childrenItem=>{
              countTotal+=childrenItem.count;
            })
          }

        })
      }
    }else{
      goodsData=[];
    }
    console.log("商品信息:        ",goodsData);

    let payData;
    if(allPayRecord.length===1){
      payData = JSON.parse(allPayRecord[0].returnCode);
    }

    console.log("支付信息：       ",payData);

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card title="订单信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 32 }}>
            <Description term="订单编号">{orderList.length > 0 && orderList[0].sku}</Description>
            <Description term="买家账号">{orderList.length > 0 && orderList[0].consignee}</Description>
            <Description term="下单时间">
              {moment(orderList.length > 0 && orderList[0].buyTime).format('YYYY-MM-DD HH:mm:ss')}
            </Description>
            <Description term="订单状态">
              <b>{this.handleOrderStatus(orderList.length > 0 && orderList[0].status)}</b>
            </Description>
          </DescriptionList>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            defaultExpandAllRows={true}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey={(record=>{
              return record.gid+Math.random(0,10000)
            })}
          />
          <DescriptionList>
            <Description term="邮费"><b>{orderList.length > 0 && orderList[0].postPrice>=0?orderList[0].postPrice:"查无数据"}</b></Description>
            <Description term="优惠券"><b>{virtual}</b></Description>
            <Description term="应付金额"><b>{orderList.length > 0 && orderList[0].totalMoney>=0?orderList[0].totalMoney:"查无数据"}</b></Description>
          </DescriptionList>
        </Card>
        {orderList.length > 0 && orderList[0].status !== 0 &&
        <Card title="支付信息" style={{marginBottom: 24}} bordered={false}>
          <DescriptionList>
            <Description term="支付方式">{allPayRecord.length > 0 && allPayRecord[0].platformName?allPayRecord[0].platformName:"查无数据"}</Description>
            <Description term="支付账号">{payData&&payData.buyer_logon_id}</Description>
            <Description
              term="付款时间">{payData&&payData.gmt_payment}</Description>
            <Description term="交易号">{allPayRecord.length > 0 && allPayRecord[0].out_trade_no ? allPayRecord[0].out_trade_no : '查无数据'}</Description>
            <Description
              term="实付金额">{payData&&payData.buyer_pay_amount}</Description>
          </DescriptionList>
        </Card>
        }
        {orderList.length>0&&orderList[0].status === 1&&
        <Card title="物流信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList>
            <Description term="物流公司">{orderList.length > 0 && orderList[0].sender?orderList[0].sender:"查无数据"}</Description>
            <Description term="运单号">{orderList.length > 0 && orderList[0].expressNumber?orderList[0].expressNumber:"查无数据"}</Description>
            <Description term="发货时间">{orderList.length > 0 && orderList[0].sendTime?this.getTaskTime(orderList[0].sendTime):"查无数据"}</Description>
            <Description term="收货地址">
              {orderList.length > 0 && orderList[0].address?orderList[0].address:"查无数据"}
            </Description>
          </DescriptionList>
        </Card>}

      </PageHeaderLayout>
    );
  }
}
