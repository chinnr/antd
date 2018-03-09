import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Card, Input, Form } from 'antd';
import { successNotification } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './CourseReview.less';
import moment from 'moment/moment';
import { routerRedux } from 'dva/router';

const { Description } = DescriptionList;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

@connect(({ course }) => ({ course }))
@Form.create()
export default class CourseReview extends Component {
  state = {
    openCourseDetail: false,
    rejectModal: false
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
        type: 'course/courseDetail',
        payload: { id: _id }
      })
      .catch(err => err);
  }

  // 点击展开课程详细信息
  toggleCourseDetail = () => {
    this.setState({
      openCourseDetail: !this.state.openCourseDetail
    });
  };

  // 审核逻辑
  handleReview = (type, id, note = '') => {
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
        this.handleReview('reject', _id, values);
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
        href: '/course/course-list'
      },
      {
        title: '课程审核',
        href: '/course/course-review'
      }
    ];
    const { course: { courseDetail } } = this.props;
    const { openCourseDetail, rejectModal } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card>
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="标题">{courseDetail.title}</Description>
            <Description term="培养能力">{courseDetail.skills}</Description>
            <Description term="开课时间">
              {moment(courseDetail.startedAt).format('YYYY-MM-DD hh:mm')}
            </Description>
            <Description term="上课地点">
              {courseDetail.courseLocation}
            </Description>
            <Description term="结课时间">
              {moment(courseDetail.endedAt).format('YYYY-MM-DD hh:mm')}
            </Description>
            <Description term="集合地点">
              {courseDetail.collectLocation}
            </Description>
            <Description term="体验券">
              {courseDetail.payExpCoupons}
            </Description>
            <Description term="课时券">
              {courseDetail.payClassCoupons}
            </Description>
            <Description term="课程详情">
              <Button onClick={() => this.toggleCourseDetail()}>
                {openCourseDetail ? '收起' : '展开'}
              </Button>
            </Description>
          </DescriptionList>
          {openCourseDetail && (
            <div style={{ height: 400, overflow: 'scroll' }}>
              <div
                dangerouslySetInnerHTML={{ __html: courseDetail.description }}
              />
            </div>
          )}
          <div>
            <Button
              type="primary"
              onClick={() => this.reviewCourse('resolve', courseDetail.id)}
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
        </Card>
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
