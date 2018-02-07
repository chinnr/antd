import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Radio, Input, Icon, Dropdown, Menu, Avatar,Popconfirm } from 'antd';
import {routerRedux} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './PostList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.list,
}))
export default class PostList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'post/getPosts',
      payload: {
        query: {limit:10},
      },
    });
  }

  /**
   * 点击查看详情
   * @param id  文章id
   */
  goToPage = (id, path) => {
    // console.log("id==>", id);
    this.props.dispatch(routerRedux.push({
      pathname: '/post/'+path,
      query: {
        id:id
      }
    }))
  };

  /**
   * 确认删除某篇文章
   * @param id 文章id
   */
  confirmDelete = (id) => {
    this.props.dispatch({
      type: "post/updatePost",
      payload: {
        argv: {
          id: id,
          isActive: false,
        }
      }
    })
  };

  /**
   * 放弃删除某篇文章
   */
  cancelDelete = () => {};

  render() {
    const {posts, postsMeta} = this.props.post;
    const { loading } = this.props;
    // console.log("render posts==>", this.props.post)

    const ListContent = ({ data: { owner, createdAt } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>发布时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="文章列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={null}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={false}
              dataSource={posts}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => this.goToPage(item.id, 'detail')}>查看</a>,
                    <a onClick={() => this.goToPage(item.id, 'edit')}>编辑</a>,
                    <Popconfirm title="确定删除这篇文章?" onConfirm={()=>this.confirmDelete(item.id)} onCancel={()=>this.cancelDelete()} okText="确定" cancelText="取消">
                      <a>
                        删除
                      </a>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href="#">{item.title}</a>}
                    description={"subDescription"}
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
