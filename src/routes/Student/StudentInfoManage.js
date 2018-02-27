import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const Search = Input.Search;

const columns = [
  {
    title: '学员名称',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'ageFrom',
  },
  {
    title: '所属旅团',
    dataIndex: 'ageTo',
  },
  {
    title: '注册时间',
    dataIndex: 'owner',
  },
  {
    title: '消费总额',
    dataIndex: 'comment',
  },
  {
    title: '参与活动次数',
    dataIndex: 'description',
  },
  {
    title: '操作',
    render: () => (
      <Fragment>
        <a href="">修改</a>
        <Divider type="vertical" />
        <a href="">删除</a>
      </Fragment>
    ),
  },
];

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
class StudentInfoManage extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch'
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout title="学员信息管理">
        <Card bordered={false}>
          <Button type="primary" style={{marginBottom: '10px'}}>
            <Icon type="plus" />新建
          </Button>
          <Search placeholder="input search text" style={{width: 200, float: 'right'}} />
          <div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              columns={columns}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default StudentInfoManage;

