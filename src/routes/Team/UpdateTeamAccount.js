import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { successNotification } from '../../utils/utils';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;

@connect(({ team }) => ({ team }))
@Form.create()
export default class UpdateTeamAccount extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: true,
      gid: ''
    };
  }

  // 点击弹窗取消
  handleCancel = e => {
    // console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  // 提交新建团信息
  handleSubmit = e => {
    e.preventDefault();
    const props = this.props;
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('表单 values ', values);
        this.props
          .dispatch({
            type: 'team/updateTeam',
            payload: {
              form: {
                nickname: values.nickname,
                phone: '86-' + values.phone
              },
              gid: this.state.gid
            }
          })
          .then(() => {
            successNotification('修改团账号成功!', function() {
              props.dispatch(routerRedux.push('/team/list'));
            });
            localStorage.removeItem('teamAccount');
          })
          .catch(err => err);
      }
    });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 获取路由传递的修改的团信息字段
  getTeamParams = () => {
    let values = {};
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      values = JSON.parse(localStorage.getItem('teamAccount')).record;
    } else {
      // 有 query
      localStorage.setItem(
        'teamAccount',
        JSON.stringify(this.props.location.query)
      );
      values = this.props.location.query.record;
    }
    let keys = Object.keys(values);
    this.setState({
      gid: values.gid
    });

    this.props.form.setFieldsValue({
      name: values.name,
      nickname: values.nickname,
      phone: values.head.phone ? values.head.phone.replace('86-', '') : ''
    });
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.getTeamParams();
  }

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '团队列表',
        href: '/team/list'
      },
      {
        title: '团账号修改',
        href: '/team/edit-account'
      }
    ];
    const { submitting } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    // Only show error after a field is touched.
    const usernameError =
      isFieldTouched('username') && getFieldError('username');
    const nicknameError =
      isFieldTouched('nickname') && getFieldError('nickname');
    const phoneError = isFieldTouched('phone') && getFieldError('phone');

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };

    return (
      <PageHeaderLayout
        title={null}
        content={null}
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              validateStatus={usernameError ? 'error' : ''}
              help={usernameError || ''}
              label="团长账号"
            >
              {getFieldDecorator('username', {
                initialValue: '1004',
                rules: [
                  {
                    required: true,
                    message: '请输入团长账号'
                  }
                ]
              })(<Input placeholder="团长账号" disabled={true} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={nicknameError ? 'error' : ''}
              help={nicknameError || ''}
              label="团长昵称"
            >
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: '请输入团长昵称'
                  }
                ]
              })(<Input placeholder="团长昵称" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={phoneError ? 'error' : ''}
              help={phoneError || ''}
              label="团长电话"
            >
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入团长电话'
                  }
                ]
              })(<Input placeholder="团长电话" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={this.hasErrors(getFieldsError())}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
