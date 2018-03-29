import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Input, DatePicker, Upload, Button, Icon, Select, message, Radio, notification, Divider } from 'antd';
import moment from 'moment';
import { thumbnailPath, rootUrl } from "../../utils/constant";
import GoodsTypeTable from './GoodsTypeTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsType extends PureComponent {

  state = {
    selectedRows: [],
    visible: false,
    fileList:[],
    previewVisible:false,
    previewImage:'',
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
      render: (record) => (
        <span><img style={{ width: 100, height: 100 }} src={record.typeImg} /></span>
      )
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          {/*<a onClick={() => this.showModal('editType', record)}>编辑</a>*/}
          {/*<Divider type="vertical"/>*/}
          <a onClick={() => this.deleteGoodsType(record)}>删除</a>
        </Fragment>
      )
    }
  ];
  goodsType = {};

  handleSelectRows = (rows) => {
    console.log('rrrr 33333 ', rows)
    this.setState({
      selectedRows: rows
    });
  };

  showModal = (action, payload) => {
    console.log("payload==>", payload);
    let _typeIcon = [];

    if(action === 'editType') {
      this.goodsType = payload;
      const typeIconItem = {
        uid: Math.random(-100,0),
        name: "xxx",
        url: payload.typeImg,
        status: "done"
      };
      _typeIcon.push(typeIconItem);
      this.setState({
        fileList: _typeIcon
      })
    }
    this.setState({
      visible: true
    })
  };

  handleOk = (e) => {
    this.setState({
      visible: false
    });
    this.goodsType = {};
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
    this.goodsType = {};
  };

  submitGoodsType = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(!err) {
        console.log('form 111 ', values);
        const typeImg = `${rootUrl}${thumbnailPath}${values.typeImg.file.response.filename}`;
        const formData = {
          ...values,
          type: +values.type,
          skuPrefix: 'BLD-'+values.skuPrefix,
          priority: +values.priority,
          expireTime: values['expireTime'].format('YYYY-MM-DD'),
          level: 1,
          typeImg
        };
        let action = '';
        if(JSON.stringify(this.goodsType).length > 2) {
          console.log("edit goodsType");
          action = 'updateGoodsType';
          formData["tid"] = this.goodsType.tid;
          formData["parentId"] = this.goodsType.parentId;
        } else {
          console.log("add goodsType");
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
    dispatch({
      type: 'mall/'+action,
      payload: formData
    })
    .then(() => {
      this.setState({
        visible: false
      }, () => {
        notification["success"]({
          message: '操作成功',
          duration: 2
        });
      });
      // this.handleCancel();
      this.goodsType = {};
    })
  };

  // 删除商品类型
  deleteGoodsType = (record) => {
    const { dispatch } = this.props;
    const { mall:{goodsTypeMeta} } = this.props;
    const {} = this.props;
    dispatch({
      type: 'mall/deleteGoodsType',
      payload: {
        tid: record.tid
      }
    })
      .then(() => {
        this.setState({
          visible: false
        }, () => {
          notification["success"]({
            message: '操作成功',
            duration: 2
          });
          this.getGoodsTypeList(goodsTypeMeta.page)
        })
        // this.handleCancel();
      })
  };

  // 获取类型列表
  getGoodsTypeList = (p) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page: p,
        limit: 10,
        sort:["-createdAt"]
      }
    })
  };

  handleTableChange = (n) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page: n.current - 1,
        limit: 10,
        sort:["-createdAt"]
      }
    })
  };

  //关闭预览
  handleCancelPreview = ()=>{
    this.setState({ previewVisible: false })
  };

  //预览
  handlePreview = (file)=>{
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  };

  // 类型图片上传
  handleChange=(fileList)=>{
    this.setState({ fileList:fileList.fileList });
  };

  render() {
    const { mall, loading } = this.props;
    const { selectedRows, visible, fileList, previewVisible, previewImage } = this.state;
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
    const propsObj = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      multiple: false
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div style={{marginBottom: '10px'}}>
              <Button icon="plus" type="primary" onClick={() => this.showModal('newType', {})}>添加类型</Button>
              {
                selectedRows.length > 0 && (
                  <span style={{marginLeft: '10px'}}>
                    <Button>删除</Button>
                  </span>
                )
              }
            </div>
            <GoodsTypeTable
              loading={loading}
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRows}
              columns={this.columns}
              data={data}
              onChange={this.handleTableChange}
            />
          </div>
          {/*  添加 编辑 商品类型弹窗 */}
          <Modal
            title={len > 2 ? "修改商品类型":"添加商品类型"}
            maskClosable={true}
            visible={visible}
            onOk={() => this.submitGoodsType()}
            onCancel={() => this.handleCancel()}>
            <Form>
              <FormItem
                {...formItemLayout}
                label="类型名称"
              >
                {getFieldDecorator('name', {
                  initialValue: this.goodsType.name,
                  rules: [{ required: true, message: '请输入类型名称' }],
                })(
                  <Input placeholder="请输入类型名称" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="类型标记前缀"
              >
                {getFieldDecorator('skuPrefix', {
                  initialValue: this.goodsType.skuPrefix && this.goodsType.skuPrefix.split('-')[1],
                  rules: [
                    { required: true, message: '请输入类型标记前缀' },
                    {  max: 8, message: '长度超过8个字符' }
                  ],
                })(
                  <Input placeholder="请输入类型标记前缀" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="商品类型选择"
                hasFeedback
              >
                {getFieldDecorator('type', {
                  initialValue: this.goodsType.type,
                  rules: [
                    { required: true, message: '请选择商品类型' }
                  ]
                })(
                  <Select>
                    <Option value={0}>普通商品</Option>
                    <Option value={1}>虚拟商品</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="类型图片"
              >
                {getFieldDecorator('typeImg', {
                  rules: [{ required: true, message: '请上传类型图片' }]
                })(
                  <Upload {...propsObj}
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}>
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="过期时间"
              >
                {getFieldDecorator('expireTime', {
                  initialValue: this.goodsType.expireTime && moment(new Date(this.goodsType.expireTime), "YYYY-MM-DD"),
                  rules: [{ required: true, message: '请选择时间' }]
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="排序"
              >
                {getFieldDecorator('priority', {
                  initialValue: this.goodsType.priority,
                  rules: [{ required: true, message: '请输入排序' }],
                })(
                  <Input type="number" min="0" placeholder="请输入排序" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="是否显示"
              >
                {getFieldDecorator('show', {
                  initialValue: this.goodsType.show,
                })(
                  <RadioGroup>
                    <Radio value={true}>显示</Radio>
                    <Radio value={false}>不显示</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default GoodsType;
