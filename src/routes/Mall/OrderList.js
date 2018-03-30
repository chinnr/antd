import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment/moment';
import { Row, Col, Card, Form, Input, Select, Button, Table, InputNumber, DatePicker, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './OrderList.less';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ mall }) => ({ mall }))
@Form.create()
export default class OrderList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    formValues: {},
  };
  queryOption = {};
  timeSpan = {};

  /**
   * 获取订单列表
   * @param p 页码
   * @param queryOption 查询条件
   * @param timeSpan 时间范围
   */
  getOrderList = (p=0,queryOption={}, timeSpan = {
    "startTime": "2000/01/01",
    "endTime": "2099/12/31"
  }) => {
    this.props.dispatch({
      type: 'mall/orderList',
      payload: {
        query: {
          limit: 10,
          page: p
        },
        queryOption: queryOption,
        timeSpan: timeSpan
      }
    }).catch(err=>err)
  };

  /**
   * 重置表单
   */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    /*dispatch({
      type: 'rule/fetch',
      payload: {},
    });*/
  };

  /**
   * 按条件搜索
   * @param e
   */
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form, mall:{orderListMeta} } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      console.log("fieldsValue: ", fieldsValue);
      const queryOption = {
        sku: fieldsValue.sku,
        consignee: fieldsValue.consignee,
        status: fieldsValue.status,
      };
      this.queryOption = queryOption;
      if(fieldsValue.timeSpan === undefined){
        this.timeSpan = {
          "startTime": "2000/01/01",
          "endTime": "2099/12/31"
        };
      }else {
        const timeSpan = {
          startTime: moment(fieldsValue.timeSpan[0]).format("YYYY/MM/DD"),
          endTime: moment(fieldsValue.timeSpan[1]).format("YYYY/MM/DD")
        };
        this.timeSpan = timeSpan;
      }

      this.getOrderList(orderListMeta.page, queryOption, this.timeSpan)
    });
  };

  /**
   * 渲染查询表格
   * @returns {*}
   */
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="买家昵称">
              {getFieldDecorator('consignee')(
                <Input placeholder="请输入买家昵称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('sku')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select>
                  <Option value={0}>已下单</Option>
                  <Option value={1}>已完成</Option>
                  <Option value={2}>已付款</Option>
                  <Option value={3}>已确认</Option>
                  <Option value={4}>已取消</Option>
                </Select>
              )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="成交时间">
              {getFieldDecorator('timeSpan')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>

        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  /**
   * 选择行
   * @param selectedRowKeys
   */
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  /**
   * 翻页
   * @param p
   */
  onPagination = (p) => {
    console.log("翻页: ", p);
    if(JSON.stringify(this.queryOption).length > 2 || JSON.stringify(this.timeSpan) > 0) {
      console.log("有查询条件", this.queryOption)
      this.getOrderList(p-1, this.queryOption, this.timeSpan);
    }

    else {
      console.log("没有查询条件", this.queryOption)
      this.getOrderList(p-1);
    }
  };

  /**
   * 处理订单状态
   * @param status  0: 已下单 1: 已完成 2: 已付款 3.已确认 4.已取消
   * @returns {*}
   */
  handleOrderStatus = (status) => {
    const orderStatus = {
      0:'已下单',
      1:'已完成',
      2:'已付款',
      3:'已确认',
      4:'已取消',
    };
    return orderStatus[status];
  };

  /**
   * 发货
   * @param id=>id       status=>0: 已下单 1: 已完成 2: 已付款 3.已确认 4.已取消 5.发货
   */
  ship = ({id,status})=>{
    const { dispatch } = this.props;
  }

  /**
   * 前往订单详情页面
   * @param uid
   */
  goToDetail = (record) => {
    console.log('id==>', record);
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: `/mall/order-detail/${record.id}`,
    }));
  };

  render() {
    const { mall:{orderList, orderListMeta} } = this.props;
    const { loading, selectedRowKeys } = this.state;
    console.log("mall: ", this.props.mall.orderList);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      pageSize: 10,
      total: orderListMeta.count,
      onChange: p => this.onPagination(p)
    };
    const columns = [
      {
        title: '订单号',
        dataIndex: 'sku',
      },
      {
        title: '下单时间',
        render: (record) => {
          return (
            <span>
              {/*{record.buyTime}*/}
              {moment(record.buyTime).format('YYYY-MM-DD HH:mm')}
              </span>
          )
        }
      },
      {
        title: '商品',
        // dataIndex: 'gidJson',
        render: (record) => {
          return (
            <div>
              {record.gidJson.map((item,i) => {
                return (
                  <span key={i}>{item.name} x {item.count}</span>
                )
              })}
            </div>
          )
        }
      },
      {
        title: '买家',
        dataIndex: 'consignee',
      },
      {
        title: '交易状态',
        // dataIndex: 'status',
        render: (record) => {
          return <span>{this.handleOrderStatus(record.status)}</span>
        }
      },
      {
        title: '实收款',
        dataIndex: 'totalMoney',
      },
      {
        title: '操作',
        // dataIndex: 'option',
        render: (record) => {
          return (
            <div>
              <a onClick={() => this.goToDetail(record)}>详情</a>
              <Divider type="vertical" />
              <a onClick={() =>{this.ship(record)}}>发货</a>
            </div>
          )
        }
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <Table
              loading={loading}
              rowKey={record => record.sku}
              // rowSelection={rowSelection}
              dataSource={orderList}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
