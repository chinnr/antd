import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Input } from 'antd';
import { successNotification } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form;

@connect(({ post }) => ({ post }))
@Form.create()
export default class NewClasses extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleCreate = e => {
    e.preventDefault();
    console.log('handleCreate this.props: ', this.props);
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form : ', values);
        dispatch({
          type: 'post/createClasses',
          payload: {
            argv: {
              name: values.name
            }
          }
        })
          .then(() => {
            successNotification('新建课程类型成功', function() {});
            form.resetFields();
          })
          .catch(err => err);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Form onSubmit={this.handleCreate} className="login-form">
            <FormItem>{getFieldDecorator('name')(<Input placeholder="请输入文章类型" />)}</FormItem>
            <FormItem style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
