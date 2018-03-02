import React, { Component } from "react";
import { Card, Table, Divider, Form, Popconfirm } from "antd";
import { connect } from "dva";
import {routerRedux} from "dva/router";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import {handleLevel, handleSore, handleStage} from "../../utils/utils";

@connect(({ course }) => ({ course }))
@Form.create()
export default class CourseTempalteList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "课程类型",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "课程级别",
        dataIndex: "level",
        key: "level",
      },
      {
        title: "课程阶段",
        dataIndex: "stage",
        key: "stage",
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
        title: "操作",
        dataIndex: "option",
        key: "option",
        render: (text, record) => (
          <span>
            <a onClick={() => this.goToPage(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该证章?"
              onConfirm={() => this.confirmDelete(record)}
              onCancel={() => this.cancelDelete()}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];
    this.state = {
      data: [],
      visible: false,
      username: ''
    };
  }

  // 跳转到修改编辑页面
  goToPage = (record) => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: "/team/"+path,
    //     query: {
    //       record: record
    //     }
    //   })
    // );
  };

  // 确认删除该模板
  confirmDelete = (record) => {
    // this.props.dispatch({
    //   type: "post/updatePost",
    //   payload: {
    //     argv: {
    //       id: id,
    //       isActive: false,
    //     }
    //   }
    // }).catch(err => err)
  };

  // 取消删除
  cancelDelete = () => {
    return false;
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
