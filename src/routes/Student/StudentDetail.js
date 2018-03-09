import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ student, mall, loading }) => ({
  studentDetail: student.studentDetail,
  loading: loading.models.student,
  mallLoading: loading.models.mall,
  myVirtualGoods: mall.myVirtualGoods
}))
class StudentDetail extends PureComponent {

  render() {
    const { loading, mallLoading, studentDetail, myVirtualGoods } = this.props;
    console.log('list ', studentDetail);
    const duty = studentDetail.isLead ? studentDetail.leadList.join('') : '无';
    const levelObj = {
      "level1": "海狸",
      "level2": "小狼",
      "level3": "探索",
      "level4": "乐扶"
    };
    const gridStyle = {
      width: '33%',
      textAlign: 'left'
    };
    const columns = [
      {
        title: '卡劵类型',
        key: 'cardType',
        dataIndex: 'cardType'
      },
      {
        title: '余额',
        key: 'value',
        dataIndex: 'value'
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => (
          <Fragment>
            <a>修改余额</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="学员详情">
        <Card title="入团信息" bordered={false} loading={loading}>
          <Row>
            <Col span={20}>
              <Row>
                <Col span={6}>
                  <span>编号:&nbsp;&nbsp;{ studentDetail.number }</span>
                </Col>
                <Col span={6}>
                  <span>阶段:&nbsp;&nbsp;{ levelObj[studentDetail.level] }</span>
                </Col>
                <Col span={6}>
                  <span>团属:&nbsp;&nbsp;{ studentDetail.group }</span>
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col span={6}>
                  <span>所在组:&nbsp;&nbsp;{ studentDetail.classNameAlias }</span>
                </Col>
                <Col span={6}>
                  <span>职务:&nbsp;&nbsp;{ duty }</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card style={{marginTop: 10}} title="基本信息" bordered={false} loading={loading}>
          <Row>
            <Col span={20}>
              <Row>
                <Col span={6}>
                  <span>姓名:&nbsp;&nbsp;{ studentDetail.realName }</span>
                </Col>
                <Col span={6}>
                  <span>性别:&nbsp;&nbsp;{ studentDetail.sex === "1" ? "男" : "女" }</span>
                </Col>
                <Col span={6}>
                  <span>生日:&nbsp;&nbsp;{ studentDetail.birth }</span>
                </Col>
                <Col span={6}>
                  <span>民族:&nbsp;&nbsp;{ studentDetail.ethnic }</span>
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col span={6}>
                  <span>宗教信仰:&nbsp;&nbsp;{ studentDetail.religion }</span>
                </Col>
                <Col span={6}>
                  <span>身份证号:&nbsp;&nbsp;{ studentDetail.id }</span>
                </Col>
                <Col span={6}>
                  <span>家庭住址:&nbsp;&nbsp;{studentDetail.province}{studentDetail.city}{ studentDetail.address }</span>
                </Col>
                <Col span={6}>
                  <span>电话号码:&nbsp;&nbsp;{ studentDetail.phone }</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card style={{marginTop: 10}} title="监护人信息" bordered={false} loading={loading}>
          <Row>
            <Col span={20}>
              <Row>
                <Col span={6}>
                  <span>监护人:&nbsp;&nbsp;{ studentDetail.relativeName1 }</span>
                </Col>
                <Col span={6}>
                  <span>关系:&nbsp;&nbsp;{ studentDetail.relativeRelation1 }</span>
                </Col>
                <Col span={6}>
                  <span>联系电话:&nbsp;&nbsp;{ studentDetail.relativePhone1 }</span>
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col span={6}>
                  <span>监护人:&nbsp;&nbsp;{ studentDetail.relativeName2 }</span>
                </Col>
                <Col span={6}>
                  <span>关系:&nbsp;&nbsp;{ studentDetail.relativeRelation2 }</span>
                </Col>
                <Col span={6}>
                  <span>联系电话:&nbsp;&nbsp;{ studentDetail.relativePhone2 }</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card style={{marginTop: 10}} title="卡劵包" bordered={false} loading={mallLoading}>
          <Table
            columns={columns}
            dataSource={myVirtualGoods}
            rowKey={record => record.createdAt}/>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default StudentDetail;

