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
import TableForm from "./components/TableForm";

@connect(({ team }) => ({ team }))
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
    this.coachs = values.coachList;
  };

  render() {
    const breadcrumbList = [
      {
        title: "首页",
        href: "/"
      },
      {
        title: "团部列表",
        href: "/team/list"
      },
      {
        title: "教官管理",
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

    this.coachs.forEach((item)=>{
      item.key = Math.random(0,20000);
    })

    const {getFieldDecorator} = this.props.form;


    return(
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false} title={`${this.name} - 常驻教官`}>
          {getFieldDecorator('members', {
            initialValue: this.coachs,
          })(<TableForm gid={this.gid} />)}
        </Card>

      </PageHeaderLayout>

    )
  }
}
