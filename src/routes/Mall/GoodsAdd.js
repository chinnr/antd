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
  Checkbox
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { thumbnailPath, rootUrl } from '../../utils/constant';
import options from '../../utils/sell-address-options';
import styles from './index.less';
import {doExchange} from '../../utils/utils';
import colors from '../../static/colors';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const sizeOptions = [
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
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
    fileList: []
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  /**
   * 取消预览
   */
  handleCancel = () => this.setState({ previewVisible: false });

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
   * 提交商品新建
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('添加商品参数: ', values);
      }
    });
  };

  /**
   * 商品图片上传
   * @param info
   */
  handleChange = info => {
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    // fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map(file => {
      // console.log("file==>", file);
      if (file.response) {
        // Component will show file.url as link
        file.url = rootUrl + thumbnailPath + file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log('fileList map: ', fileList);
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

  permuteAndCombine = () => {
    const arr = [
      ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      ['Red', 'Blue', 'Green']
    ];
    console.log(doExchange(arr));
  };

  render() {
    const { fileList, previewVisible, previewImage } = this.state;
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
    const { mall } = this.props;
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
          <Button onClick={() => this.permuteAndCombine()}>测试排列组合</Button>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem
              {...formItemLayout}
              validateStatus={badgeNameError ? 'error' : ''}
              help={badgeNameError || ''}
              label="商品类型"
            >
              {getFieldDecorator('type', {
                initialValue: 0
              })(
                <Select>
                  <Option value={0}>普通商品</Option>
                  <Option value={1}>虚拟商品</Option>
                </Select>
              )}
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
                    required: false,
                    message: '请输入商品名称'
                  }
                ]
              })(<Input placeholder="商品名称" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={badgeNameError ? 'error' : ''}
              help={badgeNameError || ''}
              label="商品编号"
            >
              {getFieldDecorator('sku', {
                rules: [
                  {
                    required: false,
                    message: '请输入商品编号'
                  }
                ]
              })(<Input placeholder="商品编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator('imgs', {
                rules: [{ required: false }]
              })(
                <Upload {...propsObj} fileList={fileList} listType="picture-card" onPreview={this.handlePreview}>
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格">
              {getFieldDecorator('skuSize')(
                <RadioGroup>
                  <Radio value="a">没有规格</Radio>
                  <Radio value="b">有规格</Radio> {/*  ['XXL-red','XXL-blue']  */}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="颜色">
              {getFieldDecorator('color')(
                <CheckboxGroup options={colors} />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="尺寸">
              {getFieldDecorator('size')(<CheckboxGroup options={sizeOptions} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="出售区域">
              {getFieldDecorator('address')(<Cascader options={options} changeOnSelect={true} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="库存">
              {getFieldDecorator('stock')(<InputNumber min={0} max={10000000} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="原价">
              {getFieldDecorator('originalPrice')(<InputNumber min={0} max={10000000} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="折扣">
              {getFieldDecorator('discount')(<InputNumber min={0} max={10000000} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="折后价">
              {getFieldDecorator('price')(<InputNumber min={0} max={10000000} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="产品描述">
              <div className={styles.editorWrap}>
                {getFieldDecorator('description')(
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
              {getFieldDecorator('postPrice')(<InputNumber min={0} max={10000000} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="赠品">
              {getFieldDecorator('goodsJson')(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="上架时间">
              {getFieldDecorator('upTime')(<DatePicker style={{ width: '100%' }} />)}
              <span>不需要显示的商品填写 2999-12-30</span>
            </FormItem>
            <FormItem {...formItemLayout} label="下架时间">
              {getFieldDecorator('downTime')(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={this.hasErrors(getFieldsError())}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default GoodsAdd;
