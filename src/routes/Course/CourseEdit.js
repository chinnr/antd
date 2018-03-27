import React, { PureComponent } from "react";
import { Form, Card } from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import CourseEditForm from './components/CourseEditForm';

export default class CourseEdit extends PureComponent {

  render() {
    console.log("CourseEdit  this.props ==>", this.props);
    const {location} = this.props;
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <CourseEditForm location={location}/>
        </Card>
      </PageHeaderLayout>
    );
  }
}
