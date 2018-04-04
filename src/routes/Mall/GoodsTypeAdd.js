import React, { PureComponent, Fragment, Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Pagination,
  DatePicker,
  Upload,
  Button,
  Icon,
  Select,
  Checkbox,
  Radio,
  notification,
  Divider,
  InputNumber
} from 'antd';
import moment from 'moment';
import { thumbnailPath, rootUrl } from '../../utils/constant';
import { successNotification } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {routerRedux} from "dva/router";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
export default class GoodsTypeAdd extends Component {
  state = {
    selectedRows: [],
    visible: false,
    fileList: [],
    previewVisible: false,
    goodsTypesVisible: false,
    previewImage: '',
    parentId: ''
  };

  columns = [
    {
      title: '类型名称',
      dataIndex: 'name'
    },
    {
      title: '排序',
      dataIndex: 'level'
    },
    {
      title: '类型图片',
      render: record => (
        <span>
          <img style={{ width: 100, height: 100 }} src={record.typeImg} />
        </span>
      )
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          {/*<a onClick={() => this.showModal('editType', record)}>编辑</a>*/}
          {/*<Divider type="vertical"/>*/}
          <a onClick={() => this.deleteGoodsType(record)}>删除</a>
        </Fragment>
      )
    }
  ];
  goodsType = {};
  action = '';
  payload = {};
  isRemove = false;

  handleOk = e => {
    this.setState({
      goodsTypesVisible: false
    });
    const value = this.props.form.getFieldValue('parentId');
    console.log('父级类型 >>> ', value);
    this.setState({
      parentId: value.split('|')[1]
    });
    this.props.form.setFieldsValue({ parentId: value.split('|')[0] });
  };

  /**
   *  提交产品类型字段
   * **/
  submitGoodsType = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('form 111 ', values);
        console.log('路由参数 ', this.action, this.goodsType);
        let typeImg = '';
        if((this.action === 'editType' && this.isRemove === true) || this.action === 'newType') {  // 换了新图片 或者新建时上传图片
          typeImg = `${rootUrl}${thumbnailPath}${values.typeImg.file.response.filename}`;
        } else { // 用旧图片
          typeImg = values.typeImg;
        }
        const formData = {
          ...values,
          type: +values.type,
          skuPrefix: 'BLD-' + values.skuPrefix,
          priority: +values.priority,
          expireTime: values['expireTime'].format('YYYY-MM-DD'),
          level: 1,
          typeImg
        };
        let action = '';
        if (JSON.stringify(this.goodsType).length > 2) {
          // console.log('edit goodsType');
          action = 'updateGoodsType';
          formData['tid'] = this.goodsType.tid;
          formData['parentId'] = values.parentId;
        } else {
          // console.log('add goodsType');
          action = 'addGoodsType';
        }

        console.log('formData ', formData);
        this.handleGoodsType(formData, action);
      }
    });
  };

  /* 添加/编辑类型 */
  handleGoodsType = (formData, action) => {
    const { dispatch } = this.props;
    const _this = this;
    dispatch({
      type: 'mall/' + action,
      payload: formData
    }).then(() => {
      this.setState(
        {
          visible: false
        },
        () => {
          successNotification( '操作成功', () => {
            this.goToPage()
          });
        }
      );
      _this.goodsType = {};
    });
  };

  // 返回商品类型列表
  goToPage = () => {
    this.props.dispatch(
      routerRedux.push('/mall/goods-type')
    );
  };

  // 删除商品类型
  deleteGoodsType = record => {
    const { dispatch } = this.props;
    const { mall: { goodsTypeMeta } } = this.props;
    const {} = this.props;
    dispatch({
      type: 'mall/deleteGoodsType',
      payload: {
        tid: record.tid
      }
    }).then(() => {
      this.setState(
        {
          visible: false
        },
        () => {
          notification['success']({
            message: '操作成功',
            duration: 2
          });
          this.getGoodsTypeList(goodsTypeMeta.page);
        }
      );
      // this.handleCancel();
    });
  };

  // 获取类型列表
  getGoodsTypeList = p => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page: p,
        limit: 10,
        sort: ['-createdAt']
      }
    }).catch(err => err);
  };

  // 获取具体某一类型
  getOneGoodsType = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getOneGoodsType',
      payload: {
        queryOption: {
          tid : id
        },
        query: {
          limit: 10
        }
      }
    }).then((res) => {
      console.log("goodsTypeDetail >>> ", res[0].name)
      this.setState({
        parentId: res[0].name
      });
      this.props.form.setFieldsValue({ parentId: res[0].tid });
    }).catch(err => err);
  };

  /**
   * 翻页 获取商品类型列表
   * */
  onPagination = p => {
    this.getGoodsTypeList(p - 1);
  };

  /**
   * 显示弹窗
   * @param type
   */
  showModal = type => {
    this.setState({
      [type]: true
    });
  };

  /**
   * 关闭弹窗
   * @param type
   */
  handleCancel = type => {
    this.setState({
      [type]: false
    });
  };

  //关闭预览
  handleCancelPreview = () => {
    this.setState({ previewVisible: false });
  };

  //预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  // 类型图片上传
  handleChange = fileList => {
    this.setState({ fileList: fileList.fileList });
  };

  // 移除原来的图片
  onRemoveIcon = () => {
    if(JSON.stringify(this.goodsType).length > 2) {
      this.isRemove = true;
    }
  };

  componentWillUnmount() {
    localStorage.removeItem("goodsTypeAction");
    localStorage.removeItem("goodsTypePayload");
  }

  componentDidMount() {
    if (this.props.location.query) {
      this.action = this.props.location.query.action;
      this.goodsType = this.props.location.query.payload;
      localStorage.setItem('goodsTypeAction', this.action);
      localStorage.setItem('goodsTypePayload', JSON.stringify(this.goodsType));
    } else {
      this.action = localStorage.getItem('goodsTypeAction');
      this.goodsType = JSON.parse(localStorage.getItem('goodsTypePayload'));
    }
    if(this.action === "editType") {
      let _typeIcon = [];
      const typeIconItem = {
        uid: Math.random(-100, 0),
        name: 'xxx',
        url: this.goodsType.typeImg,
        status: 'done'
      };
      _typeIcon.push(typeIconItem);
      this.setState({
        fileList: _typeIcon
      });
      this.props.form.setFieldsValue({
        typeImg: this.goodsType.typeImg
      });
      if (this.goodsType.parentId) {
        this.getOneGoodsType(this.goodsType.parentId)
      }
    }
  }

  render() {
    const { mall, loading } = this.props;
    const { parentId, fileList, previewVisible, previewImage } = this.state;
    const len = JSON.stringify(this.goodsType).length;
    const list = mall.goodsType;
    const pagination = {
      current: mall.goodsTypeMeta.page + 1,
      pageSize: mall.goodsTypeMeta.limit,
      total: mall.goodsTypeMeta.count
    };
    const data = { list, pagination };
    const { getFieldDecorator, validateFields } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };
    const propsObj = {
      name: 'file',
      action: rootUrl + '/api/young/post/upload/image',
      multiple: false
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '商品类型管理',
        href: '/mall/goods-type'
      },
      {
        title: '新建商品类型',
        href: '/mall/type-edit'
      }
    ];
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Modal
            title="选择商品父级类型"
            visible={this.state.goodsTypesVisible}
            onOk={() => this.handleOk('goodsTypesVisible')}
            onCancel={() => this.handleCancel('goodsTypesVisible')}
          >
            <Row>
              {getFieldDecorator('parentId', {
                initialValue: null
              })(
                <RadioGroup>
                  {mall.goodsType.map((item, i) => {
                    return (
                      <Col span={8} key={i}>
                        <Radio value={item.tid + '|' + item.name}>{item.name}</Radio>
                      </Col>
                    );
                  })}
                </RadioGroup>
              )}
            </Row>
            <Pagination
              style={{ marginTop: 20 }}
              defaultCurrent={1}
              total={mall.goodsTypeMeta.count - 1}
              onChange={p => this.onPagination(p)}
            />
          </Modal>

          <Form onSubmit={this.submitGoodsType} hideRequiredMark>
            <FormItem {...formItemLayout} label="父级类型">
              <Button onClick={() => this.showModal('goodsTypesVisible')}>选择</Button>
              {getFieldDecorator('parentId', {
                initialValue: '',
                rules: [{ required: false, message: '请选择父级类型' }]
              })(<span>&nbsp;&nbsp;{parentId}</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="类型等级">
              {getFieldDecorator('level', {
                initialValue: this.goodsType.level,
                rules: [{ required: true, message: '请输入类型等级' }]
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入类型等级" />)}
              <span>商品类型等级，顶级为0，一级为1依次类推</span>
            </FormItem>
            <FormItem {...formItemLayout} label="类型名称">
              {getFieldDecorator('name', {
                initialValue: this.goodsType.name,
                rules: [{ required: true, message: '请输入类型名称' }]
              })(<Input placeholder="请输入类型名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="类型标记前缀">
              {getFieldDecorator('skuPrefix', {
                initialValue: this.goodsType.skuPrefix && this.goodsType.skuPrefix.split('-')[1],
                rules: [{ required: true, message: '请输入类型标记前缀' }, { max: 16, message: '长度超过8个字符' }]
              })(<Input placeholder="请输入类型标记前缀" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品类型选择" hasFeedback>
              {getFieldDecorator('type', {
                initialValue: this.goodsType.type,
                rules: [{ required: true, message: '请选择商品类型' }]
              })(
                <Select>
                  <Option value={0}>普通商品</Option>
                  <Option value={1}>虚拟商品</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="类型图片">
              {getFieldDecorator('typeImg', {
                rules: [{ required: true, message: '请上传类型图片' }]
              })(
                <Upload
                  {...propsObj}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  onRemove={() => this.onRemoveIcon()}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="过期时间">
              {getFieldDecorator('expireTime', {
                initialValue: this.goodsType.expireTime && moment(new Date(this.goodsType.expireTime), 'YYYY-MM-DD'),
                rules: [{ required: true, message: '请选择时间' }]
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="排序">
              {getFieldDecorator('priority', {
                initialValue: this.goodsType.priority,
                rules: [{ required: true, message: '请输入排序' }]
              })(<Input type="number" min="0" placeholder="请输入排序" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否显示">
              {getFieldDecorator('show', {
                initialValue: this.goodsType.show
              })(
                <RadioGroup>
                  <Radio value={true}>显示</Radio>
                  <Radio value={false}>不显示</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
