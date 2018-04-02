import React, { PureComponent } from "react";
import { connect } from "dva";
import { Form, Input, Select, Button, Card, Modal, Icon } from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import CourseCommon from "./components/CourseDetailCommon";
import course from "../../models/course";
import { studentDetail } from "../../services/student";

@connect(({ course, student }) => ({ course, student }))
export default class CourseDtail extends PureComponent {
  constructor() {
    super();
    this.state = {
      instructors:[]
    };
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
      .then(res => {
        let arr = [];
        res.instructors.forEach(uid => {
          this.props
            .dispatch({
              type: "student/getStudentDetail",
              payload: uid
            })
            .then(res => {
              const {icon,realName} = res;
              arr.push({icon,realName});
              this.setState({
                instructors: [...arr]
              })
            });
        });
      })
      .catch(err => err);


  }

  componentWillReceiveProps() {}

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


    //课程详情数据成功请求后
    let common = null;
    if (JSON.stringify(courseDetail).length > 2) {
      common = <CourseCommon {...courseDetail} ins={this.state.instructors} />;
    } else {
      common = <p>暂无数据</p>;
    }

    // if(JSON.stringify(this.props.student.studentDetail).length>2){
    //   console.log(this.props.student.studentDetail);
    // }
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        {common}
      </PageHeaderLayout>
    );
  }
}
