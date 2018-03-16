import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Input, DatePicker, Upload, Button, Icon, Select, message } from 'antd';
import { thumbnailPath, rootUrl } from "../../utils/constant";
import GoodsTypeTable from './GoodsTypeTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;

const CreateForm = Form.create()((props) => {
  const { visible, form, handleAdd, handleCancel } = props;
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const propsObj = {
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
  const handleOk = () => {
    validateFields((err, values) => {
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

        console.log('formData ', formData)
        handleAdd(formData);
      }
    });
  };

  return (
    <Modal
      title="添加商品类型"
      maskClosable={true}
      visible={visible}
      onOk={handleOk}
      onCancel={() => handleCancel()}>
      <Form>
        <FormItem
          {...formItemLayout}
          label="类型名称"
        >
          {getFieldDecorator('name', {
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
            rules: [{ required: true, message: '类型标记标记前缀' }],
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
            rules: [
              { required: true, message: '请选择商品类型' }
            ]
          })(
            <Select>
              <Option value="0">普通商品</Option>
              <Option value="1">虚拟商品</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="类型图片"
        >
          {getFieldDecorator('typeImg', {
            rules: [{ required: true }]
          })(
            <Upload {...propsObj}>
              <Button>
                <Icon type="upload" /> 点击上传图片
              </Button>
            </Upload>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="过期时间"
        >
          {getFieldDecorator('expireTime', {
            rules: [{ required: true, message: '请选择时间' }]
          })(
            <DatePicker/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="排序"
        >
          {getFieldDecorator('priority', {
            rules: [{ required: true, message: 'Please input name...' }],
          })(
            <Input type="number" min="0" placeholder="请输入排序" />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
})

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsType extends PureComponent {

  state = {
    selectedRows: [],
    visible: false
  };

  handleSelectRows = (rows) => {
    console.log('rrrr 33333 ', rows)
    this.setState({
      selectedRows: rows
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    })
  };

  handleOk = (e) => {
    this.setState({
      visible: false
    })
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  };

  /* 添加类型 */
  handleAdd = (formData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/addGoodsType',
      payload: formData
    })
    .then(() => {
      this.handleCancel();
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

  render() {
    const { mall, loading } = this.props;
    const { selectedRows, visible } = this.state;
    // console.log('selectedRows111111 ', selectedRows)
    const columns = [
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
        render: () => (
          <Fragment>
            <a href="">编辑</a>
          </Fragment>
        )
      }
    ];
    const list = mall.goodsType;
    const pagination = {
      current: mall.page + 1,
      pageSize: mall.limit,
      total: mall.count
    };
    const data = { list, pagination };
    return (
      <PageHeaderLayout title="商品类型列表">
        <Card bordered={false}>
          <div>
            <div style={{marginBottom: '10px'}}>
              <Button icon="plus" type="primary" onClick={this.showModal}>添加类型</Button>
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
              columns={columns}
              data={data}
              onChange={this.handleTableChange}
            />
          </div>
          <CreateForm
            visible={visible}
            handleCancel={this.handleCancel}
            handleAdd = {this.handleAdd}
          />
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default GoodsType;
