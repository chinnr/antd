import React, { Component } from "react";
import {
  Card,
  Table,
  Divider,
  Form,
  Popconfirm,
  Select,
  Button,
  Input
} from "antd";
import { connect } from "dva";
import {routerRedux} from "dva/router";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import {handleLevel, handleSore, handleStage} from "../../utils/utils";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ course }) => ({ course }))
@Form.create()
export default class CourseTempalteList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "课程类型",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "课程级别",
        dataIndex: "level",
        key: "level",
      },
      {
        title: "课程阶段",
        dataIndex: "stage",
        key: "stage",
      },
      {
        title: "课程主题",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "服务范围",
        dataIndex: "score",
        key: "score",
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        render: (text, record) => (
          <span>
            <a onClick={() => this.goToPage(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该证章?"
              onConfirm={() => this.confirmDelete(record)}
              onCancel={() => this.cancelDelete()}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];
    this.state = {
      data: [],
      visible: false,
      username: '',
      filterValue: 1,
    };
  }

  // 跳转到修改编辑页面
  goToPage = (record) => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: "/team/"+path,
    //     query: {
    //       record: record
    //     }
    //   })
    // );
  };

  // 确认删除该模板
  confirmDelete = (record) => {
    // this.props.dispatch({
    //   type: "post/updatePost",
    //   payload: {
    //     argv: {
    //       id: id,
    //       isActive: false,
    //     }
    //   }
    // }).catch(err => err)
  };

  // 取消删除
  cancelDelete = () => {
    return false;
  };

  // 处理翻页
  onPagination = p => {
    console.log("处理翻页==>", p);
  };

  // 筛选
  onChange = (e) => {
    // console.log('radio checked', e.target.value);
    // this.setState({
    //   filterValue: e.target.value,
    // });
  };

  filter = (e) => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // form.resetFields();
      }
    });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const pagination = {
      total: 26,
      pageSize: 10,
      current: 1
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const {filterValue} = this.state;
    // const { courseTempList, courseTempListMeta } = this.props.course;

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <div>
            <Form layout={"inline"} onSubmit={this.filter}>
              <FormItem label="课程主题">
                {getFieldDecorator("title")(
                  <Input />
                )}
              </FormItem>
              <FormItem label="类型">
                {getFieldDecorator("type", {
                  initialValue: '0'
                })(
                  <Select placeholder="请选择课程类型">
                    <Option value="0">团集会</Option>
                    <Option value="1">活动</Option>
                    <Option value="2">兴趣课</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="课程级别">
                {getFieldDecorator("level", {
                  initialValue: "level1",
                })(
                  <Select placeholder="请选择课程级别">
                    <Option value="level1">海狸</Option>
                    <Option value="level2">小狼</Option>
                    <Option value="level3">探索</Option>
                    <Option value="level4">乐扶</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="课程阶段">
                {getFieldDecorator("stage", {
                  initialValue: "stage1"
                })(
                  <Select placeholder="请选择课程阶段">
                    <Option value="stage1">阶段1</Option>
                    <Option value="stage2">阶段2</Option>
                    <Option value="stage3">阶段3</Option>
                    <Option value="stage4">阶段4</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="服务范围">
                {getFieldDecorator("score", {
                  initialValue: "public"
                })(
                  <Select placeholder="请选择课程服务范围">
                    <Option value="public">公开</Option>
                    <Option value="member">仅会员</Option>
                    <Option value="non-member">非会员</Option>
                    <Option value="welcome">欢迎课</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                >
                  筛选
                </Button>
              </FormItem>
            </Form>
          </div>
          <Table
            bordered
            rowKey={record => record.gid}
            dataSource={[]}
            columns={this.columns}
            pagination={pagination}
            onChange={p => this.onPagination(p)}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
