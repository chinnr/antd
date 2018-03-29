import React, { PureComponent } from "react";
import { connect } from "dva";
import { Form, Input, Select, Button, Card, Modal, Icon } from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import CourseCommon from "./components/CourseDetailCommon";

@connect(({ course }) => ({ course }))
export default class CourseDtail extends PureComponent {
  constructor() {
    super();
  }

  getCourseId = () => {
    let _id;
    if (this.props.location.query === undefined) {
      _id = localStorage.getItem("courseId");
    } else {
      localStorage.setItem("courseId", "");
      localStorage.setItem("courseId", this.props.location.query.courseId);
      _id = this.props.location.query.courseId;
    }
    return _id;
  };

  componentWillMount() {
    const _id = this.getCourseId();
    this.props
      .dispatch({
        type: "course/courseDetail",
        payload: { id: _id }
      })
      .catch(err => err);
  }

  render() {
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
    const { course: { courseDetail } } = this.props;

    let common = null;
    if (JSON.stringify(courseDetail).length > 2) {
      common =  <CourseCommon {...courseDetail} />;
    } else {
      common =  <p>暂无数据</p>;
    }

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        {common}
      </PageHeaderLayout>
    );
  }
}
