import React, { PureComponent } from 'react';
import { connect } from "dva";
import { Table, Button, Input, message, Popconfirm, Avatar } from 'antd';
import styles from '../style.less';
import CoachForm from '../CoachForm';
import { successNotification } from '../../../utils/utils';

@connect(({ team, student }) => ({ team, student }))
export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      coachFormVisible:false
    };
    this.gid = '';
    this.columns = [{
      title: '头像',
      dataIndex: 'icon',
      key: 'icon',
      render:(text,record)=>{
        return (
          <Avatar src={text} size="large"/>
        )
      }
    }, {
      title: '教官名字',
      dataIndex: 'realName',
      key: 'realName',
    }, {
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];
  }
  componentWillMount(){
    this.getAllCoach();
    this.getCoachList();
  }

  remove(record) {
    console.log("record:  ",record);
    const uid = record.uid;
    const _this = this;
    // const newData = this.state.data.filter(item => item.key !== key);
    // this.setState({ data: newData });
    this.props
      .dispatch({
        type: 'team/addCoach',
        payload: {
          gid: this.props.gid,
          uids: [uid],
          isOn: false
        }
      })
      .then(() => {
        successNotification('删除教官成功!', function() {
          _this.getCoachList();
          return false;
        });
      })
      .catch(err => {});
  }


  //获取常驻教官
  getCoachList=()=>{
    this.setState({
      loading:true
    });
    this.props
      .dispatch({
        type: 'team/getAllTeams',
        payload: {
          query: {
            limit: 10,
            page: 0,
            keyJson: JSON.stringify({gid:this.props.gid})
          }
        }
      })
      .then(res=>{
        console.log(this.props.team.teams[0].coachList);
        this.props.team.teams[0].coachList.forEach(item=>{
          item.key = Math.random(0,20000);
        });
        this.setState({
          data:[...this.props.team.teams[0].coachList]
        })
        this.setState({
          loading:false
        });
      })
      .catch(err => err);
  }


  //添加指定教官
  newMember = () => {
    this.setState({coachFormVisible:true});
  }

  // 获取教官列表
  getAllCoach = (p = 0) => {
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

  // 处理教官列表翻页
  handleTableChange = p => {
    this.getAllCoach(p - 1);
  };

  // 关闭新增教官弹窗
  hideModal = () => {
    this.setState({
      coachFormVisible: false
    });
  };

  // 指派教官
  addCoach = () => {
    const form = this.coachForm;
    const _this = this;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form ===>: ', values);
        this.props
          .dispatch({
            type: 'team/addCoach',
            payload: {
              gid: this.props.gid,
              uids: values.uids,
              isOn: true
            }
          })
          .then(() => {
            successNotification('指派教官成功!', function() {
              _this.getCoachList();
              return false;
            });
          })
          .catch(err => {});
      }
      this.setState({ coachFormVisible: false });
    });
  };




  saveCoachFormRef = form => {
    this.coachForm = form;
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
          document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
  }
  render() {


    const { coachFormVisible } = this.state;
    const { studentList, page, count } = this.props.student;

    return (
      <div>
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          指派教官
        </Button>
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
      </div>
    );
  }
}
