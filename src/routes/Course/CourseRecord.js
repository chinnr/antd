import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Radio, Input, Button, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Course.less';
import { routerRedux } from 'dva/router';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ course }) => ({ course }))
export default class CourseRecord extends PureComponent {
  /**
   * 处理课程类型
   * @param method  课程类型 0:普通课 1:常驻课 2:夏令营
   */
  handleMethod = method => {
    let methodObj = {
      0: '普通课',
      1: '常驻课',
      2: '夏令营'
    };
    return methodObj[method];
  };

  /**
   * 处理课程类型
   * @param method  课程类型 0:团集会 1:活动 2:兴趣课
   */
  handleType = type => {
    let typeObj = {
      0: '团集会',
      1: '活动',
      2: '兴趣课'
    };
    return typeObj[type];
  };

  /**
   * 处理课程状态
   * @param state 课程状态, -2审核失败, -1草稿, 0待审核, 1课程未开始(审核通过) 2进行中 3已过期 默认0
   */
  handleState = state => {
    const _state = state.toString();
    let stateObj = {
      '-2': '审核失败',
      // '-1': '草稿',
      0: '待审核',
      1: '审核通过',
      // 2: '进行中',
      // 3: '已过期'
    };
    return stateObj[_state];
  };

  /**
   * 跳转到预览\审核页
   * @param type 跳转的页面类型
   * @param id  课程id
   */
  goToPage = (type, id) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/course/course-${type}`,
        query: {
          courseId: id
        }
      })
    );
  };

  /**
   * 获取开课列表
   * @param p
   * @param keyJson  // 查询关键词
   */
  courseList = (p, keyJson = {}) => {
    this.props
      .dispatch({
        type: 'course/courseList',
        payload: {
          page: p - 1,
          limit: 10,
          keyJson: JSON.stringify(keyJson)
        }
      })
      .catch(err => err);
  };

  /**
   * 翻页
   * @param p
   */
  onPagination = p => {
    console.log('onPagination ==> ', p - 2);
    this.courseList(p);
  };

  /**
   * 处理用户筛选
   * @param v  筛选的纸
   * @param p  当前页码
   * @param type  筛选类型
   */
  handleSearch = (v, p, type) => {
    console.log('handleSearch ==> ', v.target.value);
    let keyJson = {};
    if (type === 'state' && v.target.value === -3) {
      keyJson = { state: {$ne: -1} };
      this.courseList(p + 1, keyJson);
    }else{
      keyJson = { state: v.target.value };
      this.courseList(p + 1, keyJson);
    }
    // if (type === 'state' && v !== 'all') {
    //   keyJson = { state: v.target.value };
    //   this.courseList(p + 1, keyJson);
    // }


  };

  componentDidMount () {
    let keyJson = { state: {$ne: -1} };
    this.courseList(1, keyJson);
  }

  render() {
    const { course: { courseList, courseListMeta } } = this.props;
    const page = courseListMeta.page;
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup
          defaultValue="all"
          onChange={v => this.handleSearch(v, page, 'state')}
        >
          <RadioButton value={-3}>全部</RadioButton>
          <RadioButton value={-2}>审核失败</RadioButton>
          {/*<RadioButton value={-1}>草稿</RadioButton>*/}
          <RadioButton value={0}>待审核</RadioButton>
          <RadioButton value={1}>审核通过</RadioButton>
          {/*<RadioButton value={2}>进行中</RadioButton>*/}
          {/*<RadioButton value={3}>已过期</RadioButton>*/}
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入课程标题"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      pageSize: 10,
      total: courseListMeta.count,
      onChange: p => this.onPagination(p)
    };

    const ListContent = ({
      data: { createdAt, state, group, method, type, id }
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>{group.name}</span>
          <p>{this.handleMethod(method) + ' ' + this.handleType(type)}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD hh:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>{this.handleState(state)}</span>
        </div>
        <div className={styles.listContentItem}>
          {state === 0 ? (
            <Button onClick={() => this.goToPage('review', id)}>审核</Button>
          ) : (
            <Button onClick={() => this.goToPage('detail', id)}>预览</Button>
          )}
        </div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title=""
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              // loading={loading}
              pagination={paginationProps}
              dataSource={courseList}
              renderItem={item => (
                <List.Item actions={null}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.logo} shape="square" size="large" />
                    }
                    title={<a href={item.href}>{item.title}</a>}
                    description={'培养能力: ' + item.skills}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
