import React, {Component} from 'react';
import { Card } from 'antd';
import {connect} from "dva";
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({post}) => ({post}))
export default class PostDetail extends Component {
  componentWillMount() {
    // console.log("PostDetail componentWillMount==>", this.props.location);
    let _id;
    if(this.props.location.query === undefined) {
      // console.log("没有 query id, 获取存储的query id")
      _id = localStorage.getItem("id");
      this.props.dispatch({
        type: "post/getPostDetail",
        payload: {id: _id}
      });
    }else {
      localStorage.setItem("id", "");
      localStorage.setItem("id", this.props.location.query.id);
      this.props.dispatch({
        type: "post/getPostDetail",
        payload: this.props.location.query
      }).catch(err => err);
      // console.log("有 query id", this.props.location.query.id)
    }
  }

  render() {
    const breadcrumbList = [{
      title: '首页',
      href: '/',
    }, {
      title: '文章列表',
      href: '/post/list',
    }, {
      title: '文章详情',
      href: '/post/detail',
    }];
    const {post} = this.props.post;
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false} title="文章详情">
          <h3 style={{textAlign: 'center'}}>{post.title}</h3>
          <p style={{textAlign: 'center'}}>{moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          <div dangerouslySetInnerHTML={{__html: post.content}}/>
        </Card>
      </PageHeaderLayout>
    )
  }
}
