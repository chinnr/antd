import React, {Component} from "react";
import {
  Card,
  Table,
  Divider,
  Form,
  Popconfirm,
  Select,
  Button,
  Input,
  Row,
  Col
} from "antd";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import {
  handleLevel,
  handleSore,
  handleStage,
  handleType,
  successNotification
} from "../../utils/utils";
import styles from './CourseTemplateList.less';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({course}) => ({course}))
@Form.create()
export default class CourseTempalteList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "课程类型",
        dataIndex: "type",
        key: "type",
        render: (text, record) => <span>{handleType(record.type)}</span>
      },
      {
        title: "课程级别",
        dataIndex: "level",
        key: "level",
        render: (text, record) => <span>{handleLevel(record.level)}</span>
      },
      {
        title: "课程阶段",
        dataIndex: "stage",
        key: "stage",
        render: (text, record) => <span>{handleStage(record.stage)}</span>
      },
      {
        title: "课程主题",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "服务范围",
        dataIndex: "score",
        key: "score"
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        render: (text, record) => (
          <span>
            <a onClick={() => this.goToPage(record)}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm
              title="确定删除?"
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
      username: "",
      filterValue: 1
    };
  }

  // 跳转到修改编辑页面
  goToPage = record => {
    localStorage.setItem("courseId", record.id);
    this.props.dispatch(
      routerRedux.push({
        pathname: "/course/edit",
        query: {
          record: record
        }
      })
    );
  };

  // 确认删除该模板
  confirmDelete = record => {
    const { courseTemplatePubListMeta } = this.props.course;
    this.props.dispatch({
      type: "course/deleteCourseTemplate",
      payload: {
        id: record.id,
      }
    }).then(()=>{
      successNotification("删除成功", function () {
        this.getTempList(courseTemplatePubListMeta.page);
      })
      }).catch(err => err)
  };

  // 取消删除
  cancelDelete = () => {
    return false;
  };

  // 处理翻页
  onPagination = p => {
    console.log("处理翻页==>", p.current);
    const page = p.current;
    this.getTempList(page - 1);
  };

  // 筛选
  onChange = e => {
    // console.log('radio checked', e.target.value);
    // this.setState({
    //   filterValue: e.target.value,
    // });
  };

  filter = e => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        const {course: {courseTemplatePubListMeta}} = this.props;
        this.getTempList(courseTemplatePubListMeta.p, values);
        form.resetFields();
      }
    });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 获取课程模板列表
  getTempList = (p = 0, keyJson = {}) => {
    console.log("获取课程模板列表==>", Number(p), keyJson);
    this.props
      .dispatch({
        type: "course/courseTemplatePubList",
        payload: {
          tempQuery: {
            limit: 10,
            page: p,
            keyJson: JSON.stringify(keyJson)
          },
          badgeQuery: {
            limit: 10,
            page: p
          }
        }
      })
      .catch(err => err);
  };

  componentWillMount() {
    // this.getTempList();
  }

  componentDidMount() {
    // this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
    } = this.props.form;
    const {filterValue} = this.state;
    const {
      courseTemplatePubList,
      courseTemplatePubListMeta
    } = this.props.course;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10}
      }
    };

    let pagination = {
      total: courseTemplatePubListMeta.count,
      pageSize: 10,
      current: courseTemplatePubListMeta.page + 1
    };

    console.log("courseTemplatePubList==>", courseTemplatePubList);

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form layout={"inline"} onSubmit={this.filter}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24} xl={8}>
                  <FormItem {...formItemLayout} label="课程主题">
                    {getFieldDecorator("title")(<Input/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24} xl={8}>
                  <FormItem {...formItemLayout} label="类型">
                    {getFieldDecorator("type", {
                      initialValue: 0
                    })(
                      <Select placeholder="请选择课程类型">
                        <Option value={0}>团集会</Option>
                        <Option value={1}>活动</Option>
                        <Option value={2}>兴趣课</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24} xl={8}>
                  <FormItem {...formItemLayout} label="课程级别">
                    {getFieldDecorator("level", {
                      initialValue: 1
                    })(
                      <Select placeholder="请选择课程级别">
                        <Option value={1}>海狸</Option>
                        <Option value={2}>小狼</Option>
                        <Option value={3}>探索</Option>
                        <Option value={4}>乐扶</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24} xl={8}>
                <FormItem {...formItemLayout} label="课程阶段">
                  {getFieldDecorator("stage", {
                    initialValue: 1
                  })(
                    <Select placeholder="请选择课程阶段">
                      <Option value={1}>阶段1</Option>
                      <Option value={2}>阶段2</Option>
                      <Option value={3}>阶段3</Option>
                      <Option value={4}>阶段4</Option>
                    </Select>
                  )}
                </FormItem>
                </Col>
                <Col md={8} sm={24} xl={8}>
                <FormItem {...formItemLayout} label="服务范围">
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
                </Col>

              </Row>
              <Row>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.hasErrors(getFieldsError())}
                    style={{float:"right"}}
                  >
                    筛选
                  </Button>
                </FormItem>
              </Row>
            </Form>
          </div>
          <Table
            rowKey={record => record.id}
            dataSource={courseTemplatePubList}
            columns={this.columns}
            pagination={pagination}
            onChange={p => this.onPagination(p)}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
