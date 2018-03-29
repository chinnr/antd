import React from 'react';
import moment from 'moment'
import {
  Card,
  Divider,
  Row,
  Col,
} from "antd";
import style from '../Course.less';
import { rootUrl, thumbnailPath } from "../../../utils/constant";

const CourseCommon = (props)=>{
  const {
    cover,
    title,
    type,
    score,
    stage,
    level,
    payClassCoupons,
    deadlinedAt,
    startedAt,
    content,
    skills,
    courseLocation,
    collectLocation,
    instructors,
    note,
    gallery,
  } = props;

  const classType = {
    0:'团集会',
    1:'活动',
    2:'兴趣课'
  }

  console.log("gallery=================>>>>>>>>",gallery);
  const listImg = gallery.map((item,index)=>{
    return(
      <img src={rootUrl+thumbnailPath+item} key={index.toString()} alt="" style={{height:'300px',padding:'20px'}} />
    )

  })

  console.log("courseDetail=>>>>>>>>>>>>>>",props);
  return(
    <div>
      <Card className={style.listCard}>
        <Row gutter={24}>
          <Col lg={6} style={{textAlign:'center'}}>
            {cover?<img src={`${rootUrl}${thumbnailPath}${cover}`} style={{width:'100%'}}/>:<p>暂无图片</p>}
          </Col>
          <Col lg={18} className={style.rowBottom}>
            <Row>
              <h1>{title}</h1>
            </Row>
            <Row>
              <Col lg={10}>课程类型：{classType[type]}</Col>
              <Col lg={14}>服务范围：{score}</Col>
            </Row>
            <Row>
              <Col lg={10}>支付类型：{payClassCoupons}课时卷</Col>
              <Col lg={14}>级别阶段：{level}-{stage}</Col>
            </Row>
            <Row>
              报名截止日期：{moment(deadlinedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Row>
            <Row>
              开课时间：{moment(startedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Row>
          </Col>
        </Row>
        <Divider />

        <div className={style.rowBottom}>
          <Row>
            课程内容：{content}
          </Row>
          <Row>
            培养能力：{skills}
          </Row>
          <Row>
            获得荣誉：{}
          </Row>
          <Row>
            <Col lg={12}>
              上课地点：{courseLocation}
            </Col>
            <Col lg={12}>
              集合地点：{collectLocation}
            </Col>
          </Row>
        </div>
      </Card>

      <Card className={style.listCard} title='任课教官'>
        uid:{instructors}
      </Card>

      <Card className={style.listCard} title='详细信息'>

      </Card>

      <Card className={style.galleryCard} title='课程风采'>
        {listImg}
      </Card>

      <Card className={style.listCard} title='注意事项'>
        {note}
      </Card>
    </div>
  )
}

export default CourseCommon;
