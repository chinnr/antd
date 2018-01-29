import React, { PureComponent } from 'react';
import { Card, Form, Tabs,Icon, Input, Button, Checkbox, InputNumber } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CourseInfo from './components/CourseInfo';
import CourseIntroduce from './components/CourseIntroduce';
import 'react-quill/dist/quill.snow.css';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CreateTemplate extends PureComponent {
  handleTabChange = (key) => {
    console.log("handleTabChange ==> ", key);
  };
  render() {
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Tabs defaultActiveKey="2" onChange={()=>this.handleTabChange()}>
            <TabPane tab="课程信息" key="1">
              <CourseInfo />
            </TabPane>
            <TabPane tab="课程介绍" key="2">
              <CourseIntroduce />
            </TabPane>
            <TabPane tab="报名须知" key="3">报名须知</TabPane>
            <TabPane tab="课程级别" key="3">课程级别</TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    )
  }
}
export default CreateTemplate;