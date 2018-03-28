import React, { PureComponent } from "react";
import { connect } from "dva";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Modal,
  Icon
} from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import TableForm from "./TableForm";

@connect(({ team, student }) => ({ team, student }))
@Form.create()
export default class PointCoach extends PureComponent {
  constructor(){
    super();
    this.state = {
      coachFormVisible:false
    }
    this.gid='';
    this.name='';
  }

  componentWillMount() {
    this.getListParams();
  }

  // 获取团信息字段
  getListParams = () => {
    let values = {};
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      values = JSON.parse(localStorage.getItem("teamInfo")).record;
    } else {
      // 有 query
      localStorage.setItem(
        "teamInfo",
        JSON.stringify(this.props.location.query)
      );
      values = this.props.location.query.record;
    }
    console.log("record===============>", values);
    this.gid = values.gid;
    this.name = values.name;
  };

  render() {
    const breadcrumbList = [
      {
        title: "首页",
        href: "/"
      },
      {
        title: "团队列表",
        href: "/team/list"
      },
      {
        title: "指定教官",
        href: "/team/point-coach"
      }
    ];

    const tableData = [{
      key: '1',
      icon: '00001',
      name: 'John Brown',
      phone: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      icon: '00002',
      name: 'Jim Green',
      phone: 'London No. 1 Lake Park',
    }, {
      key: '3',
      icon: '00003',
      name: 'Joe Black',
      phone: 'Sidney No. 1 Lake Park',
    }];

    const {getFieldDecorator} = this.props.form;


    return(
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false} title={`${this.name} / 教官管理`}>
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TableForm gid={this.gid} />)}
        </Card>

      </PageHeaderLayout>

    )
  }
}
