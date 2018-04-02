import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Input, DatePicker, Upload, Button, Icon, Select, message, Radio, notification, Divider, InputNumber } from 'antd';
import moment from 'moment';
import { thumbnailPath, rootUrl } from "../../utils/constant";
import GoodsTypeTable from './GoodsTypeTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {routerRedux} from "dva/router";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsType extends PureComponent {

  state = {
    selectedRows: [],
    visible: false,
    fileList:[],
    previewVisible:false,
    previewImage:'',
  };

  columns = [
    {
      title: '类型名称',
      dataIndex: 'name'
    },
    {
      title: '排序',
      dataIndex: 'level'
    },
    {
      title: '类型图片',
      render: (record) => (
        <span><img style={{ width: 100, height: 100 }} src={record.typeImg} /></span>
      )
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <a onClick={() => this.goToPage('editType', record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.deleteGoodsType(record)}>删除</a>
        </Fragment>
      )
    }
  ];
  goodsType = {};

  handleSelectRows = (rows) => {
    console.log('rrrr 33333 ', rows)
    this.setState({
      selectedRows: rows
    });
  };

  // 前往新建 编辑 商品类型
  goToPage = (action, payload) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/mall/type-edit',
        query: {
          action: action,
          payload: payload
        }
      })
    );
  };

  // 删除商品类型
  deleteGoodsType = (record) => {
    const { dispatch } = this.props;
    const { mall:{goodsTypeMeta} } = this.props;
    const {} = this.props;
    dispatch({
      type: 'mall/deleteGoodsType',
      payload: {
        tid: record.tid
      }
    })
      .then(() => {
        this.setState({
          visible: false
        }, () => {
          notification["success"]({
            message: '操作成功',
            duration: 2
          });
          this.getGoodsTypeList(goodsTypeMeta.page)
        })
      })
  };

  // 获取类型列表
  getGoodsTypeList = (p) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page: p,
        limit: 10,
        sort:["-createdAt"]
      }
    })
  };

  handleTableChange = (n) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page: n.current - 1,
        limit: 10,
        sort:["-createdAt"]
      }
    })
  };

  render() {
    const { mall, loading } = this.props;
    const { selectedRows } = this.state;
    const list = mall.goodsType;
    const pagination = {
      current: mall.goodsTypeMeta.page + 1,
      pageSize: mall.goodsTypeMeta.limit,
      total: mall.goodsTypeMeta.count
    };
    const data = { list, pagination };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div style={{marginBottom: '10px'}}>
              <Button icon="plus" type="primary" onClick={() => this.goToPage('newType', {})}>添加类型</Button>
            </div>
            <GoodsTypeTable
              loading={loading}
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRows}
              columns={this.columns}
              data={data}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default GoodsType;
