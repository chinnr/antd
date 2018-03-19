import React, {Component} from 'react';
import {Button, Row, Col, Icon, Steps, Card, Form, Input, Select, DatePicker, Table} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
const columns = [
  {
    title: "所属团",
    key: "belong",
    dataIndex: "belong",
  },
  {
    title: "学员名字",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "消耗体验卷（张）",
    key: "experienceTicket",
    dataIndex: "experienceTicket",
  },
  {
    title: "消耗课时券（张）",
    key: "classTicket",
    dataIndex: "classTicket",
  },
  {
    title: "消耗优惠券（张）",
    key: "coupon",
    dataIndex: "coupon"
  },
  {
    title: "消耗优惠券（元）",
    key: "couponMoney",
    dataIndex: "couponMoney",
  },
  {
    title: "消费时间",
    key: "time",
    dataIndex: "time",
  }
];
const sourceData = [
  {
    key: '1',
    name: '张三',
    belong: "",
    experienceTicket: 3,
    classTicket: 3,
    coupon: 3,
    couponMoney: 3,
    time: "2018-3-15"
  },
  {
    key: '2',
    name: '李四',
    belong: "",
    experienceTicket: 4,
    classTicket: 4,
    coupon: 4,
    couponMoney: 4,
    time: "2018-3-15"
  }
]
const onChange = function (date, dateString) {
  console.log(date, dateString);
}

@Form.create()
class Statistics extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    return (
      <PageHeaderLayout
        title={null}
        content={null}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="所属团">
                  {getFieldDecorator('belong')(
                    <Input placeholder=""/>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} label="时间区域">
                  {getFieldDecorator('time')(
                    <RangePicker onChange={onChange}/>
                  )}
                </FormItem>
              </Col>


            </Row>
            <Row>
              <div>
                <span style={{float: 'right', marginBottom: 24}}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>导出</Button>
                </span>
              </div>
            </Row>
          </Form>
          <Table dataSource={sourceData}
                 columns={columns}
                 pagination={false}
                 bordered
          />
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default Statistics;
