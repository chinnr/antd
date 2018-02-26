import React, { PureComponent } from "react";
import { Card, Table, Pagination } from "antd";
import { connect } from "dva";
import moment from "moment";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";

@connect(({ team }) => ({ team }))
export default class TeamList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "团名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "团账号",
        dataIndex: "username",
        key: "username",
        render: (text, record) => record.head.name
      },
      {
        title: "团部级别",
        dataIndex: "groupLevel",
        key: "groupLevel",
        render: (text, record) => this.handleGroupLevel(record.groupLevel)
      },
      {
        title: "成立时间",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text, record) => moment(record.createdAt).format("YYYY-MM-DD")
      },
      {
        title: "团长电话",
        dataIndex: "phone",
        key: "phone",
        render: (text, record) => record.head.phone
      },
      {
        title: "已加入人数",
        dataIndex: "numJoin",
        key: "numJoin",
      }
    ];
    this.state = {
      data: []
    };
  }

  handleGroupLevel = level => {
    let name = "";
    switch (level) {
      case "level1":
        name = "海狸";
        break;
      case "level2":
        name = "小狼";
        break;
      case "level3":
        name = "探索";
        break;
      case "level4":
        name = "乐扶";
        break;
      default:
        name = level;
        break;
    }
    return name;
  };

  // 处理翻页
  onPagination = p => {
    this.getAllTeams(p - 1);
  };

  // 获取团列表
  getAllTeams = (p = 0) => {
    this.props
      .dispatch({
        type: "team/getAllTeams",
        payload: {
          query: { limit: 10, page: p }
        }
      })
      .catch(err => err);
  };

  componentWillMount() {
    this.getAllTeams();
  }

  render() {
    const { teams, teamsMeta } = this.props.team;
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table
            bordered
            rowKey={record => record.gid}
            pagination={false}
            dataSource={teams}
            columns={this.columns}
          />
          <div style={{ marginTop: 10 }}>
            <Pagination
              defaultCurrent={1}
              total={teamsMeta.count}
              onChange={p => this.onPagination(p)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
