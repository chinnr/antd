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

@connect(({ course }) => ({ course }))

export default class CourseDtail extends PureComponent {
  constructor(){
    super();
  }

  render(){
    const breadcrumbList = [
      {
        title: "首页",
        href: "/"
      },
      {
        title: "开课列表",
        href: "/course/course-record"
      },
      {
        title: "开课预览",
        href: "/course/course-detail"
      }
    ];
    return(
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >

      </PageHeaderLayout>
    )
  }
}
