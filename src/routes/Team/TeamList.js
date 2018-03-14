import React, { Component } from 'react';
import { Card, Table, Pagination, Divider, Form, notification } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PswForm from './PswForm';
import CoachForm from './CoachForm';
import { routerRedux } from 'dva/router';
import { handleLevel, successNotification } from '../../utils/utils';

@connect(({ team, student }) => ({ team, student }))
@Form.create()
export default class TeamList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '团名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '团账号',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '团部级别',
        dataIndex: 'groupLevel',
        key: 'groupLevel',
        render: (text, record) => handleLevel(record.groupLevel)
      },
      {
        title: '成立时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text, record) => moment(record.createdAt).format('YYYY-MM-DD')
      },
      {
        title: '团长电话',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record) =>
          record.head.phone ? record.head.phone.replace('86-', '') : ''
      },
      {
        title: '团类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (record.type === '' ? '普通团' : '临时团')
      },
      {
        title: '已加入人数',
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
            <a onClick={() => this.goToPage(record, 'edit-account')}>
              修改账号
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.modifyPsw(record)}>修改密码</a>
            <Divider type="vertical" />
            <a onClick={() => this.openCoachModal(record)}>指派教官</a>
          </span>
        )
      }
    ];
    this.gid = '';
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
    this.getAllCoach(p-1);
  };

  // 获取教官列表
  getAllCoach = (p=0) => {
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
  getAllTeams = (p = 0) => {
    this.props
      .dispatch({
        type: 'team/getAllTeams',
        payload: {
          query: { limit: 10, page: p }
        }
      })
      .catch(err => err);
  };

  componentWillMount() {
    this.getAllTeams();
    this.getAllCoach();
  }

  render() {
    const { teams, teamsMeta } = this.props.team;
    const { studentList, page, count } = this.props.student;
    const { visible, coachFormVisible } = this.state;

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Table
            bordered
            rowKey={record => record.gid}
            pagination={false}
            dataSource={teams}
            columns={this.columns}
          />
          <div style={{ marginTop: 10 }}>
            <Pagination
              defaultCurrent={1}
              total={teamsMeta.count}
              onChange={p => this.onPagination(p)}
            />
          </div>
        </Card>
        <PswForm
          ref={this.saveFormRef}
          visible={visible}
          onCancel={this.hideModal}
          onCreate={this.handleCreate}
        />
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
