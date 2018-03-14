import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Form, Upload, Icon, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {message} from "antd/lib/index";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsAdd extends PureComponent {

  state = {
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("添加商品参数: ",values)
      }
    })
  };
  propsObj = {
    name: 'file',
    action: 'https://api.yichui.net/api/young/post/upload/image',
    onChange(info) {
      if(info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if(info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };


  render() {
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
    const { mall } = this.props;
    const breadcrumbList = [{
      title: '首页',
      href: '/',
    }, {
      title: '商品管理',
      href: '/mall/goods-list',
    }, {
      title: '添加商品',
      href: '/mall/goods-add',
    }];

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
                <Upload {...this.propsObj}>
                  <Button>
                    <Icon type="upload" /> 点击上传图片
                  </Button>
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
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default GoodsAdd;
