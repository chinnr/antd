import React, { Component } from 'react';
import { Card, Table, Pagination, Divider, Form, Select, Row, Col, Button, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PswForm from './PswForm';
import CoachForm from './CoachForm';
import { routerRedux } from 'dva/router';
import { handleLevel, successNotification } from '../../utils/utils';
import styles from './team.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ team, student }) => ({ team, student }))
@Form.create()
export default class TeamList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '城市',
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: '团部名称',
        dataIndex: 'name',
        key: 'name'
      },
      // {
      //   title: '团账号',
      //   dataIndex: 'username',
      //   key: 'username'
      // },
      {
        title: '团部级别',
        dataIndex: 'groupLevel',
        key: 'groupLevel',
        render: (text, record) => handleLevel(record.groupLevel)
      },
      {
        title: '团类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (record.type === '' ? '普通团' : '临时团')
      },
      {
        title: '团长昵称',
        dataIndex: 'otherName',
        key: 'otherName'
      },
      /*{
        title: '成立时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text, record) => moment(record.createdAt).format('YYYY-MM-DD')
      },*/
      {
        title: '团长电话',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record) => (record.head.phone ? record.head.phone.replace('86-', '') : '')
      },
      {
        title: '人数',
        dataIndex: 'numJoin',
        key: 'numJoin'
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render: (text, record) => (
          <span>
            <a onClick={() => this.goToPage(record, 'edit-info')}>修改信息</a>
            <Divider type="vertical" />
            <a onClick={() => this.goToPage(record, 'edit-account')}>修改账号</a>
            <Divider type="vertical" />
            <a onClick={() => this.modifyPsw(record)}>修改密码</a>
            <Divider type="vertical" />
            <a onClick={() => this.openCoachModal(record)}>指派教官</a>
          </span>
        )
      }
    ];
    this.gid = '';
    this.keyJson = {};
    this.state = {
      data: [],
      visible: false,
      coachFormVisible: false,
      username: ''
    };
  }

  // 跳转到修改编辑页面
  goToPage = (record, path) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/team/' + path,
        query: {
          record: record
        }
      })
    );
  };

  // 打开修改密码弹窗
  modifyPsw = record => {
    this.setState({
      visible: true,
      username: record.username
    });
  };

  // 修改密码
  handleCreate = () => {
    const form = this.form;
    const { username } = this.state;
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
      this.setState({ visible: false });
    });
  };

  // 打开指派教官弹窗
  openCoachModal = record => {
    this.gid = record.gid;
    this.setState({
      coachFormVisible: true
    });
  };

  // 指派教官
  addCoach = () => {
    const form = this.coachForm;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form ===>: ', values, this.gid);
        this.props
          .dispatch({
            type: 'team/addCoach',
            payload: {
              gid: this.gid,
              uids: values.uids,
              isOn: true
            }
          })
          .then(() => {
            successNotification('指派教官成功!', function() {
              return false;
            });
          })
          .catch(err => {});
      }
      this.setState({ coachFormVisible: false });
    });
  };

  // 关闭弹窗
  hideModal = () => {
    this.setState({
      visible: false,
      coachFormVisible: false
    });
  };

  saveFormRef = form => {
    this.form = form;
  };

  saveCoachFormRef = form => {
    this.coachForm = form;
  };

  // 处理翻页
  onPagination = p => {
    this.getAllTeams(p - 1);
  };

  // 处理教官列表翻页
  handleTableChange = p => {
    console.log('page ', p);
    this.getAllCoach(p - 1);
  };

  // 获取教官列表
  getAllCoach = (p = 0) => {
    console.log('page ', p);
    const { dispatch } = this.props;
    dispatch({
      type: 'student/getStudentList',
      payload: {
        page: p,
        limit: 10,
        keyJson: JSON.stringify({'level': 'level4'})
      }
    });
  };

  // 获取团列表
  getAllTeams = (p = 0, keyJson={}) => {
    this.props
      .dispatch({
        type: 'team/getAllTeams',
        payload: {
          query: {
            limit: 10,
            page: p,
            keyJson: JSON.stringify(keyJson)
          }
        }
      })
      .catch(err => err);
  };

  // 导出数据
  outPutData = () => {};

  componentWillMount() {
    this.getAllTeams();
    this.getAllCoach();
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.getAllTeams();
  };

  /**
   * 团列表筛选
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { teamsMeta } = this.props.team;
      if (err) return;
      if (!err) {
        console.log('fieldsValue==>', fieldsValue);
        if (fieldsValue.type === 'main') {
          fieldsValue.type = '';
        }
        this.keyJson = fieldsValue;
        this.getAllTeams(teamsMeta.page ,this.keyJson)
      }
    });
  };

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
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
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="城市">
                  {getFieldDecorator('city', {
                    initialValue: '',
                    rules: [
                      {
                        required: false,
                        message: '请输入城市'
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="团部级别">
                  {getFieldDecorator('groupLevel', {
                    initialValue: 'level1',
                    rules: [
                      {
                        required: false,
                        message: '请输入团部级别'
                      }
                    ]
                  })(
                    <Select placeholder="请选择团部级别">
                      <Option value="level1">海狸</Option>
                      <Option value="level2">小狼</Option>
                      <Option value="level3">探索</Option>
                      <Option value="level4">乐扶</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="团类型">
                  {getFieldDecorator('type', {
                    initialValue: 'main',
                    rules: [
                      {
                        required: false,
                        message: '请输入团类型'
                      }
                    ]
                  })(
                    <Select placeholder="请选择团类型">
                      <Option value="main">普通团</Option>
                      <Option value="temp">临时团</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.outPutData()}>
                  导出数据
                </Button>
              </span>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  render() {
    const { teams, teamsMeta } = this.props.team;
    const { studentList, page, count } = this.props.student;
    const { visible, coachFormVisible } = this.state;

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <div>{this.renderAdvancedForm()}</div>
          <Table
            // bordered
            rowKey={record => record.gid}
            pagination={false}
            dataSource={teams}
            columns={this.columns}
          />
          <div style={{ marginTop: 10 }}>
            <Pagination defaultCurrent={1} total={teamsMeta.count} onChange={p => this.onPagination(p)} />
          </div>
        </Card>
        <PswForm ref={this.saveFormRef} visible={visible} onCancel={this.hideModal} onCreate={this.handleCreate} />
        <CoachForm
          ref={this.saveCoachFormRef}
          coach={studentList}
          page={page}
          count={count}
          visible={coachFormVisible}
          onCancel={this.hideModal}
          addCoach={this.addCoach}
          onPagination={this.handleTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
