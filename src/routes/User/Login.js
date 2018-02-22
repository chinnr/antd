/*
 * @Author: littlestone
 * @Date: 2018-02-22 12:03:00
 * @Last Modified by: littlestone
 * @Last Modified time: 2018-02-22 12:20:52
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import Divider from 'antd/lib/divider';
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
export default class LoginPage extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'login/login',
          payload: {
            ...values,
          },
        }).catch(err => err);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('adminName', {
              rules: [{ required: true, message: '请输入管理员账号!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入管理员密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <div>
              <a href="">忘记密码?</a>
            </div>
            <Button type="primary" style={{width: '100%'}} htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
