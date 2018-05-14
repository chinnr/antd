import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Card, Input, Form } from 'antd';
import { successNotification } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './CourseReview.less';
import moment from 'moment/moment';
import { routerRedux } from 'dva/router';
import CourseCommon from './components/CourseDetailCommon'

const { Description } = DescriptionList;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

@connect(({ course, student }) => ({ course, student }))
@Form.create()
export default class CourseReview extends Component {
  state = {
    openCourseDetail: false,
    rejectModal: false,
    groupCoaches:[]
  };

  getCourseId = () => {
    let _id;
    if (this.props.location.query === undefined) {
      _id = localStorage.getItem('courseId');
    } else {
      localStorage.setItem('courseId', '');
      localStorage.setItem('courseId', this.props.location.query.courseId);
      _id = this.props.location.query.courseId;
    }
    return _id;
  };

  componentWillMount() {
    const _id = this.getCourseId();
    this.props
      .dispatch({
        type: "course/courseDetail",
        payload: { id: _id }
      })
      .then(res => {
        let arr = [];
        console.log("教官groupCoaches：      ",res);

        res.groupCoaches.forEach(uid => {
          this.props
            .dispatch({
              type: "student/getStudentDetail",
              payload: uid
            })
            .then(res => {
              const {icon,realName} = res;
              console.log("执行成功了!!!!!!!!",{icon,realName});
              arr.push({icon,realName});
              this.setState({
                groupCoaches: [...arr]
              })
            });
        });
      })
      .catch(err => err);


  }

  getCoaches = (dataList) => {

    let arr = [];
    console.log("========getCoaches=========");
    dataList.groupCoaches.forEach(uid => {
      console.log("sdkjhfdskjGJHGJHGJH");
      this.props.dispatch({
          type: "student/getStudentDetail",
          payload: uid
        })
        .then(res => {
          const {icon,realName} = res;
          arr.push({icon,realName});
          console.log("adasdaddasds:      ",arr);
          this.setState({
            groupCoaches: [...arr]
          })
        }).catch(err=>{console.log("fail:    ",err);});
    });
  };

  // 点击展开课程详细信息
  toggleCourseDetail = () => {
    this.setState({
      openCourseDetail: !this.state.openCourseDetail
    });
  };

  // 审核逻辑
  handleReview = (type, id, note = '') => {
    console.log("审核逻辑:")
    const props = this.props;
    let _argv = {};
    type === 'resolve'
      ? (_argv = { id: id })
      : (_argv = { id: id, note: note });
    props
      .dispatch({
        type: 'course/courseReview',
        payload: {
          argv: _argv,
          type: type
        }
      })
      .then(() => {
        successNotification('操作成功', function() {
          props.dispatch(
            routerRedux.push({
              pathname: '/course/course-record'
            })
          );
        });
      })
      .catch(err => err);
  };

  // 审核是否通过
  reviewCourse = (type, id) => {
    if (type === 'reject') {
      this.setState({
        rejectModal: true
      });
    } else {
      this.handleReview(type, id);
    }
  };

  handleOk = (e, courseDetail) => {
    const _id = courseDetail.id;
    console.log(e);
    this.setState({
      rejectModal: false
    });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values==>', values);
        this.handleReview('reject', _id, values.note);
      }
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      rejectModal: false
    });
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '开课列表',
        href: '/course/course-record'
      },
      {
        title: '课程审核',
        href: '/course/course-review'
      }
    ];
    const { course: { courseDetail } } = this.props;
    const { openCourseDetail, rejectModal } = this.state;
    const { getFieldDecorator } = this.props.form;

    //课程详情数据成功请求后
    let common = null;
    if (JSON.stringify(courseDetail).length > 2) {
      common = <CourseCommon {...courseDetail} ins={this.state.groupCoaches} />;
    } else {
      common = <p>暂无数据</p>;
    }

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        {common}

        <div style={{textAlign:'center'}}>
          <Button
            type="primary"
            onClick={() => this.reviewCourse('resolve', courseDetail.id)}
            style={{marginRight:'30px'}}
          >
            通过
          </Button>
          <Button
            type="danger"
            onClick={() => this.reviewCourse('reject', courseDetail.id)}
          >
            拒绝
          </Button>
        </div>

        <Modal
          title="拒绝理由"
          visible={rejectModal}
          onOk={e => this.handleOk(e, courseDetail)}
          onCancel={() => this.handleCancel()}
        >
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem>
              {getFieldDecorator('note', {
                rules: [
                  {
                    required: true,
                    message: '请输入拒绝理由'
                  }
                ]
              })(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
