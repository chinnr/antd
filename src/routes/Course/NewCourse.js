import React, { PureComponent } from "react";
import { Form, Card } from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import CourseForm from './components/CourseForm';

export default class NewCourse extends PureComponent {

  render() {
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <CourseForm/>
        </Card>
      </PageHeaderLayout>
    );
  }
}
