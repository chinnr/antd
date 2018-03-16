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

  componentDidMount() {
    console.log("StudentDetail componentDidMount");
    this.props.dispatch({
      type: 'student/getUserVirtualGoods',
      payload: {
        page: 0,
        limit: 10,
      }
    })
  }

  /**
   * 赠送卡券
   */
  donateVirtualGoods = (v) => {
    console.log("record: ", v)
    /*this.props.donateVirtualGoods({
      type: 'mall/donateVirtualGoods',
      payload: {
        num: 1,
        donate: {
          uid: "31c42b66-26b1-4a82-af98-7ec0cba60ecc", // 用户id
          cardType: '课时券', // 卡券类型，如果不是卡券则为空(课时券、体验券、优惠券)
          cardBag: '',  // 卡包图片地址
          status: '',  // 商品状态 0:持有 1:已消耗 2:冻结中
          value: '',  // 商品价值，如充值卡面额
          cardExpireTime:'',  // 卡券过期时间
          isDonate:true,  // 是否是赠送
        }
      },
    }).catch(err => err)*/
  };

  render() {
    const { loading, mallLoading, studentDetail, myVirtualGoods } = this.props;
    console.log('list ', studentDetail);
    console.log('myVirtualGoods ', myVirtualGoods);
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
            {/*<a>修改余额</a>*/}
            <a onClick={() => this.donateVirtualGoods(record)}>赠送</a>
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

