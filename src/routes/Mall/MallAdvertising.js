import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Radio, Select, Table, Pagination } from 'antd';
import { rootUrl, thumbnailPath } from "../../utils/constant";
import { successNotification } from "../../utils/utils";
import AdvertisingForm from './AdvertisingForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CreateForm = Form.create()((props) => {
  const { visible, form, handleAdd, handleCancel, sourceData, onPagination,dataMeta } = props;
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const handleOk = () => {
    validateFields((err, values) => {
      if(!err) {
        console.log('form 111 ', values);
        console.log('form 111 ', values.goods.split('|'));
        const params = {
          gid: values.goods.split('|')[0],
          img: values.goods.split('|')[1]
        }
        handleAdd(params);
      }
    });
  };

  return (
    <Modal
      title="编辑广告位"
      maskClosable={true}
      visible={visible}
      onOk={handleOk}
      onCancel={() => handleCancel()}>
      <Form>
        <FormItem>
          {getFieldDecorator('goods')(
            <RadioGroup>
              {sourceData.map((item, i) => {
                return (
                  <Radio value={item.gid+"|"+item.imgs[0].url} key={i} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: '#eee',marginBottom: 5}}>
                    <img style={{ width: 60, height: 60, display:'inline-block'}} src={rootUrl + thumbnailPath + item.imgs[0].url} />
                    <div style={{ width: 200, backgroundColor: '#fff', display:'inline-block', position: 'relative',height: 40, marginLeft: 20}}>
                      <p style={{margin: 0, position: 'absolute', top:20}}>{item.name}</p>
                      <p style={{margin: 0, position: 'absolute', top: 40}}>{item.sku}</p>
                    </div>
                  </Radio>
                )
              })}
            </RadioGroup>
          )}
        </FormItem>
      </Form>
      <Pagination defaultCurrent={1} total={dataMeta.count} onChange={(p) => onPagination(p)}/>
    </Modal>
  );
});

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class MallAdvertising extends PureComponent {

  columns = [
    {
      title: '商品id',
      dataIndex: 'gid'
    },
    {
      title: '类型图片',
      render: (record) => (
        <span><img style={{ width: 100, height: 100 }} src={record.img} /></span>
      )
    },
    {
      title: '操作',
      render: () => (
        <Fragment>
          <a onClick={()=>this.showModal()}>编辑</a>
        </Fragment>
      )
    }
  ];
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

  /**
   * 修改广告位
   * @returns {*}
   */
  updateAdvertiseList = (form) => {
    console.log("修改广告位: ", form);
    this.setState({
      visible: false
    });
    this.props.dispatch({
      type: 'mall/updateAdvertiseList',
      payload: {
        form: [form]
      }
    }).then(() => {
      successNotification('修改成功', function () {
        console.log("修改成功")
      })
    }).catch(err => err)
  };

  getGoodsList = (p=0) => {
    this.props.dispatch({
      type: 'mall/getGoodsList',
      payload: {
        query: {
          page: p,
          limit: 10,
          sort:["-createdAt"]
        },
        queryOption: {
          type: 0
        }
      }
    }).catch(err => err)
  };

  onPagination = (p) => {
    this.getGoodsList(p-1);
  };

  componentDidMount() {
    this.getGoodsList()
  }

  render() {
    const { mall, loading } = this.props;
    const { selectedRows, visible } = this.state;
    // console.log('advertiseList ', mall.advertiseList);
    // console.log('goodsList ', mall.goodsList);
    const list = mall.advertiseList;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              rowKey={record => Math.random(1, 100)+record.gid}
              dataSource={list}
              columns={this.columns}
              pagination={false}
            />
          </div>
          <CreateForm
            visible={visible}
            sourceData={mall.goodsList}
            dataMeta={mall.goodsListMeta}
            handleCancel={this.handleCancel}
            handleAdd = {this.updateAdvertiseList}
            onPagination = {this.onPagination}
          />
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default MallAdvertising;
