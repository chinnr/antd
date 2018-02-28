import React, { PureComponent } from "react";
import { connect } from "dva";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Modal,
  Radio,
  Cascader
} from "antd";
import moment from "moment";
import { Map, Marker } from "react-amap";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./team.less";
import options from '../../utils/cascader-address-options';

const pluginProps = {
  enableHighAccuracy: true,
  timeout: 10000,
  showButton: true
};

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@connect(({ team }) => ({ team }))
@Form.create()
export default class UpdateTeamAccount extends PureComponent {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      visible: true,
      position: { longitude: 108.291275, latitude: 22.869617 },
      clickable: true,
      draggable: true,
      addr: "",
      clickMap: false,
      gid: ""
    };
    this.mapPlugins = ["ToolBar"];
    this.isDragMap = false;
    this.dragLocationInfo = {};
  }

  // 地图事件监听
  markerEvents = {
    click: () => {
      console.log("marker clicked!");
    },
    dragend: map => {
      // console.log("dragend.....", map);
      this.props
        .dispatch({
          type: "team/locationInfo",
          payload: {
            longitude: map.lnglat.lng,
            latitude: map.lnglat.lat
          }
        })
        .then(res => {
          console.log("res locationInfo: ", res);
          // 重新设置输入框地址
          this.props.form.setFieldsValue({ address: res.locationInfo.format });
          this.isDragMap = true;
          this.dragLocationInfo = res.locationInfo;
        })
        .catch(err => err);
    }
  };

  // 点击弹出地图
  showModal = () => {
    this.props
      .dispatch({
        type: "team/addrInfo",
        payload: { input: this.state.addr }
      })
      .then(res => {
        console.log("view res: ", res);
        const { addressInfo } = res;
        const _position = {
          longitude: addressInfo.longitude,
          latitude: addressInfo.latitude
        };
        this.setState(
          {
            position: _position
          },
          () => {
            this.setState({
              modalVisible: true
            });
          }
        );
      })
      .catch(err => err);
  };

  // 点击弹窗确认
  handleOk = e => {
    // console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  // 点击弹窗取消
  handleCancel = e => {
    // console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  // 处理地址
  handleAddrChange = e => {
    console.log("处理地址...", e.target.value);
    this.setState({ addr: e.target.value }, () => {
      if (this.state.addr.length > 0) {
        this.setState({ clickMap: true });
      } else {
        this.setState({ clickMap: false });
      }
    });
  };

  // 提交新建团信息
  handleSubmit = e => {
    e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("表单 values ", values);
          /*this.props
            .dispatch({
              type: "team/updateTeam",
              payload: {
                formHead: {
                  username: values.username,
                  password: values.password,
                  phone: "86-" + values.phone,
                  level: "level4"
                },
                gid: this.state.gid,
              }
            }).then(() => localStorage.removeItem("teamAccount"))
            .catch(err => err);*/
        }
      });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 获取要修改的团信息字段
  getBadgeParams = () => {
    let values = {};
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      values = JSON.parse(localStorage.getItem("teamAccount")).record;
    } else {
      // 有 query
      localStorage.setItem(
        "teamAccount",
        JSON.stringify(this.props.location.query)
      );
      values = this.props.location.query.record;
    }
    let keys = Object.keys(values);
    this.setState({
      gid: values.gid
    });
    keys.map(item => {
      this.props.form.setFieldsValue({
        [item]: values[item]
      });
    });
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.getBadgeParams();
  }

  render() {
    const { clickMap } = this.state;
    const { submitting } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    // Only show error after a field is touched.
    const usernameError =
      isFieldTouched("username") && getFieldError("username");
    const passwordError =
      isFieldTouched("password") && getFieldError("password");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");

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

    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              validateStatus={usernameError ? "error" : ""}
              help={usernameError || ""}
              label="团长账号"
            >
              {getFieldDecorator("username", {
                initialValue: "1004",
                rules: [
                  {
                    required: true,
                    message: "请输入团长账号"
                  }
                ]
              })(<Input placeholder="团长账号" disabled={true}/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={passwordError ? "error" : ""}
              help={passwordError || ""}
              label="团长昵称"
            >
              {getFieldDecorator("nickname", {
                rules: [
                  {
                    required: true,
                    message: "请输入团长昵称"
                  }
                ]
              })(<Input placeholder="团长昵称" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={phoneError ? "error" : ""}
              help={phoneError || ""}
              label="团长电话"
            >
              {getFieldDecorator("phone", {
                rules: [
                  {
                    required: true,
                    message: "请输入团长电话"
                  }
                ]
              })(<Input placeholder="团长电话" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={this.hasErrors(getFieldsError())}
              >
                提交
              </Button>
              {/*<Button style={{ marginLeft: 8 }}>保存</Button>*/}
            </FormItem>
          </Form>
        </Card>
        <Modal
          title="请选择标记位置"
          visible={this.state.modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <div>
            <div style={{ width: "100%", height: 360 }}>
              <Map
                amapkey={"a68fcf7d57d3cc225b948f23003b93f3"}
                plugins={this.mapPlugins}
                center={this.state.position}
                zoom={60}
              >
                <Marker
                  events={this.markerEvents}
                  position={this.state.position}
                  visible={this.state.visible}
                  clickable={this.state.clickable}
                  draggable={this.state.draggable}
                />
              </Map>
            </div>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
