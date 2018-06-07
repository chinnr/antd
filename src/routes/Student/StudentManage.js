import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Row, Col, Card, Table, Divider, Form, Input, Select, Modal, Button,InputNumber} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {successNotification} from '../../utils/utils';
import styles from './StudentManage.less';

const FormItem = Form.Item;
const {Option} = Select;
const level = ['海狸', '小狼', '探索', '乐扶'];

const ResetPasswordForm = Form.create()((props) => {
  const {modalVisible, form, handleCancel, handleOk} = props;
  const {getFieldDecorator} = form;
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14}
  };

  function resetInput() {
    form.resetFields();
  }

  const okHandle = () => {
    form.validateFields((err, values) => {
      if (!err) {
        handleOk(values, resetInput)
      }
    })
  };
  return (
    <Modal
      title="重置密码"
      visible={modalVisible}
      onCancel={handleCancel}
      onOk={okHandle}
    >
      <Form>
        <FormItem
          {...formItemLayout}
          label="新密码"
        >
          {getFieldDecorator('password', {
            rules: [{required: true, message: '请输入密码'},
            ]
          })(
            <Input type="password"/>
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
            <Input type="password"/>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({student, loading}) => ({
  student,
  loading: loading.models.student,
}))
@Form.create()
class StudentManage extends PureComponent {

  state = {
    modalVisible: false,
    confirmDirty: false,
    uid: null,
    filterObj: {}
  };

  handleTableChange = ({current, pageSize}) => {
    const {dispatch} = this.props;
    const {filterObj} = this.state;
    dispatch({
      type: 'student/getStudentList',
      payload: {
        page: current - 1,
        limit: pageSize,
        sort: ["-createdAt"],
        keyJson: JSON.stringify(filterObj)
      }
    });
  };

  goToDetail = (uid) => {
    // console.log('uid ', uid);
    const {dispatch} = this.props;
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
    if (value && value !== form.getFieldValue('password')) {
      callback('密码输入不一致');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };

  showModal = (uid) => {
    this.setState({
      modalVisible: true,
      uid: uid
    })
  };

  handleOk = (values, callback) => {
    const {uid} = this.state;
    const payload = {
      uid,
      form: {
        password: {
          password: values.password
        }
      }
    };
    this.props.dispatch({
      type: 'student/updateUserPassword',
      payload: payload
    })
      .then(() => {
        successNotification('修改成功', this.handleCancel.bind(this, callback))
      })
      .catch((err) => {
        throw new Error(err);
      })
  };

  handleCancel = (callback) => {
    this.setState({
      modalVisible: false
    }, () => {
      if (callback !== undefined && typeof(callback) === "function") {
        callback();
      }
    })
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {filterObj} = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        console.log("奥术大师多",values.realName);
        const obj = {
          ...filterObj,
          ...values
        };
        if(values.sex === ""){
          delete obj.sex;
        }
        if(values.realName){
          let obj = {key:"realname",val:""};
          obj.val = values.realName;
          dispatch({
            type: 'student/getStudentListByProfile',
            payload: {
              page: 0,
              limit: 10,
              sort: ["-createdAt"],
              keyJson: JSON.stringify(obj)
            }
          })
          return;
        }else{
          delete obj.realName;
        }
        if(values.age === undefined){
          delete obj.age;
          dispatch({
            type: 'student/getStudentList',
            payload: {
              page: 0,
              limit: 10,
              sort: ["-createdAt"],
              keyJson: JSON.stringify(obj)
            }
          })
        }else{
          delete obj.age;
          dispatch({
            type: 'student/getStudentListByAge',
            payload: {
              page: 0,
              limit: 10,
              sort: ["-createdAt"],
              keyJson: JSON.stringify(obj)
            },
            age:values.age
          })
        }

        this.setState({
          filterObj: obj
        });






      }
    })
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      filterObj: {}
    });
    dispatch({
      type: 'student/getStudentList',
      payload: {
        page: 0,
        limit: 10,
        sort: ["-createdAt"]
      }
    })
  };

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={8} sm={24}>
              <FormItem label="编号">
                {getFieldDecorator('number')(
                  <Input placeholder="请输入编号"/>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="团属">
                {getFieldDecorator('groupName')(
                  <Input placeholder="请输入团属"/>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="阶段">
                {getFieldDecorator('level')(
                  <Select placeholder="请选择">
                    <Option value="level1">海狸</Option>
                    <Option value="level2">小狼</Option>
                    <Option value="level3">探索</Option>
                    <Option value="level4">乐扶</Option>
                  </Select>
                )}
              </FormItem>
            </Col>

          </Row>
          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={8} sm={24}>
              <FormItem label="性别">
                {getFieldDecorator('sex')(
                  <Select placeholder="请选择">
                    <Option value={0}>请选择</Option>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="年龄">
                {getFieldDecorator('age')(
                  <InputNumber min={1} max={99} style={{width:'100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="姓名">
                {getFieldDecorator('realName')(
                  <Input placeholder="请输入姓名"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col style={{float: "right"}}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              {/*<Button style={{marginLeft: 8}} onClick={() => this.outPutData()}>导出数据</Button>*/}
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  /**
   * 导出数据
   */
  outPutData = () => {
    console.log("导出数据");
  };

  render() {
    const {loading, student} = this.props;
    const {modalVisible} = this.state;
    const levelObj = {
      "level1": "海狸",
      "level2": "小狼",
      "level3": "探索",
      "level4": "乐扶"
    };

    const columns = [
      {
        title: '童军号',
        key: 'number',
        dataIndex: 'number',
      },
      {
        title: '级别',
        key: 'level',
        render: (record) => (<span>{levelObj[record.level]}</span>)
      },
      {
        title: '姓名',
        key: 'name',
        render: (record) => (<span>{record.base&&record.base.profile.realName}</span>)
      },
      {
        title: '团属',
        key: 'belong',
        render: (record) => (record.group && <span>{record.group.name}</span>)
      },
      {
        title: '电话号码',
        key: 'phone',
        render: (record) => (<span>{record.base&&record.base.phone}</span>)
      },
      {
        title: '操作',
        key: 'x',
        render: (record) => (
          <Fragment>
            <a onClick={this.showModal.bind(this, record.uid)}>重置密码</a>
            <Divider type="vertical"/>
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
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{marginBottom: '10px'}}>{this.renderForm()}</div>
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
          <ResetPasswordForm
            modalVisible={modalVisible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
          />
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default StudentManage;

