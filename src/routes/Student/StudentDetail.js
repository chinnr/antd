import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ student, loading }) => ({
  studentDetail: student.studentDetail,
  loading: loading.models.student
}))
class StudentDetail extends PureComponent {

  render() {
    const { loading, studentDetail } = this.props;
    console.log('list ', studentDetail);
    const gridStyle = {
      width: '33%',
      textAlign: 'left'
    };

    return (
      <PageHeaderLayout title="学员详情">
        <Card title="基本信息" bordered={false} loading={loading}>
          <Card.Grid style={gridStyle}>姓名:&nbsp;&nbsp;{ studentDetail.realname }</Card.Grid>
          <Card.Grid style={gridStyle}>性别:&nbsp;&nbsp;{ studentDetail.sex }</Card.Grid>
          <Card.Grid style={gridStyle}>生日:&nbsp;&nbsp;{ studentDetail.birth }</Card.Grid>
          <Card.Grid style={gridStyle}>民族:&nbsp;&nbsp;{ studentDetail.ethnic }</Card.Grid>
          <Card.Grid style={gridStyle}>宗教信仰:&nbsp;&nbsp;{ studentDetail.religion }</Card.Grid>
          <Card.Grid style={gridStyle}>身份证号:&nbsp;&nbsp;{ studentDetail.id }</Card.Grid>
          <Card.Grid style={gridStyle}>家庭住址:&nbsp;&nbsp;{ studentDetail.address }</Card.Grid>
        </Card>
        <Card style={{marginTop: 10}} title="监护人信息" bordered={false} loading={loading}>
          <Card.Grid style={gridStyle}>监护人:&nbsp;&nbsp;{ studentDetail.relativeName1 }</Card.Grid>
          <Card.Grid style={gridStyle}>关系:&nbsp;&nbsp;{ studentDetail.relativeRelation1 }</Card.Grid>
          <Card.Grid style={gridStyle}>联系电话:&nbsp;&nbsp;{ studentDetail.relativePhone1 }</Card.Grid>
          <Card.Grid style={gridStyle}>监护人:&nbsp;&nbsp;{ studentDetail.relativeName2 }</Card.Grid>
          <Card.Grid style={gridStyle}>关系:&nbsp;&nbsp;{ studentDetail.relativeRelation2 }</Card.Grid>
          <Card.Grid style={gridStyle}>联系电话:&nbsp;&nbsp;{ studentDetail.relativePhone2 }</Card.Grid>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default StudentDetail;

