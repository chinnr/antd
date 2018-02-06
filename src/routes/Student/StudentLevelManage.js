import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const columns = [
  {
    title: '级别名称',
    dataIndex: 'name',
  },
  {
    title: '年龄段起',
    dataIndex: 'ageFrom',
  },
  {
    title: '年龄段止',
    dataIndex: 'ageTo',
  },
  {
    title: '级别标志',
    dataIndex: 'owner',
  },
  {
    title: '级别说明',
    dataIndex: 'comment',
  },
  {
    title: '备注',
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
class StudentLevelManage extends PureComponent {
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
      <PageHeaderLayout title="学员级别管理">
        <Card bordered={false}>
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

export default StudentLevelManage;

