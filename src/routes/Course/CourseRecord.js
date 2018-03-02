import React, { Component } from "react";
import { Card, Table, Divider, Form, Popconfirm } from "antd";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import {routerRedux} from "dva/router";

@connect(({ course }) => ({ course }))
@Form.create()
export default class CourseRecord extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "开课时间",
        dataIndex: "createdAt",
        key: "createdAt"
      },
      {
        title: "团名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "课程主题",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "服务范围",
        dataIndex: "score",
        key: "score",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
      }
    ];
    this.state = {
      data: [],
      visible: false,
      username: ''
    };
  }

  // 跳转到修改编辑页面
  goToPage = (record, path) => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: "/team/"+path,
    //     query: {
    //       record: record
    //     }
    //   })
    // );
  };

  // 处理翻页
  onPagination = p => {
    console.log("处理翻页==>", p);
  };

  render() {
    const pagination = {
      total: 26,
      pageSize: 10,
      current: 1
    };
    // const { courseTempList, courseTempListMeta } = this.props.course;

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table
            bordered
            rowKey={record => record.gid}
            dataSource={[]}
            columns={this.columns}
            pagination={pagination}
            onChange={p => this.onPagination(p)}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
