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
import { PureComponent } from "react";

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@Form.create()
export default class CourseForm extends PureComponent {
  state={
    level: "level1",
    stage: "stage1",
    // filterBadges: []
  };
  count = 0;
  handleCreate = () => {
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // form.resetFields();
      }
    });
  };

  onSelect(v, type) {
    console.log("onSelect: ", v, type);
    this.setState({
      [type] : v
    }, () => {
      this.props.getAllBadges({level:this.state.level, stage:this.state.stage})
    });
  }

  // handleBadges = (badges) => {
  //   let result =  badges.filter( v => {
  //     if(v.level === this.state.level && v.stage === this.state.stage){
  //       return v
  //     }
  //   });
  //   console.log("handleBadges ==>", result);
  //   this.setState({filterBadges: result});
  //   return result;
  // };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  // 获取筛选的证章
  getFilterBadges = () => {
    console.log("获取筛选的证章");
  };

  render() {
    const { badges } = this.props;
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
        <FormItem {...formItemLayout} label="课程类型">
          {getFieldDecorator("type", {
            initialValue: "0",
            rules: [{ required: true, message: "请选择课程类型!" }]
          })(
            <RadioGroup>
              <Radio value="0">团集会</Radio>
              <Radio value="1">活动</Radio>
              <Radio value="2">兴趣课</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="服务范围">
          {getFieldDecorator("score", {
            initialValue: "public",
            rules: [{ required: true, message: "请输入服务范围!" }]
          })(
            <RadioGroup>
              <Radio value="public">公开</Radio>
              <Radio value="member">仅会员</Radio>
              <Radio value="non-member">非会员</Radio>
              <Radio value="welcome">欢迎课</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程级别">
          {getFieldDecorator("level", {
            initialValue: "level1",
            rules: [{ required: true, message: "请选择课程级别!" }]
          })(
            <Select
              placeholder="请选择课程级别"
              onChange={v => this.onSelect(v, "level")}
            >
              <Option value="level1">海狸</Option>
              <Option value="level2">小狼</Option>
              <Option value="level3">探索</Option>
              <Option value="level4">乐扶</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程阶段">
          {getFieldDecorator("stage", {
            initialValue: "stage1",
            rules: [{ required: true, message: "请选择课程阶段!" }]
          })(
            <Select placeholder="请选择课程阶段" onChange={v => this.onSelect(v, "stage")}>
              <Option value="stage1">阶段1</Option>
              <Option value="stage2">阶段2</Option>
              <Option value="stage3">阶段3</Option>
              <Option value="stage4">阶段4</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程证章">
          {getFieldDecorator("badge", {
            rules: [{ required: true, message: "请选择课程对应的证章!" }]
          })(
            <Select placeholder="请选择课程对应的证章" mode="multiple" onFocus={() => this.getFilterBadges()}>
              {badges.map((item, i) => {
                  return (
                    <Option
                      key={i}
                      value={item.bid}
                    >
                      {item.name}
                    </Option>
                  )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课时">
          {getFieldDecorator("lesson", {
            initialValue: "lesson1",
            rules: [{ required: true, message: "请选择课时!" }]
          })(
            <Select placeholder="请选择课时">
              {lessons.map((item, i) => (
                <Option key={i} value={"lesson" + item.lesson}>
                  {item.value}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="报名截止时间">
          {getFieldDecorator("deadlinedAt", {
            rules: [{ required: true, message: "请选择报名截止时间!" }],
            initialValue: moment(new Date(), "YYYY-MM-DD")
          })(<DatePicker style={{ width: "100%" }} format={dateFormat} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="开课时间">
          {getFieldDecorator("startedAt", {
            rules: [{ required: true, message: "请选择开课时间!" }],
            initialValue: moment(new Date(), "YYYY-MM-DD")
          })(<DatePicker style={{ width: "100%" }} format={dateFormat} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="结课时间">
          {getFieldDecorator("endedAt", {
            rules: [{ required: true, message: "请选择结课时间!" }],
            initialValue: moment(new Date(), "YYYY-MM-DD")
          })(<DatePicker style={{ width: "100%" }} format={dateFormat} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上课地点">
          {getFieldDecorator("courseLocation", {
            rules: [{ required: true, message: "请输入上课地点!" }]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="集合地点">
          {getFieldDecorator("collectLocation", {
            rules: [{ required: true, message: "请输入集合地点!" }]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="体验券">
          {getFieldDecorator("payExpCoupons", {
            rules: [{ required: true, message: "请输入体验券数量!" }]
          })(<InputNumber min={1} style={{ width: "100%" }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="课时券">
          {getFieldDecorator("payClassCoupons", {
            rules: [{ required: true, message: "请输入课时券数量!" }]
          })(<InputNumber min={1} style={{ width: "100%" }} />)}
        </FormItem>
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
        <FormItem style={{ marginTop: 32 }}>
          <CourseIntroduce />
        </FormItem>

        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
          >
            提交
          </Button>
          {/*<Button style={{ marginLeft: 8 }}>保存</Button>*/}
        </FormItem>
      </Form>
    );
  }
}
