import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Input, DatePicker, Upload, Button, Icon, Select, message } from 'antd';
import { thumbnailPath, rootUrl } from "../../utils/constant";
import GoodsTypeTable from './GoodsTypeTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;

export default class MallAdvertising extends PureComponent {
  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '商品管理',
        href: '/mall/goods-list'
      },
      {
        title: '添加商品',
        href: '/mall/goods-add'
      }
    ];
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <h1>广告位  updateDiscovery</h1>
        </Card>
      </PageHeaderLayout>
    )
  }
}
