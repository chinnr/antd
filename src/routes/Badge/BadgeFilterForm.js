import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BadgeList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect()
@Form.create()
export default class BadgeFilterForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      expandForm: false,
      selectedRows: [],
    };
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(!err) {
        console.log("fieldsValue==>", fieldsValue);
        this.props.onSearch(fieldsValue);
      }
    });
  };

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="证章级别">
              {getFieldDecorator('level', {
                initialValue: 'level1',
                rules: [
                  {
                    required: true,
                    message: '请输入证章级别'
                  }
                ]
              })(
                <Select placeholder="请选择证章级别">
                  <Option value="level1">海狸</Option>
                  <Option value="level2">小狼</Option>
                  <Option value="level3">探索</Option>
                  <Option value="level4">乐扶</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="证章阶段">
              {getFieldDecorator('stage', {
                initialValue: 'stage1',
                rules: [
                  {
                    required: true,
                    message: '请输入证章阶段'
                  }
                ]
              })(
                <Select placeholder="请选择证章阶段">
                  <Option value="stage1">阶段1</Option>
                  <Option value="stage2">阶段2</Option>
                  <Option value="stage3">阶段3</Option>
                  <Option value="stage4">阶段4</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="证章分类">
              {getFieldDecorator('class', {
                initialValue: 'class1',
                rules: [
                  {
                    required: true,
                    message: '请输入证章分类'
                  }
                ]
              })(
                <Select placeholder="请选择证章分类">
                  <Option value="class1">基础章</Option>
                  <Option value="class2">兴趣章</Option>
                  <Option value="class3">技能章</Option>
                  <Option value="class4">活动章</Option>
                  <Option value="class5">服务章</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
