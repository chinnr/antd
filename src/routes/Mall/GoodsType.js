import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { List, Card, Row, Col, Modal, Form, Radio, Input, DatePicker, Upload, Progress, Button, Icon, Dropdown, Menu, Avatar, Select } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;
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
      <span><img src={record.typeImg} /></span>
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

const CreateForm = Form.create()((props) => {
  const { visible, form, handleAdd, handleCancel } = props;
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const handleOk = () => {
    validateFields((err, values) => {
      if(!err) {
        console.log('form 111 ', values)
        const formData = {
          ...values,
          expireTime: values['expireTime'].format('YYYY-MM-DD'),
          level: 1
        };

        console.log('formData ', formData)
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
            rules: [{ required: true, message: 'Please input name...' }],
          })(
            <Input placeholder="请输入类型名称" />
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
            <Upload>
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
            <Input placeholder="请输入排序" />
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
  handleAdd = (fields) => {

  };

  render() {
    const { mall, loading } = this.props;
    const { selectedRows, visible } = this.state;
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
            <StandardTable
              loading={loading}
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRows}
              columns={columns}
              data={data}
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
