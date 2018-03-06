
import React, { PureComponent } from "react";
import {connect} from "dva";
import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber
} from "antd";
import moment from "moment";
import CourseIntroduce from "./CourseIntroduce";
import CourseImageUpload from "./CourseImageUpload";
import {successNotification} from "../../../utils/utils";
import {routerRedux} from "dva/router";

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(({ course, badge }) => ({ course, badge }))
@Form.create()
export default class CourseForm extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      level: 1,
      stage: 1,
    };
  }
  handleCreate = (e) => {
    e.preventDefault();
    const form = this.props.form;
    const props = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: "course/createCourseTemplate",
          payload: values
        }).then(() => {
          successNotification("新建课程模板成功", function() {
            // props.dispatch(routerRedux.push('/badge/list'));
            // if (type === 'updateBadge') {
            //   localStorage.removeItem('badgeParams');
            //   localStorage.setItem('isEditBadge', 'false');
            // }
          });
          form.resetFields();
        }).catch( err => err )
      }
    });
  };

  onSelect(v, type) {
    console.log("onSelect: ", v, type);
    let _this = this;
    this.setState({
      [type] : v
    }, () => {
      this.getAllBadges(0,{level:_this.state.level, stage:_this.state.stage})
    });
  }


  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 获取团列表
  getAllBadges = (p = 0) => {
    let _this = this;
    this.props
      .dispatch({
        type: "badge/getAllBadges",
        payload: {
          query: { limit: 10, page: p },
          queryOption: {stage: _this.state.stage, level:_this.state.level}
        }
      })
      .catch(err => err);
  };

  componentDidMount() {
    this.props.form.validateFields();
    this.getAllBadges();
  }

  render() {
    const { badges } = this.props.badge;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };

    const lessons = new Array(12)
      .fill(0)
      .map((_, i) => i + 1)
      .map(v => {
        return {
          value: v + " 课时",
          lesson: v
        };
      });

    // Only show error after a field is touched.
    const teamNameError = isFieldTouched("name") && getFieldError("name");

    return (
      <Form onSubmit={this.handleCreate}>
        <FormItem {...formItemLayout} label="课程主题">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "请输入课程主题!" }]
          })(<Input />)}
        </FormItem>
        {/*<FormItem {...formItemLayout} label="课程类型">
          {getFieldDecorator("type1", {
            initialValue: 0,
            rules: [{ required: true, message: "请选择课程类型!" }]
          })(
            <RadioGroup>
              <Radio value={0}>团集会</Radio>
              <Radio value={1}>活动</Radio>
              <Radio value={2}>兴趣课</Radio>
            </RadioGroup>
          )}
        </FormItem>*/}
        <FormItem {...formItemLayout} label="开课方式">
          {getFieldDecorator("type", {
            initialValue: 0,
            rules: [{ required: true, message: "请选择课程类型!" }]
          })(
            <RadioGroup>
              <Radio value={0}>普通课</Radio>
              <Radio value={1}>常驻课</Radio>
              <Radio value={2}>夏令营</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="服务范围">
          {getFieldDecorator("score", {
            initialValue: "",
            rules: [{ required: true, message: "请输入服务范围!" }]
          })(
            <TextArea rows={4} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课时">
          {getFieldDecorator("lesson", {
            initialValue: 1,
            rules: [{ required: true, message: "请选择课时!" }]
          })(
            <Select placeholder="请选择课时">
              {lessons.map((item, i) => {
                return (
                  <Option value={item.lesson} key={i}>{item.value}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程人数">
          {getFieldDecorator("capacity", {
            initialValue: 0,
            rules: [{ required: true, message: "请输入课程人数!" }]
          })(
            <InputNumber min={0} max={300} style={{width: '100%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程级别">
          {getFieldDecorator("level", {
            initialValue: 1,
            rules: [{ required: true, message: "请选择课程级别!" }]
          })(
            <Select
              placeholder="请选择课程级别"
              onChange={v => this.onSelect(v, "level")}
            >
              <Option value={1}>海狸</Option>
              <Option value={2}>小狼</Option>
              <Option value={3}>探索</Option>
              <Option value={4}>乐扶</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程阶段">
          {getFieldDecorator("stage", {
            initialValue: 1,
            rules: [{ required: true, message: "请选择课程阶段!" }]
          })(
            <Select placeholder="请选择课程阶段" onChange={v => this.onSelect(v, "stage")}>
              <Option value={1}>阶段1</Option>
              <Option value={2}>阶段2</Option>
              <Option value={3}>阶段3</Option>
              <Option value={4}>阶段4</Option>
            </Select>
          )}
        </FormItem>
        {/*<FormItem {...formItemLayout} label="课程证章">*/}
          {/*{getFieldDecorator("badge", {*/}
            {/*rules: [{ required: true, message: "请选择课程对应的证章!" }]*/}
          {/*})(*/}
            {/*<Select placeholder="请选择课程对应的证章" mode="multiple" onFocus={() => this.getAllBadges()}>*/}
              {/*{badges.map((item, i) => {*/}
                  {/*return (*/}
                    {/*<Option*/}
                      {/*key={i}*/}
                      {/*value={item.bid}*/}
                    {/*>*/}
                      {/*{item.name}*/}
                    {/*</Option>*/}
                  {/*)*/}
              {/*})}*/}
            {/*</Select>*/}
          {/*)}*/}
        {/*</FormItem>*/}
        <FormItem {...formItemLayout} label="课程内容">
          {getFieldDecorator("content", {
            rules: [{ required: true, message: "请输入课程内容!" }]
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="报名须知">
          {getFieldDecorator("note", {
            rules: [{ required: true, message: "请输入报名须知!" }]
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="课程封面">
          {getFieldDecorator("cover")(
            <CourseImageUpload form={this.props.form} uploadType={"cover"}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程风采">
          {getFieldDecorator("gallery")(
            <CourseImageUpload form={this.props.form} uploadType={"gallery"}/>
          )}
        </FormItem>
        <FormItem style={{ marginTop: 32 }}>
          {getFieldDecorator("description", {
          })(
            <CourseIntroduce form={this.props.form}/>
          )}
        </FormItem>

        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
          >
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}
