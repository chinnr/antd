import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Upload, Button, Modal, Form, Radio, Select, Table, Pagination, Icon, message, Divider } from 'antd';
import { rootUrl, thumbnailPath } from '../../utils/constant';
import { successNotification } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CreateForm = Form.create()(props => {
  const { visible, form, handleAdd, handleCancel, sourceData, onPagination, dataMeta } = props;
  // console.log("sourceData >>> ", sourceData);
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
          img: values.goods.split('|')[1],
          sku: values.goods.split('|')[2]
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
                    value={item.gid + '|' + item.listImg + '|' + item.sku}
                    key={i}
                    style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5 }}
                  >
                    <img
                      style={{ width: 60, height: 60, display: 'inline-block' }}
                      src={rootUrl + thumbnailPath + item.listImg}
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
let goodsImg = '';
@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class MallAdvertising extends PureComponent {
  columns = [
    {
      title: '商品',
      key: 'sku',
      render: record => (
        <Fragment>
          <span style={{ marginRight: 20 }}>{record.sku}</span>
        </Fragment>
      )
    },
    {
      title: '描述',
      key: 'advType',
      render: record => (
        <Fragment>
          <span style={{ marginRight: 20 }}>{record.advType}</span>
        </Fragment>
      )
    },
    {
      title: '广告图',
      key: 'img',
      render: record => (
        <div>
          <img style={{ height: 50 }} src={record.img.indexOf(thumbnailPath) > -1 ? record.img : rootUrl+thumbnailPath+record.img} />
        </div>
      )
    },
    {
      title: '操作',
      key: 'opt',
      render: record => (
        <div>
          <a onClick={() => this.showModal(record, 'editAdv')}>
            <Icon type="form" style={{ fontSize: 18 }} /> 修改商品
          </a>
          <Divider type="vertical" />
          <div style={{ display: 'inline-block' }}>
            <Upload
              name="file"
              action={rootUrl + '/api/young/post/upload/image'}
              multiple={false}
              onChange={info => this.uploadGoodsImg(info, record)}
            >
              <a><Icon type="picture" style={{ fontSize: 16 }}/> 修改图片</a>
            </Upload>
          </div>
          <Divider type="vertical" />
          <a onClick={() => this.deleteAdv(record)}><Icon type="close-circle-o"  style={{ fontSize: 16 }}/>  删除</a>
        </div>
      )
    }
  ];
  record = {};
  btnType = 'new';
  state = {
    selectedRows: [],
    visible: false,
    fileList: []
  };

  showModal = (record, type) => {
    if (type === 'editAdv') {
      this.record = record;
      this.btnType = 'edit';
    } else if (type === 'newAdv') {
      this.btnType = 'new';
    }
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
   * 单独上传 商品广告图片
   * @param info
   * @param record
   */
  uploadGoodsImg = (info, record) => {
    const _this = this;
    if (info.file.status === 'done') {
      console.log('图片上传: ', info);
      console.log('图片gid: ', record.gid);
      const form = {
        gid: record.gid,
        img: info.file.response.filename,
        sku: record.sku
      };
      console.log('form >>> ', form);
      const { mall: { advertiseList } } = this.props;
      delete this.record.advType;
      let copyList = [];
      advertiseList.map(item => {
        copyList.push(JSON.stringify(item));
      });
      const i = copyList.indexOf(JSON.stringify(this.record));
      // const i = advertiseList.indexOf(record);
      advertiseList.splice(i, 1, form);
      console.log('i >>> ', i);
      console.log('advertiseList >>> ', advertiseList);
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
    } else if (info.file.status === 'error') {
      message.error('上传图片失败');
    }
  };

  /**
   * 修改广告位
   * @returns {*}
   */
  updateAdvertiseList = form => {
    const _this = this;
    const { mall: { advertiseList } } = this.props;
    delete this.record.advType;
    let copyList = [];
    advertiseList.map(item => {
      copyList.push(JSON.stringify(item));
    });
    const i = copyList.indexOf(JSON.stringify(this.record));
    // const i = advertiseList.indexOf(this.record);
    advertiseList.splice(i, 1, form);
    this.setState({
      visible: false
    });
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
   * 添加广告位
   * @param form
   */
  addAdvertiseList = form => {
    const _this = this;
    const { mall: { advertiseList } } = this.props;
    advertiseList.push(form);
    this.setState({
      visible: false
    });
    console.log("添加广告位: ", advertiseList);

    this.props
      .dispatch({
        type: 'mall/updateAdvertiseList',
        payload: {
          form: advertiseList
        }
      })
      .then(() => {
        successNotification('添加成功', function() {
          _this.getAdvertiseList();
        });
      })
      .catch(err => err);
  };

  /**
   * 删除广告位
   * @param record
   */
  deleteAdv = (record) => {
    const _this = this;
    const { mall: { advertiseList } } = this.props;
    delete record.advType;
    let copyList = [];
    advertiseList.map(item => {
      console.log("item >>> ", item);
      copyList.push(JSON.stringify(item));
    });
    const i = copyList.indexOf(JSON.stringify(record));
    console.log("copyList >>> ", copyList);
    console.log("删除的图片索引 >>> ", i);
    advertiseList.splice(i, 1);
    // console.log("所有的图片 >>> ", advertiseList);
    // console.log("要删除的图片 >>> ", record);
    // console.log("删除的图片索引 >>> ", i);
    console.log("删除后的图片 >>> ", advertiseList);
    // return ;
    this.setState({
      visible: false
    });
    this.props
      .dispatch({
        type: 'mall/updateAdvertiseList',
        payload: {
          form: advertiseList
        }
      })
      .then(() => {
        successNotification('删除成功', function() {
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
    let _list = JSON.parse(JSON.stringify(list));
    _list.map((item, i) => {
      if(i === 0 ){
        item['advType'] = "首页商品广告"
      }else if(i >= 1 && i<=3) {
        item['advType'] = "召唤轮播商品广告"
      }else if(i === 4) {
        item['advType'] = "资讯页商品广告"
      }else if(i>=5 && i <=9) {
        item['advType'] = "商城轮播商品广告"
      }else if(i>=10 && i <=11) {
        item['advType'] = "商城推荐广告"
      }else if(i>=12 && i <=15) {
        item['advType'] = "单品推荐广告"
      }else {
        item['advType'] = "其他广告"
      }
      return item;
    });
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button disabled={list.length > 20} type={'primary'} onClick={() => this.showModal({}, 'newAdv')}>
              添加广告位
            </Button>
            <br />
            <Table
              loading={loading}
              rowKey={record => Math.random(1, 100) + record.gid}
              dataSource={_list}
              columns={this.columns}
              pagination={false}
            />
          </div>
          <CreateForm
            visible={visible}
            sourceData={mall.goodsList}
            dataMeta={mall.goodsListMeta}
            handleCancel={this.handleCancel}
            handleAdd={this.btnType === 'edit' ? this.updateAdvertiseList : this.addAdvertiseList}
            onPagination={this.onPagination}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default MallAdvertising;
