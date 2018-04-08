import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Radio, Select, Table, Pagination } from 'antd';
import { rootUrl, thumbnailPath } from '../../utils/constant';
import { successNotification } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CreateForm = Form.create()(props => {
  const { visible, form, handleAdd, handleCancel, sourceData, onPagination, dataMeta } = props;
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        const params = {
          gid: values.goods.split('|')[0],
          img: rootUrl + thumbnailPath + values.goods.split('|')[1]
        };
        handleAdd(params);
      }
    });
  };

  return (
    <Modal title="编辑广告位" maskClosable={true} visible={visible} onOk={handleOk} onCancel={() => handleCancel()}>
      <Form>
        <FormItem>
          {getFieldDecorator('goods')(
            <RadioGroup>
              {sourceData.map((item, i) => {
                return (
                  <Radio
                    value={item.gid + '|' + item.imgs[0].url}
                    key={i}
                    style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5 }}
                  >
                    <img
                      style={{ width: 60, height: 60, display: 'inline-block' }}
                      src={rootUrl + thumbnailPath + item.imgs[0].url}
                    />
                    <div
                      style={{
                        width: 200,
                        backgroundColor: '#fff',
                        display: 'inline-block',
                        position: 'relative',
                        height: 40,
                        marginLeft: 20
                      }}
                    >
                      <p style={{ margin: 0, position: 'absolute', top: 20 }}>{item.name}</p>
                      <p style={{ margin: 0, position: 'absolute', top: 40 }}>{item.sku}</p>
                    </div>
                  </Radio>
                );
              })}
            </RadioGroup>
          )}
        </FormItem>
      </Form>
      <Pagination defaultCurrent={1} total={dataMeta.count} onChange={p => onPagination(p)} />
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
      title: '广告图',
      render: record => (
        <span>
          <img style={{ height: 50 }} src={record.img} />
        </span>
      )
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <a onClick={() => this.showModal(record)}>编辑</a>
        </Fragment>
      )
    }
  ];
  record = {};
  state = {
    selectedRows: [],
    visible: false
  };

  showModal = (record) => {
    this.record = record;
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  /**
   * 修改广告位
   * @returns {*}
   */
  updateAdvertiseList = form => {
    const _this = this;
    const { mall:{advertiseList} } = this.props;
    const i = advertiseList.indexOf(this.record);
    advertiseList.splice(i, 1, form);
    console.log('修改广告位 form: ', form);
    console.log('修改广告位 advertiseList: ', advertiseList);
    this.setState({
      visible: false
    });
    // const _this = this;
    this.props
      .dispatch({
        type: 'mall/updateAdvertiseList',
        payload: {
          form: advertiseList
        }
      })
      .then(() => {
        successNotification('修改成功', function() {
          _this.getAdvertiseList();
        });
      })
      .catch(err => err);
  };

  /**
   * 获取所有商品
   * @param p
   */
  getGoodsList = (p = 0) => {
    this.props
      .dispatch({
        type: 'mall/getGoodsList',
        payload: {
          query: {
            page: p,
            limit: 10,
            sort: ['-createdAt']
          }
        }
      })
      .catch(err => err);
  };

  /**
   * 获取广告位列表
   */
  getAdvertiseList = () => {
    this.props
      .dispatch({
        type: 'mall/getAdvertiseList',
        payload: null
      })
      .catch(err => err);
  };

  onPagination = p => {
    this.getGoodsList(p - 1);
  };

  componentDidMount() {
    this.getGoodsList();
  }

  render() {
    const { mall, loading } = this.props;
    const { visible } = this.state;
    // console.log('advertiseList ', mall.advertiseList);
    // console.log('mall.advertiseList  ', mall.advertiseList);
    const list = mall.advertiseList;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              rowKey={record => Math.random(1, 100) + record.gid}
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
            handleAdd={this.updateAdvertiseList}
            onPagination={this.onPagination}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default MallAdvertising;
