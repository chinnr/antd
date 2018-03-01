import React, { PureComponent } from "react";
import { connect } from "dva";
import { Form, Input, Button, Select,Tabs, Card } from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import CourseForm from './components/CourseForm';
import options from "../../utils/cascader-address-options";
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(({ course, badge }) => ({ course, badge }))
@Form.create()
export default class NewCourse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      level: "level1",
      stage: "stage1",
    };
  }

  // 获取团列表
  getAllBadges = (p = 0) => {
    let _this = this;
    this.props
      .dispatch({
        type: "badge/getAllBadges",
        payload: {
          query: { limit: 10, page: p },
          queryOption: {stage: _this.state.stage, level:_this.stage.level}
        }
      })
      .catch(err => err);
  };

  componentDidMount() {
    // this.getAllBadges();
  }

  render() {
    const { badges, badgesMeta } = this.props.badge;
    console.log("badges--->: ", badges);
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <CourseForm
            badges={badges}
            getAllBadges={(filter) => this.getAllBadges(filter)}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
