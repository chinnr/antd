import React, { PureComponent } from 'react';
import { Card, Form, Table, Input, Popconfirm, Divider, Button, Icon, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class PostList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '标题',
        dataIndex: 'name',
        render: (text, record) => this.renderColumns(text, record, 'title'),
      },
      {
        title: '发布时间',
        dataIndex: 'createTime',
        render: (text, record) => this.renderColumns(text, record, 'createdAt'),
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
