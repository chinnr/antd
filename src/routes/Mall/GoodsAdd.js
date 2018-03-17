import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Form,
  Upload,
  Icon,
  Radio,
  Modal,
  DatePicker,
  InputNumber,
  Cascader,
  Select,
  Checkbox,
  Pagination
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { thumbnailPath, rootUrl } from '../../utils/constant';
import options from '../../utils/cascader-address-options';
import styles from './index.less';
import {doExchange, successNotification} from '../../utils/utils';
import colors from '../../static/colors';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const sizeOptions = [
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
  { label: 'XXXL', value: 'XXXL' }
];
let uuid = 0;

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsAdd extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    showSku: false,
    goodsTypesVisible: false,
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  /**
   * 取消预览
   */
  handleCancelPreview = () => this.setState({ previewVisible: false });

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
   * 提交新建商品
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let images = [], skuSizeList = [];
        values.imgs.fileList.map(item => {
          images.push(item.name)
        });
        values.imgs = images;
        values.listImg = images[0];
        // toISOString()  province  city imgs downTime  expireTime  upTime skuSize==>先是大小再到颜色
        // goodsJson 格式 data:[{gid,count}]
        // sku=skuPrefix+skuPure+skuSize
        values.expireTime  = values.downTime.toISOString();
        values.upTime = values.upTime.toISOString();
        values.downTime = values.downTime.toISOString();
        skuSizeList = [values.color, values.size];
        // values.sku = 'BLD-'+values.sku;
        // values.skuSize = doExchange(skuSize);
        values.skuSizeList = doExchange(skuSizeList);
        // values.skuPrefix = "BLD-"+values.skuPrefix;
        values.skuPure = values.name;
        values.province = values.address[0];
        values.city = values.address[1];
        console.log('添加商品参数 -->: ', values);
        delete values.color;
        delete values.size;
        delete values.address;
        delete values.goodsJson;
        this.addGoods(values);
      }
    });
  };

  /**
   * 商品图片上传
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
    console.log("商品图片上传: ",fileList);
    this.setState({ fileList });
  };

  /**
   * 正文图片上传
   * @param param
   */
  uploadFn = param => {
    // console.log("param==>", param);
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const mediaLibrary = this.editorInstance.getMediaLibraryInstance();

    const successFn = response => {
      // console.log("图片上传成功:", JSON.parse(xhr.responseText));
      const fileName = JSON.parse(xhr.responseText).filename;
      const imgUrl = 'https://api.yichui.net/api/young/post/download/image/origin/' + fileName;
      param.success({ url: imgUrl });
    };

    const progressFn = event => {
      param.progress(event.loaded / event.total * 100);
    };

    const errorFn = response => {
      param.error({
        msg: 'unable to upload.'
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', 'https://api.yichui.net/api/young/post/upload/image', true);
    xhr.send(fd);
  };

  /**
   * 添加商品规格
   * */
  showSku = (v) => {
    console.log("添加商品规格: ", v.target.value);
    this.setState({showSku:v.target.value})
  };

  addGoods = (values) => {
    const props = this.props;
    props.dispatch({
      type: 'mall/addGoods',
      payload: values
    }).then(() => {
      successNotification('添加商品成功', function() {
        // props.dispatch(routerRedux.push('/badge/list'));
      });
    }).catch(err=>err)
  };

  /**
   * 获取商品类型列表
   * */
  onPagination = (p) => {
    const { dispatch, mall } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page:  p-1,
        limit: 10,
        sort:["-createdAt"]
      }
    })
  };

  showGoodTypes = () => {
    this.setState({
      goodsTypesVisible: true
    })
  };
  handleOk = () => {
    this.setState({
      goodsTypesVisible: false
    })
  };
  handleCancel = () => {
    this.setState({
      goodsTypesVisible: false
    })
  };


  render() {
    const { mall, loading } = this.props;
    console.log("mall ===> ", mall);
    const { fileList, previewVisible, previewImage, showSku } = this.state;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue } = this.props.form;
    const editorProps = {
      height: 200,
      tabIndents: 2,
      contentFormat: 'html',
      initialContent: '<p>Hello World!</p>'
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const propsObj = {
      name: 'file',
      action: 'https://api.yichui.net/api/young/post/upload/image',
      onChange: this.handleChange,
      multiple: true
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 10 }
      }
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '商品管理',
        href: '/mall/goods-list'
      },
      {
        title: '添加商品',
        href: '/mall/goods-add'
      }
    ];

    const badgeNameError = isFieldTouched('name') && getFieldError('name');

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Modal
            title="Basic Modal"
            visible={this.state.goodsTypesVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
            <Row>
              {getFieldDecorator('skuPrefix', {
                initialValue: null
              })(
                <RadioGroup>
                  {mall.goodsType.map((item, i) => {
                    return (
                      <Col span={8} key={i}><Radio value={item.skuPrefix}>{item.name}</Radio></Col>
                    )
                  })}
                </RadioGroup>
              )}
            </Row>
            <Pagination style={{marginTop: 20}} defaultCurrent={1} total={mall.count} onChange={(p)=>this.onPagination(p)}/>
          </Modal>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem
              {...formItemLayout}
              label="商品类型"
            >
                <Button onClick={() => this.showGoodTypes()}>选择</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={badgeNameError ? 'error' : ''}
              help={badgeNameError || ''}
              label="商品名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称'
                  },
                  {
                    max: 8,
                    message: '名称不能够过长'
                  }
                ]
              })(<Input placeholder="商品名称" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品编号"
            >
              {getFieldDecorator('skuPure', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品编号'
                  }
                ]
              })(<Input placeholder="商品编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator('imgs', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品图片'
                  }
                 ]
              })(
                <Upload {...propsObj} fileList={fileList} listType="picture-card" onPreview={this.handlePreview}>
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格">
              {getFieldDecorator('skuSizeList',{
                initialValue: false,
              })(
                <RadioGroup onChange={(v) => this.showSku(v)}>
                  <Radio value={false}>没有规格</Radio>
                  <Radio value={true}>有规格</Radio> {/*  ['XXL-red','XXL-blue']  */}
                </RadioGroup>
              )}
            </FormItem>
            {showSku &&
              <FormItem {...formItemLayout} label="颜色">
                {getFieldDecorator('color', {
                  rules: [
                    {
                      required: true,
                      message: '请选择颜色'
                    }
                  ]
                })(
                  <CheckboxGroup options={colors}/>
                )}
              </FormItem>
            }
            {showSku &&
              <FormItem {...formItemLayout} label="尺寸">
                {getFieldDecorator('size', {
                  rules: [
                    {
                      required: true,
                      message: '请选择尺寸'
                    }
                  ]
                })(<CheckboxGroup options={sizeOptions} />)}
              </FormItem>
            }

            <FormItem {...formItemLayout} label="出售区域">
              {getFieldDecorator('address',{
                rules: [
                  {
                    required: true,
                    message: '请选择出售区域'
                  }
                ]
              })(
                <Cascader options={options} changeOnSelect={true} placeholder="请选择销售区域" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="库存">
              {getFieldDecorator('stock',{
                rules: [
                  {
                    required: true,
                    message: '请输入库存'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="原价">
              {getFieldDecorator('originalPrice',{
                rules: [
                  {
                    required: true,
                    message: '请输入原价'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="折扣">
              {getFieldDecorator('discount',{
                rules: [
                  {
                    required: true,
                    message: '请输入折扣'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>*/}
            <FormItem {...formItemLayout} label="折后价">
              {getFieldDecorator('price',{
                rules: [
                  {
                    required: true,
                    message: '请输入折后价'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem label="产品描述">
              <div className={styles.editorWrap}>
                {getFieldDecorator('description',{
                  rules: [
                    {
                      required: true,
                      message: '请输入产品描述'
                    }
                  ]
                })(
                  <BraftEditor
                    {...editorProps}
                    ref={instance => (this.editorInstance = instance)}
                    media={{
                      image: true,
                      uploadFn: param => this.uploadFn(param)
                    }}
                  />
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="邮费">
              {getFieldDecorator('postPrice',{
                rules: [
                  {
                    required: true,
                    message: '请输入邮费'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="赠品">
              {getFieldDecorator('goodsJson',{
                rules: [
                  {
                    required: true,
                    message: '请选择赠品'
                  }
                ]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="上架时间">
              {getFieldDecorator('upTime',{
                rules: [
                  {
                    required: true,
                    message: '请选择上架时间'
                  }
                ]
              })(
                <DatePicker style={{ width: '100%' }} />
              )}
              <span>不需要显示的商品填写 2999-12-30</span>
            </FormItem>
            <FormItem {...formItemLayout} label="下架时间">
              {getFieldDecorator('downTime',{
                rules: [
                  {
                    required: true,
                    message: '请选择下架时间'
                  }
                ]
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="过期时间">
              {getFieldDecorator('expireTime',{
                rules: [
                  {
                    required: true,
                    message: '过期时间'
                  }
                ]
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>*/}
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
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default GoodsAdd;
