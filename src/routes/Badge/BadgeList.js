import React, { PureComponent } from "react";
import { Card, Table, Pagination, Divider, Popconfirm, notification } from "antd";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { rootUrl, thumbnailPath } from "../../utils/constant";
import styles from "./BadgeList.less";
import { routerRedux } from "dva/router";
import {handleLevel, handleStage} from "../../utils/utils";

@connect(({ badge }) => ({ badge }))
export default class BadgeList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "证章名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "证章级别",
        dataIndex: "level",
        key: "level",
        render: (text, record) => handleLevel(record.level)
      },
      {
        title: "证章阶段",
        dataIndex: "stage",
        key: "stage",
        render: (text, record) => handleStage(record.stage)
      },
      {
        title: "证章分类",
        dataIndex: "class",
        key: "class",
        render: (text, record) => this.handleBadgeClass(record.class)
      },
      {
        title: "正常证章图片",
        dataIndex: "normalImg",
        key: "normalImg",
        render: (text, record) => (
          <div className={styles.img_item}>
            <img
              className={styles.img}
              src={rootUrl + thumbnailPath + record.normalImg}
            />
          </div>
        )
      },
      {
        title: "灰色证章图片",
        dataIndex: "grayImg",
        key: "grayImg",
        render: (text, record) => (
          <div className={styles.img_item}>
            <img
              className={styles.img}
              src={rootUrl + thumbnailPath + record.grayImg}
            />
          </div>
        )
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
              onConfirm={() => this.confirmDelete(record.bid)}
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
      data: []
    };
  }
  // 处理证章分类
  handleBadgeClass = cl => {
    let name = "";
    switch (cl) {
      case "class1":
        name = "基础章";
        break;
      case "class2":
        name = "兴趣章";
        break;
      case "class3":
        name = "技能章";
        break;
      case "class4":
        name = "活动章";
        break;
      case "class5":
        name = "服务章";
        break;
      default:
        name = cl;
        break;
    }
    return name;
  };

  // 处理证章阶段
  handleBadgeStage = stage => {
    let name = "";
    switch (stage) {
      case "stage1":
        name = "阶段一";
        break;
      case "stage2":
        name = "阶段二";
        break;
      case "stage3":
        name = "阶段三";
        break;
      case "stage4":
        name = "阶段四";
        break;
      default:
        name = stage;
        break;
    }
    return name;
  };

  // 处理证章级别
  handleBadgeLevel = level => {
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

  /**
   * 点击编辑
   * @param record  record 要修改的某一个证章
   */
  goToPage = record => {
    // console.log("id==>", id);
    this.props.dispatch(
      routerRedux.push({
        pathname: "/badge/new",
        query: {
          record: record
        }
      })
    );
  };

  // 删除证章
  confirmDelete = id => {
    console.log("删除 bid: ", id);
    this.props.dispatch({
      type: "badge/deleteBadge",
      payload: {bid: id}
    }).then(()=>{
      notification["success"]({
        message: "删除成功!",
        duration: 2
      });
      this.getAllBadges();
    }).catch(err => {})
  };

  cancelDelete = () => {
    return false;
  };

  // 处理翻页
  onPagination = p => {
    this.getAllBadges(p - 1);
  };

  // 获取团列表
  getAllBadges = (p = 0) => {
    this.props
      .dispatch({
        type: "badge/getAllBadges",
        payload: {
          query: { limit: 10, page: p }
        }
      })
      .catch(err => err);
  };

  componentWillMount() {
    this.getAllBadges();
  }

  render() {
    const { badges, badgesMeta } = this.props.badge;
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table
            bordered
            rowKey={record => record.bid}
            pagination={false}
            dataSource={badges}
            columns={this.columns}
          />
          <div style={{ marginTop: 10 }}>
            <Pagination
              defaultCurrent={1}
              total={badgesMeta.count}
              onChange={p => this.onPagination(p)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
