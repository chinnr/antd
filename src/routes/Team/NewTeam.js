import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, Modal
} from 'antd';
import moment from 'moment';
import { Map, Marker } from 'react-amap';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './team.less';


const pluginProps = {
  enableHighAccuracy:true,
  timeout: 10000,
  showButton: true
}

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ team }) => ({team}))
@Form.create()
export default class NewTeam extends PureComponent {
  constructor(){
    super();
    this.state = {
      modalVisible: false,
      visible: true,
      position: {longitude: 108.291275, latitude: 22.869617 },
      clickable: true,
      draggable: true,
      addr: ""
    };
    this.mapPlugins = ['ToolBar'];
    this.markerEvents = {
      click: () => {
        console.log('marker clicked!')
      },
      dragend: (lnglat) => {
        console.log("dragend.....", lnglat)
      }
    }
  }

  // 点击弹出地图
  showModal = () => {
    this.props.dispatch({
      type: "team/addrInfo",
      payload: {input: this.state.addr}
    }).then(res => {
      console.log("view res: ", res);
      const {addressInfo} = res;
      const _position = {
        longitude: addressInfo.longitude,
        latitude: addressInfo.latitude
      };
      this.setState({
        position: _position
      }, () => {
        this.setState({
          modalVisible: true,
        });
      })
    }).catch(err => err);

  };

  // 点击弹窗确认
  handleOk = (e) => {
    // console.log(e);
    this.setState({
      modalVisible: false,
    });
  };

  // 点击弹窗取消
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      modalVisible: false,
    });
  };

  // 处理地址
  handleAddrChange = (e) => {
    console.log("处理地址...", e.target.value);
    this.setState({addr: e.target.value})
  };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.dispatch({
      type: "team/addrInfo",
      payload: {input: this.state.addr}
    }).then(res => {
      const {addressInfo} = res;
      console.log("addressInfo==>", addressInfo);

      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("NewTeam==>", values);

          this.props.dispatch({
            type: 'team/createTeam',
            payload: {
              "formHead": {
                "username": values.username,
                "password": values.password,
                "phone": '86-'+values.phone,
                "level": 'level4',
              },
              "formGroup": {
                "name": values.name,
                "groupLevel": values.groupLevel,
                "createdTime": "2018-02-07",
                "province": addressInfo.province,
                "city": addressInfo.city,
                "district": addressInfo.district,
                "address": addressInfo.format,
                "longitude": addressInfo.longitude,
                "latitude": addressInfo.latitude
              }},
          }).catch(err => err);
        }
      }).catch(err => err);

    });

  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
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
              label="团名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入团名称',
                }],
              })(
                <Input placeholder="团名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团部级别"
            >
                {getFieldDecorator('groupLevel', {
                  initialValue: 'level4'
                })(
                  <Select
                    placeholder="请选择团部级别"
                  >
                    <Option value="level1">海狸</Option>
                    <Option value="level2">小狼</Option>
                    <Option value="level3">探索</Option>
                    <Option value="level4">乐扶</Option>
                  </Select>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="成立时间"
            >
              {getFieldDecorator('createTime', {
                rules: [{
                  required: true, message: '请选择起止日期',
                }],
                initialValue: moment(new Date(), 'YYYY-MM-DD')
              })(
                <DatePicker style={{ width: '100%' }} placeholder={'成立时间'} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择地址"
            >
              {getFieldDecorator('address', {
                rules: [{
                  required: true, message: '请输入地址',
                }],
              })(
                <Input placeholder="请输入地址" onChange={(e) => this.handleAddrChange(e)}/>
              )}
              <Button type="primary" onClick={() => this.showModal()}>查看地图上标记的位置</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团长账号"
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: '请输入团长账号',
                }],
              })(
                <Input placeholder="团长账号" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团长密码"
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入团长密码',
                }],
              })(
                <Input placeholder="团长密码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团长电话"
            >
              {getFieldDecorator('phone', {
                rules: [{
                  required: true, message: '请输入团长电话',
                }],
              })(
                <Input placeholder="团长电话" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
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
            <div style={{width: '100%', height: 360}}>
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
