import React, { PureComponent } from 'react';
import { Card, Table,Pagination } from 'antd';
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

  // 处理翻页
  onPagination = (p) => {
    console.log("处理翻页==>", p);
    this.getAllTeams(p-1);
  };

  // 获取团列表
  getAllTeams = (p=0) => {
    this.props.dispatch({
      type: "team/getAllTeams",
      payload: {
        query: {limit:10, page: p},
      }
    }).catch(err=>err)
  };

  componentWillMount() {
    this.getAllTeams();
  }

  render(){
    const {teams, teamsMeta} = this.props.team;
    console.log("teams==>", teams);
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table bordered rowKey={record => record.gid} pagination={false} dataSource={teams} columns={this.columns} />
          <div style={{marginTop: 10}}>
            <Pagination defaultCurrent={1} total={teamsMeta.count} onChange={(p) => this.onPagination(p)}/>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
