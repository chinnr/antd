import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {DescriptionList,Description} from '../../components/DescriptionList';
import styles from './index.less';
import moment from 'moment';

@connect(({ mall }) => ({ mall }))

export default class OrderSendOut extends Component {
  componentDidMount() {
    const reg = /\/order-send\/(.+)/;
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
      })
      .catch(err => err);
  };

  render (){
    const { mall: { orderList } } = this.props;

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
        title: '订单发货',
        href: '/mall/order-send'
      }
    ];

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <DescriptionList
            size="large"
            title="订单信息"
            style={{ marginBottom: 32 }}
          >
            <Description term="订单编号">{orderList.length > 0 && orderList[0].sku}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  };
}
