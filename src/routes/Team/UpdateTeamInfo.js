import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Modal,
  Radio,
  Cascader,
  Upload,
  Icon
} from 'antd';
import moment from 'moment';
import { Map, Marker } from 'react-amap';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './team.less';
import options from '../../utils/cascader-address-options';
import { routerRedux } from 'dva/router';
import { successNotification } from '../../utils/utils';
import {rootUrl, thumbnailPath} from "../../utils/constant";

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
export default class UpdateTeamInfo extends PureComponent {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      visible: true,
      position: { longitude: 108.291275, latitude: 22.869617 },
      clickable: true,
      draggable: true,
      addr: '',
      clickMap: false,
      gid: '',
      fileList: [],
      teamIcon: '',
      previewVisible: false,
      previewImage: '',
    };
    this.mapPlugins = ['ToolBar'];
    this.isDragMap = false;
    this.dragLocationInfo = {};
  }

  // 地图事件监听
  markerEvents = {
    click: () => {
      console.log('marker clicked!');
    },
    dragend: map => {
      // console.log("dragend.....", map);
      this.props
        .dispatch({
          type: 'team/locationInfo',
          payload: {
            longitude: map.lnglat.lng,
            latitude: map.lnglat.lat
          }
        })
        .then(res => {
          console.log('res locationInfo: ', res);
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
        type: 'team/addrInfo',
        payload: { input: this.state.addr }
      })
      .then(res => {
        console.log('view res: ', res);
        const { addressInfo } = res;
        const _position = {
          longitude: addressInfo.longitude,
          latitude: addressInfo.latitude,
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
    const {form} = this.props;
    const {props} = this;
    const _this = this;
    if (this.isDragMap === true) {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('你拖动了标记, 将采用新标记', this.dragLocationInfo);
          console.log('表单 values ', values);
          let _mien = [];
          values.mien.fileList.map(item => {
            _mien.push(item.response.filename)
          });
          const _description = {
            icon: values.icon.file.response.filename,
            mien: _mien
          };
          this.props
            .dispatch({
              type: 'team/updateTeam',
              payload: {
                gid: this.state.gid,
                form: {
                  createdTime: values.createdTime.toISOString(),
                  province: this.dragLocationInfo.province,
                  city: this.dragLocationInfo.city,
                  district: this.dragLocationInfo.district,
                  address: this.dragLocationInfo.format,
                  longitude: this.dragLocationInfo.longitude,
                  latitude: this.dragLocationInfo.latitude,
                  description: _description
                }
              }
            })
            .then(() => {
              localStorage.removeItem('teamInfo');
              successNotification('修改团信息成功!', function() {
                props.dispatch(routerRedux.push('/team/list'));
              });
            })
            .catch(err => err);
        }
      });
    } else {
      console.log('你没有拖动标记, 将采用原来的标记');
      this.props
        .dispatch({
          type: 'team/addrInfo',
          payload: { input: this.props.form.getFieldValue('address') }
        })
        .then(res => {
          const { addressInfo } = res;
          successNotification('地址转换成功!', function() {
            console.log('addressInfo==>', addressInfo);
            form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                console.log('values: ', values);
                let _mien = [];
                values.mien.fileList.map(item => {
                  _mien.push(item.response.filename)
                });
                const _description = {
                  icon: values.icon.file.response.filename,
                  mien: _mien
                };
                props
                  .dispatch({
                    type: 'team/updateTeam',
                    payload: {
                      gid: _this.state.gid,
                      form: {
                        createdTime: values.createdTime.toISOString(),
                        province: addressInfo.province,
                        city: addressInfo.city,
                        district: addressInfo.district,
                        address: addressInfo.format,
                        longitude: addressInfo.longitude,
                        latitude: addressInfo.latitude,
                        description: _description
                      }
                    }
                  })
                  .then(() => {
                    successNotification('修改团信息成功!', function() {
                      props.dispatch(routerRedux.push('/team/list'));
                    });
                    localStorage.removeItem('teamInfo');
                  })
                  .catch(err => err);
              }
            });
          });
          // console.log('addressInfo==>', addressInfo);
        })
        .catch(err => err);
    }
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 获取要修改的团信息字段
  getBadgeParams = () => {
    let values = {};
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      values = JSON.parse(localStorage.getItem('teamInfo')).record;
    } else {
      // 有 query
      localStorage.setItem(
        'teamInfo',
        JSON.stringify(this.props.location.query)
      );
      values = this.props.location.query.record;
    }
    let keys = Object.keys(values);
    // console.log("values --> ", moment(new Date(values.createdTime), 'YYYY-MM-DD'))
    // console.log("keys --> ", keys)
    this.setState({
      gid: values.gid
    });
    this.props.form.setFieldsValue({
      name: values.name,
      groupLevel: values.groupLevel,
      address: values.address,
      company: values.description.company,
      brief: values.description.brief,
      type: values.type === "" ? "main":"temp",
      createdTime: moment(new Date(values.createdTime), 'YYYY-MM-DD')
    });
    /*keys.map(item => {
      this.props.form.setFieldsValue({
        [item]: values[item]
      });
    });*/
  };

  /**
   * 团部风采图片上传
   * @param info
   */
  handleChange = info => {
    let fileList = info.fileList;
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = rootUrl + thumbnailPath + file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log("图片上传: ",fileList);
    this.setState({ fileList });
  };

  /**
   * 上传团部头像
   * @param info
   */
  handleUploadIcon = info => {
    let teamIcon = info.fileList;
    teamIcon = teamIcon.map(file => {
      if (file.response) {
        file.url = rootUrl + thumbnailPath + file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log("图片上传: ",teamIcon);
    this.setState({ teamIcon });
  };

  /**
   * 上传图片的预览
   * @param file
   */
  handlePreview = file => {
    this.setState({
      previewImage: rootUrl + thumbnailPath + file.response.filename,
      previewVisible: true
    });
  };

  /**
   * 取消预览
   */
  handleCancelPreview = () => this.setState({ previewVisible: false });

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.getBadgeParams();
  }

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '团队列表',
        href: '/team/list'
      },
      {
        title: '团信息修改',
        href: '/team/edit-info'
      }
    ];
    const { clickMap, fileList, teamIcon, previewVisible, previewImage } = this.state;
    const { submitting } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    // Only show error after a field is touched.
    const teamNameError = isFieldTouched('name') && getFieldError('name');
    const groupLevelError =
      isFieldTouched('groupLevel') && getFieldError('groupLevel');
    const createTimeError =
      isFieldTouched('createTime') && getFieldError('createTime');
    const addressError = isFieldTouched('address') && getFieldError('address');

    const propsObj = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      onChange: this.handleChange,
      multiple: true
    };
    const propsObjIcon = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      onChange: this.handleUploadIcon,
      multiple: false
    };

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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderLayout
        title={null}
        content={null}
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              validateStatus={teamNameError ? 'error' : ''}
              help={teamNameError || ''}
              label="团名称"
            >
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入团名称'
                  }
                ]
              })(<Input placeholder="团名称" disabled={true} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={groupLevelError ? 'error' : ''}
              help={groupLevelError || ''}
              label="团部级别"
            >
              {getFieldDecorator('groupLevel', {
                initialValue: ''
              })(
                <Select placeholder="请选择团部级别" disabled={true}>
                  <Option value="level1">海狸</Option>
                  <Option value="level2">小狼</Option>
                  <Option value="level3">探索</Option>
                  <Option value="level4">乐扶</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={createTimeError ? 'error' : ''}
              help={createTimeError || ''}
              label="成立时间"
            >
              {getFieldDecorator('createdTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期'
                  }
                ],
                initialValue: moment(new Date(), 'YYYY-MM-DD')
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={'成立时间'}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团类型"
            >
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: '请选择团类型'
                  }
                ],
                initialValue: 'main'
              })(
                <RadioGroup>
                  <Radio value="main" disabled={true}>
                    普通团
                  </Radio>
                  <Radio value="temp" disabled={true}>
                    临时团
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={createTimeError ? 'error' : ''}
              help={createTimeError || ''}
              label="地区"
            >
              {getFieldDecorator('district', {
                rules: [
                  {
                    required: true,
                    message: '请选择团地区'
                  }
                ],
                initialValue: ['全国']
              })(
                <Cascader
                  options={options}
                  changeOnSelect={true}
                  disabled={true}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={addressError ? 'error' : ''}
              help={addressError || ''}
              label="选择地址"
            >
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入地址'
                  }
                ]
              })(
                <Input
                  placeholder="请输入地址"
                  onChange={e => this.handleAddrChange(e)}
                />
              )}
              <Button
                disabled={!clickMap}
                type="primary"
                onClick={() => this.showModal()}
              >
                查看地图上标记的位置
              </Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属公司"
            >
              {getFieldDecorator('company', {
                rules: [
                  {
                    required: false,
                  }
                ]
              })(
                <Input
                  placeholder="请输入所属公司"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="团部头像">
              {getFieldDecorator('icon')(
                <Upload {...propsObjIcon} fileList={teamIcon} listType="picture-card" onPreview={this.handlePreview}>
                  {teamIcon.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="团部简介"
            >
              {getFieldDecorator('brief')(
                <Input.TextArea
                  placeholder="请输入团部简介"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="团部风采">
              {getFieldDecorator('mien')(
                <Upload {...propsObj} fileList={fileList} listType="picture-card" onPreview={this.handlePreview}>
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              )}
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
            <div style={{ width: '100%', height: 360 }}>
              <Map
                amapkey={'a68fcf7d57d3cc225b948f23003b93f3'}
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

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
