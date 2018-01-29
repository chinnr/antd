import React, { PureComponent } from 'react';
import { Card, Form, Tabs,Icon, Input, Button, Checkbox, InputNumber } from 'antd';
import { connect } from 'dva';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CourseInfo extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem
          {...formItemLayout}
          label="课程名称">
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入课程名称!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="课程主题">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入课程主题!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="课时券">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '课时券!' }],
          })(
            <InputNumber min={1} max={10} defaultValue={1000000} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="可签到次数">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '可签到次数!' }],
          })(
            <InputNumber min={1} max={10} defaultValue={1000000} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '备注!' }],
          })(
            <TextArea rows={4} />
          )}
        </FormItem>
        <FormItem>
          <div>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>是否使用代金券</Checkbox>
            )}
          </div>
          <Button type="primary" htmlType="submit" className="login-form-button">
            取消
          </Button>
          <Button type="primary" htmlType="submit" className="login-form-button">
            确定
          </Button>
        </FormItem>
      </Form>
    )
  }
}
export default Form.create()(CourseInfo);