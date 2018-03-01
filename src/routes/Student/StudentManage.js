import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const columns = [
  {
    title: '用户名',
    render: (record) => (<span>{record.base.username}</span>)
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '编号',
    dataIndex: 'number',
  },
  {
    title: '阶段',
    dataIndex: 'level',
  },
  {
    title: '团属',
    render: (record) => (record.group && <span>{record.group.name}</span>)
  },
  {
    title: '职务',
    render: (record) => (
      record.isLead ?
      <span>{ record.leadList.join(',') }</span> : '-'
    )
  },
  {
    title: '操作',
    render: () => (
      <Fragment>
        <a href="">重置密码</a>
        <Divider type="vertical" />
        <a href="">查看详情</a>
      </Fragment>
    ),
  },
];

@connect(({ student, loading }) => ({
  student,
  loading: loading.models.student,
}))
class StudentManage extends PureComponent {

  handleTableChange = ({current, pageSize}) => {
    console.log('page ', current);
    const { dispatch } = this.props;
    dispatch({
      type: 'student/getStudentList',
      payload: {
        page: current - 1,
        limit: pageSize
      }
    });
  };

  render() {
    const { loading, student } = this.props;
    console.log('list ', student.studentList);
    const pagination = {
      total: student.count,
      pageSize: student.limit,
      current: student.page + 1
    };
    return (
      <PageHeaderLayout title="学员管理">
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              dataSource={student.studentList}
              rowKey={record => record.uid}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default StudentManage;

