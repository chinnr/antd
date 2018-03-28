import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Upload, Icon,Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { successNotification } from '../../utils/utils';
import { routerRedux } from 'dva/router';
import {message} from "antd/lib/index";
import {rootUrl,thumbnailPath} from "../../utils/constant";

const FormItem = Form.Item;

@connect(({ team }) => ({ team }))
@Form.create()
export default class UpdateTeamAccount extends PureComponent {
  constructor() {
    super();
    this.state = {
      fileList:[],
      previewVisible:false,
      previewImage:'',
      pswVisible:false,
      userName:'',
      gid: ''
    };
  }

  //修改密码弹出打开
  pswCancel=()=>{
    this.setState({pswVisible:false})
  }

  //修改密码弹出关闭
  pswModal=()=>{
    this.setState({pswVisible:true})
  }

  //修改密码提交
  pswSubmit=()=>{
    const form = this.props.form;
    const { username } = this.state;
    // console.log(form);
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props
          .dispatch({
            type: 'team/modifyTeamPsw',
            payload: {
              password: values.password,
              username
            }
          })
          .catch(err => {});
      }
      this.setState({ pswVisible: false });
    });
  }

  //关闭预览
  handleCancelPreview = ()=>{
    this.setState({ previewVisible: false })
  }

  //预览
  handlePreview = (file)=>{
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  //更换头像
  handleChange=(fileList)=>{
    this.setState({ fileList:fileList.fileList });
  }

  // 提交新建团信息
  handleSubmit = e => {
    e.preventDefault();
    const props = this.props;
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('表单 values ', values);
        let _icon;
        _icon = values.icon.fileList?values.icon.fileList[0].response.filename:values.icon[0].name;

        this.props
          .dispatch({
            type: 'team/updateTeam',
            payload: {
              form: {
                nickname: values.nickname,
                phone: '86-' + values.phone,
                icon: _icon
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
      console.log("values===============>>>",values);
    }
    this.setState({
      fileList: [
        {
          uid: Math.random(-100,0),
          name: "xxx",
          url: rootUrl + thumbnailPath + values.description.icon,
          status: "done"
        }
      ],
      userName:values.username
    });

    let keys = Object.keys(values);
    this.setState({
      gid: values.gid
    });

    this.props.form.setFieldsValue({
      name: values.name,
      nickname: values.nickname,
      phone: values.head.phone ? values.head.phone.replace('86-', '') : '',
      icon: [
        {
          uid: Math.random(-100,0),
          name: values.description.icon,
          url: rootUrl + thumbnailPath + values.description.icon,
          status: "done"
        }
      ]
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

    const {
      fileList,
      pswVisible,
      previewVisible,
      previewImage
    } = this.state;

    const propsObj = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      multiple: false
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
              label="团长头像"
            >
              {getFieldDecorator('icon')(
                <Upload {...propsObj}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}>
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              )}
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
              <Button
                style={{ marginLeft: 32 }}
                onClick={this.pswModal}
              >
                修改密码
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancelPreview}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
        <Modal
          visible={pswVisible}
          footer={null}
          onCancel={this.pswCancel}
        >
          <Form
            onSubmit={this.pswSubmit}
          >
            <FormItem
              {...formItemLayout}
              validateStatus={usernameError ? 'error' : ''}
              help={usernameError || ''}
              label="新密码"
            >
              {getFieldDecorator('password')(<Input placeholder="新密码" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32,textAlign:'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
