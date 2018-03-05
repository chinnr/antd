import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Table, Divider, Form, Input, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { successNotification } from '../../utils/utils';
const FormItem = Form.Item;

@connect(({ student, loading }) => ({
  student,
  loading: loading.models.student,
}))
@Form.create()
class StudentManage extends PureComponent {

  state = {
    modalVisible: false,
    confirmDirty: false,
    uid: null
  };

  handleTableChange = ({current, pageSize}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/getStudentList',
      payload: {
        page: current - 1,
        limit: pageSize
      }
    });
  };

  goToDetail = (uid) => {
    console.log('uid ', uid)
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: `/student-detail/${uid}`,
    }));
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    })
  }; 

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(value && value !== form.getFieldValue('password')) {
      callback('密码输入不一致');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if(value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    } 
    callback();
  };

  showModal = (uid) => {
    this.setState({
      modalVisible: true,
      uid: uid
    })
  };

  handleOk = (e) => {
    const { uid } = this.state;
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.props.dispatch({
          type: 'student/updateUserPassword',
          payload: {
            uid,
            form: { 
              password: {
                password: values.password
              }
            }
          }
        })
        .then((res) => {
          successNotification('修改成功', this.handleCancel)
        })
        .catch((err) => {
          throw new Error(err);
        })
      }
    })
  };

  handleCancel = (e) => {
    this.setState({
      modalVisible: false
    })
  };

  render() {
    const { loading, student } = this.props;
    const { modalVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    console.log('list ', student.studentList);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const levelObj = {
      "level1": "海狸",
      "level2": "小狼",
      "level3": "探索",
      "level4": "乐扶"
    };
    const columns = [
      {
        title: '用户名',
        render: (record) => (<span>{record.base.phone}</span>)
      },
      {
        title: '姓名',
        render: (record) => (<span>{record.base.profile.name}</span>)
      },
      {
        title: '编号',
        dataIndex: 'number',
      },
      {
        title: '阶段',
        render: (record) => (<span>{ levelObj[record.level] }</span>)
      },
      {
        title: '团属',
        render: (record) => (record.group && <span>{record.group.name}</span>)
      },
      {
        title: '职务',
        render: (record) => (
          record.isLead ?
          <span>{ record.leadList.join(',') }</span> : '-'
        )
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={this.showModal.bind(this, record.uid)}>重置密码</a>
            <Divider type="vertical" />
            <a onClick={this.goToDetail.bind(this, record.uid)}>查看详情</a>
          </Fragment>
        ),
      },
    ];
    const pagination = {
      total: student.count,
      pageSize: student.limit,
      current: student.page + 1
    };
    return (
      <PageHeaderLayout title="学员管理">
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              dataSource={student.studentList}
              rowKey={record => record.uid}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
          <Modal 
            title="重置密码"
            visible={modalVisible}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
          >
            <Form>
              <FormItem
                {...formItemLayout}
                label="新密码"
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' },
                  ]
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="确认新密码"
              >
                {getFieldDecorator('confirm', {
                  rules: [{ 
                    required: true, message: '请确认新密码',
                  }, {
                    validator: this.checkPassword
                  }]
                })(
                  <Input type="password" />
                )}
              </FormItem>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default StudentManage;

