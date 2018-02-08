import React, { PureComponent } from 'react';
import { Card, Form, Table, Input, Popconfirm, Divider, Button, Icon, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ team }) => ({team}))
export default class TeamList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '团名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '团部级别',
        dataIndex: 'groupLevel',
        key: 'groupLevel',
      },
      {
        title: '成立时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text, record) => moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '团长电话',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record) => record.head.phone,
      },
    ];
    this.state = {
      data:[]
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: "team/getAllTeams",
      payload: {
        query: {limit:10},
      }
    }).catch(err=>err)
  }

  render(){
    const {teams} = this.props.team;
    console.log("teams==>", teams);
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table bordered rowKey={record => record.gid} dataSource={teams} columns={this.columns} />
        </Card>
      </PageHeaderLayout>
    )
  }
}
