import React, { Component } from "react";
import moment from "moment";
import { connect } from "dva";
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  DatePicker,
} from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ statistics }) => ({ statistics })) //stateToProps:把state的staticstics映射到组件的props上
@Form.create()
class Statistics extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const notDefaultTime = values.time1;
        const time = {
          startTime: notDefaultTime
            ? moment(values.time1[0]).format("YYYY/MM/DD")
            : "2017/1/1",
          endTime: notDefaultTime
            ? moment(values.time1[1]).format("YYYY/MM/DD")
            : "2020/12/31"
        };
        console.log(time);
        this.send(time);
        // console.log('Received values of form: ', values);
      }
    });
  };

  handleSubmit2 = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const notDefaultTime = values.time1;
        const time = {
          startTime: notDefaultTime
            ? moment(values.time1[0]).format("YYYY/MM/DD")
            : "2017/1/1",
          endTime: notDefaultTime
            ? moment(values.time1[1]).format("YYYY/MM/DD")
            : "2020/12/31"
        };
        console.log(time);
        this.send(time);
      }
    });
  };

  send(time) {
    this.props.dispatch({
      type: "statistics/getStatics", //触发函数:*getStatics
      payload: {
        form: time
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    return (
      <PageHeaderLayout title={null} content={null}>
        <Row getter={24} type="flex" justify="space-around">
          <Col md={7} sm={24} style={{ marginTop: 5 }}>
            <Card bordered={false} title="消费明细表">
              <Form
                onSubmit={this.handleSubmit}
                style={{ textAlign: "center" }}
              >
                <FormItem {...formItemLayout} label="消费时间">
                  {getFieldDecorator("time1")(<RangePicker />)}
                </FormItem>
                <Button type="primary" htmlType="submit">
                  导出
                </Button>
              </Form>
            </Card>
          </Col>
          <Col md={7} sm={24} style={{ marginTop: 5 }}>
            <Card bordered={false} title="团部信息统计表">
              <Form
                onSubmit={this.handleSubmit2}
                style={{ textAlign: "center" }}
              >
                <FormItem {...formItemLayout} label="统计时间">
                  {getFieldDecorator("time2")(<RangePicker />)}
                </FormItem>
                <Button type="primary" htmlType="submit">
                  导出
                </Button>
              </Form>
            </Card>
          </Col>
          <Col md={7} sm={24} style={{ marginTop: 5 }}>
            <Card bordered={false} title="会员数据表">
              <Form style={{ textAlign: "center" }}>
                <FormItem {...formItemLayout} label="注册时间">
                  {getFieldDecorator("time3")(<RangePicker />)}
                </FormItem>
                <Button type="primary" htmlType="submit">
                  导出
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}

export default Statistics;
