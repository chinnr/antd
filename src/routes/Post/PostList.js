import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Radio, Input,Pagination, Avatar,Popconfirm } from 'antd';
import {routerRedux} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { thumbnailPath, rootUrl } from "../../utils/constant";

import styles from './PostList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.list,
}))
export default class PostList extends PureComponent {

  // 处理翻页
  onPagination = (p) => {
    // console.log("处理翻页==>", p);
    this.getPosts(p-1);
  };

  // 获取文章列表
  getPosts = (p=0) => {
    this.props.dispatch({
      type: 'post/getPosts',
      payload: {
        query: {limit:10, page: p},
      },
    }).catch(err => err);
  };

  componentDidMount() {
    this.getPosts();
  }

  /**
   * 点击查看详情
   * @param _query  传递的参数
   */
  goToPage = (_query, path) => {
    // console.log("_query==>", _query);
    let query = {};
    path === 'edit' ? query = {post: _query} : query = {id: _query};
    this.props.dispatch(routerRedux.push({
      pathname: '/post/'+path,
      query: query
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
    }).catch(err => err)
  };

  /**
   * 放弃删除某篇文章
   */
  cancelDelete = () => {};

  /**
   * 处理文章简介
   * @returns {*}
   */
  handleDescription(content) {
    const reg = /<(?:.|\s)*?>/g;
    if(content.length >= 20) {
      return content.replace(reg, '').replace(/&nbsp;/ig, '').substring(0, 20).concat("......")
    }else {
      return content.replace(reg, '').replace(/&nbsp;/ig, '')
    }
  }
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
                    <a onClick={() => this.goToPage(item, 'edit')}>编辑</a>,
                    <Popconfirm title="确定删除这篇文章?" onConfirm={()=>this.confirmDelete(item.id)} onCancel={()=>this.cancelDelete()} okText="确定" cancelText="取消">
                      <a>
                        删除
                      </a>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={item.gallery.length>0  ? <Avatar src={ rootUrl + thumbnailPath+item.gallery[0]} shape="square" size="large" /> : null}
                    title={<a href="#">{item.title}</a>}
                    description={this.handleDescription(item.content)}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
            <div style={{marginTop: 10}}>
              <Pagination defaultCurrent={1} total={postsMeta.count} onChange={(p) => this.onPagination(p)}/>
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
