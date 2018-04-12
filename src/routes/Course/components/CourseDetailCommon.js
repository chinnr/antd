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
import {handleLevel,handleStage} from "../../../utils/utils";

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
    endedAt,
    content,
    skills,
    courseLocation,
    collectLocation,
    payExpCoupons,
    description,
    note,
    gallery,
    ins,
    badgeList
  } = props;


  const classType = {
    0:'团集会',
    1:'活动',
    2:'兴趣课'
  }

  //课程风采
  const listImg = gallery.map((item,index)=>{
    return(
      <Col span={6}><img src={rootUrl+thumbnailPath+item} key={'listImg'+index.toString()} alt="" style={{ width:'100%', marginTop:8, marginBottom:8 }} /></Col>
    )
  })

  //任课教官
  let listItem;
  if(ins&&ins.length>=1){
    listItem = ins.map((item,index)=>{
      return (
        <li style={{float:'left',width:'200px'}} key={item.icon+index.toString()}><img style={{height:'50px',marginRight:'30px'}} src={item.icon}/>{item.realName}</li>
      )
    })
  }else{
    listItem = <p>暂无教官</p>
  }

  //获得荣誉
  let badges;
  if(badgeList&&badgeList.length>=1){
    badges = badgeList.map((item,index)=>{
      return (
        <span style={{marginRight:'30px'}} key={'badges'+index.toString()}>{index}.{item.name}</span>
      )
    })
  }else{
    badges = <span>暂无荣誉</span>
  }


  console.log("任课教官：            ",ins)

  return(
    <div>
      <Card className={style.listCard}>
        <Row gutter={24}>
          <Col lg={6} style={{textAlign:'center'}}>
            {cover?<img src={`${rootUrl}${thumbnailPath}${cover}`} style={{width:'100%'}}/>:<p>暂无图片</p>}
          </Col>
          <Col lg={18} className={style.rowBottom}>
            <h1>{title}</h1>
            <Row>
              <Col lg={12}>课程类型：{classType[type]}</Col>
              <Col lg={12}>服务范围：{score}</Col>
            </Row>
            <Row>
              <Col lg={12}>支付类型：{payClassCoupons}课时卷     {payExpCoupons}体验卷</Col>
              <Col lg={12}>级别阶段：{handleLevel(level)}{handleStage(stage)}</Col>
            </Row>
            <Row>
              报名截止：{moment(deadlinedAt).format('YYYY-MM-DD HH:mm')}
            </Row>
            <Row>
              上课时间：{startedAt?moment(startedAt).format('YYYY-MM-DD HH:mm'):'暂无'} ~ {endedAt?moment(endedAt).format('YYYY-MM-DD HH:mm'):'暂无'}
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
            获得荣誉：{badges}
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
        {listItem}
      </Card>

      <Card className={style.listCard} title='详细信息'>
        <div dangerouslySetInnerHTML={{__html: description}}></div>
      </Card>

      <Card className={style.galleryCard} title='课程风采'>
        <Row gutter={16}>
          {listImg}
        </Row>
      </Card>

      <Card className={style.listCard} title='注意事项'>
        {note}
      </Card>
    </div>
  )
}

export default CourseCommon;
