import React, { PureComponent } from 'react';
import { Card, Form, Table, Input, Popconfirm, Divider, Button, Icon, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class TeamList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '团名称',
        dataIndex: 'name',
        render: (text, record) => this.renderColumns(text, record, 'name'),
      },
      {
        title: '团部级别',
        dataIndex: 'level',
        render: (text, record) => this.renderColumns(text, record, 'level'),
      },
      {
        title: '成立时间',
        dataIndex: 'createTime',
        render: (text, record) => this.renderColumns(text, record, 'createTime'),
      },
      {
        title: '团长电话',
        dataIndex: 'phone',
        render: (text, record) => this.renderColumns(text, record, 'phone'),
      },
    ];
    this.state = {
      data:[]
    };
  }
  render(){
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table bordered dataSource={this.state.data} columns={this.columns} />
        </Card>
      </PageHeaderLayout>
    )
  }
}
