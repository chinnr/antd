import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Form, Upload, Icon, Radio, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { thumbnailPath, rootUrl } from "../../utils/constant";
import {message} from "antd/lib/index";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsAdd extends Component {

  state = {
    previewVisible: false,
    previewImage: '',
    fileList:[]
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: rootUrl + thumbnailPath + file.response.filename,
      previewVisible: true,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("添加商品参数: ",values)
      }
    })
  };

  handleChange = (info) => {
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    // fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
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
    console.log("fileList map: ", fileList);
    this.setState({ fileList });
  };

  render() {
    const {fileList, previewVisible, previewImage} = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
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
      multiple: true,
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
    const { mall } = this.props;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '商品管理',
        href: '/mall/goods-list',
      },
      {
        title: '添加商品',
        href: '/mall/goods-add',
      }
    ];

    const badgeNameError = isFieldTouched('name') && getFieldError('name');

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              validateStatus={badgeNameError ? 'error' : ''}
              help={badgeNameError || ''}
              label="商品类型"
            >
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品类型'
                  }
                ]
              })(<Input placeholder="商品类型" />)}
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
                    required: true,
                    message: '请输入商品编号'
                  }
                ]
              })(<Input placeholder="商品编号" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品图片"
            >
              {getFieldDecorator('imgs', {
                rules: [{ required: true }]
              })(
                <Upload
                  {...propsObj}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={this.handlePreview}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品规格"
            >
              {getFieldDecorator('skuSize')(
                <RadioGroup>
                  <Radio value="a">没有规格</Radio>
                  <Radio value="b">有规格</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="出售区域"
            >
              {getFieldDecorator('radio-group')(
                <RadioGroup>
                  <Radio value="a">没有规格</Radio>
                  <Radio value="b">有规格</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="库存"
            >
              {getFieldDecorator('stock')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="原价"
            >
              {getFieldDecorator('originalPrice')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="折扣"
            >
              {getFieldDecorator('discount')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="折后价"
            >
              {getFieldDecorator('price')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="产品描述"
            >
              {getFieldDecorator('description')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮费"
            >
              {getFieldDecorator('postPrice')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="赠品"
            >
              {getFieldDecorator('goodsJson')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="下架时间"
            >
              {getFieldDecorator('upTime')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="过期时间"
            >
              {getFieldDecorator('downTime')(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="产品描述"
            >
              {getFieldDecorator('description')(
                <Input />
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
              {/*<Button style={{ marginLeft: 8 }}>保存</Button>*/}
            </FormItem>
          </Form>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout>
    )
  }
}

export default GoodsAdd;
