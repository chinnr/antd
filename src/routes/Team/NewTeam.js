import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './team.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class NewTeam extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("NewTeam==>", values);
        const formHead = {username: values.username, password: values.password};
        const formGroup = {
          name: values.name,
          province: "",
          city: "",
          district: "",
          address: "",
          longitude: "",
          latitude: ""
        };
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="团名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入团名称',
                }],
              })(
                <Input placeholder="团名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团部级别"
            >
                {getFieldDecorator('level', {
                  initialValue: '4'
                })(
                  <Select
                    placeholder="请选择团部级别"
                  >
                    <Option value="1">海狸</Option>
                    <Option value="2">小狼</Option>
                    <Option value="3">探索</Option>
                    <Option value="4">乐扶</Option>
                  </Select>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="成立时间"
            >
              {getFieldDecorator('createTime', {
                rules: [{
                  required: true, message: '请选择起止日期',
                }],
                initialValue: moment(new Date(), 'YYYY-MM-DD')
              })(
                <DatePicker style={{ width: '100%' }} placeholder={'成立时间'} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择地址"
            >
              {getFieldDecorator('address', {
                rules: [{
                  required: true, message: '请选择起止日期',
                }],
              })(
                <Input placeholder="团名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团长账号"
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: '请输入团长账号',
                }],
              })(
                <Input placeholder="团长账号" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团长密码"
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入团长密码',
                }],
              })(
                <Input placeholder="团长密码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团长电话"
            >
              {getFieldDecorator('phone', {
                rules: [{
                  required: true, message: '请输入团长电话',
                }],
              })(
                <Input placeholder="团长电话" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              {/*<Button style={{ marginLeft: 8 }}>保存</Button>*/}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
