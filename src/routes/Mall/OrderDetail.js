import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './index.less';
import moment from 'moment';

const { Description } = DescriptionList;

@connect(({ mall }) => ({ mall }))
export default class BasicProfile extends Component {
  componentDidMount() {
    const reg = /\/order-detail\/(.+)/;
    const id = this.props.location.pathname.match(reg)[1];
    const queryOption = {
      id: id
    };
    console.log('路由参数: ', this.props.location.pathname, id);
    this.getOrderDetail(0, queryOption);
    this.getAllPayRecord(0, queryOption);
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
      })
      .catch(err => err);
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
      })
      .catch(err => err);
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
      4: '已取消'
    };
    return orderStatus[status];
  };

  render() {
    const { mall: { orderList, orderListMeta, allPayRecord, allPayRecordMeta } } = this.props;
    console.log("this.props order detail==>", this.props.mall);
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
    let goodsData = orderList.length > 0 ? orderList[0].gidJson : [];
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {}
      };

      return obj;
    };
    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'gid',
        key: 'gid'
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name'
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
          const amount = record.price * record.count;
          return <span>{amount}</span>;
        }
      }
    ];
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
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="gid"
          />
          <DescriptionList>
            <Description term="邮费">6.00</Description>
            <Description term="优惠券">-10.00</Description>
            <Description term="应付金额"><b>20.00</b></Description>
          </DescriptionList>
        </Card>
        <Card title="支付信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList>
            <Description term="支付方式">付小小</Description>
            <Description term="支付账号">18100000000</Description>
            <Description term="付款时间">菜鸟仓储</Description>
            <Description term="交易号">
              浙江省杭州市西湖区万塘路18号
            </Description>
            <Description term="实付金额">无</Description>
          </DescriptionList>
        </Card>
        <Card title="物流信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList>
            <Description term="物流公司">付小小</Description>
            <Description term="运单号">18100000000</Description>
            <Description term="发货时间">2018-03-18</Description>
            <Description term="收货地址">
              {orderList.length > 0 && orderList[0].address}
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
