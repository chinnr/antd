import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Input, Divider,Row,Col,Form,InputNumber,Select,Button,Radio, Modal,Pagination } from 'antd';
import { routerRedux } from 'dva/router';
import GoodsManageTable from './GoodsManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { successNotification } from '../../utils/utils';
import styles from "./TableForm.less"


const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsManage extends PureComponent {
  columns = [
    {
      title: '商品名称',
      key: 'goodsName',
      render: record => (
        <div>
          <div>{record.name}</div>
          <div>SKU: {record.sku}</div>
        </div>
      )
    },
    {
      title: '原价',
      dataIndex: 'originalPrice'
    },
    {
      title: '折后价',
      dataIndex: 'price'
    },
    {
      title: '库存',
      dataIndex: 'stock'
    },
    {
      title: '销量',
      dataIndex: 'hasSold'
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a onClick={() => this.editGoods(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteGoods(record)}>删除</a>
        </Fragment>
      )
    }
  ];
  state = {
    selectedRows: [],
    goodsTypesVisible:false,
    skuPrefix:'',
    stockStart:0,
    stockEnd:0,
    dispatchInner:{
      type: 'mall/getGoodsList',
      payload: {
        query:{
          page: 0,
          limit: 10,
          sort: ['-createdAt']
        }
      }
    },
    size:10
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };

  handleTableChange = n => {
    console.log(n);
    const { dispatch } = this.props;
    const {dispatchInner,size} = this.state;
    dispatchInner.payload.query.page = n.current - 1;
    dispatchInner.payload.query.limit = size;
    dispatch(dispatchInner);
  };

  editGoods = record =>{
    this.props.dispatch(
      routerRedux.push({
        pathname: '/mall/goods-edit',
        query: {
          record: record
        }
      })
    )
  }

  deleteGoods = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/deleteGoods',
      payload: {
        gid: record.gid
      }
    })
      .then(() => {
        const { mall } = this.props;
        successNotification('操作成功', function() {
          dispatch({
            type: 'mall/getGoodsList',
            payload: {
              page: mall.goodsListMeta.page,
              limit: 10,
              sort: ['-createdAt']
            }
          });
        });
      })
      .catch(err => err);
  };

  //关闭商品类型弹窗
  handleCancel = () => {
    this.setState({
      goodsTypesVisible: false
    })
  };

  //打开商品类型弹窗
  showModal = ()=>{
    this.setState({
      goodsTypesVisible: true
    })
  };

  //商品类型弹窗确认
  handleOk = ()=>{
    const {form} = this.props;
    const selectValues = this.props.form.getFieldValue("skuPrefix");
    const skuPrefix = selectValues.split("|")[1];
    form.setFieldsValue({skuPrefix: selectValues.split("|")[0]});
    form.setFieldsValue({goodsType: selectValues.split("|")[0]});
    this.setState({
      skuPrefix
    })
    this.handleCancel();
  };

  //商品类型翻页
  onPagination = (p) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsType',
      payload: {
        page:  p-1,
        limit: 12,
        sort:["-createdAt"]
      }
    }).catch(err => err)
  };

  //商品条件查询
  handleSearch = (e)=>{
    e.preventDefault();
    const {dispatch,form} = this.props;
    const {stockStart,stockEnd,size} = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          query: {
            page: 0,
            limit: size,
            sort: ["-createdAt"]
          }
        };

        let queryOption = {

        };

        if(stockStart&&stockEnd){
          let stockRange = {};
          stockRange.stockStart = stockStart;
          stockRange.stockEnd = stockEnd;
          payload.stockRange = stockRange;
        }

        if(values.name){
          queryOption.name = values.name;
        }

        if(values.price){
          queryOption.price = values.price;
        }

        if(values.originalPrice){
          queryOption.originalPrice = values.originalPrice;
        }

        if(values.goodsType){
          queryOption.type = values.goodsType;
        }

        payload.queryOption = queryOption;

        dispatch({
          type:'mall/getGoodsList',
          payload
        });

        this.setState({
          dispatchInner:{
            type:'mall/getGoodsList',
            payload
          }
        });

        console.log("提交数据》》》》",payload);
      }
    })
  };

  //分页大小
  showSizeChange = (current,size)=>{
    console.log("size:    ",size);
    const {dispatch} = this.props;
    const {dispatchInner} = this.state;

    dispatchInner.payload.query.page = 0;
    dispatchInner.payload.query.limit = size;

    this.setState({size});
    dispatch(dispatchInner)
  };

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const {mall} = this.props;
    const {skuPrefix} = this.state;
    return (
      <div className={styles.tableListForm}>
        <Modal
          title="选择商品类型"
          visible={this.state.goodsTypesVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}>
          <Row>
            {getFieldDecorator('skuPrefix', {
              initialValue: null
            })(
              <RadioGroup>
                {mall.goodsType.map((item, i) => {
                  return (
                    <Col span={8} key={i}><Radio value={item.skuPrefix+"|"+item.name}>{item.name}</Radio></Col>
                  )
                })}
              </RadioGroup>
            )}
          </Row>
          <Pagination style={{marginTop: 20}} defaultCurrent={1} total={mall.goodsTypeMeta.count-1} onChange={(p)=>this.onPagination(p)}/>
        </Modal>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={8} sm={24}>
              <FormItem label="商品名称">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入商品名称"/>
                )}
              </FormItem>
            </Col>

            <Col md={8} sm={24}>
              <FormItem label="商品类型">
                {getFieldDecorator('goodsType')(
                  <Button onClick={() => this.showModal()}>选择</Button>
                )}
                <span>&nbsp;&nbsp;{skuPrefix}</span>
              </FormItem>

            </Col>

            <Col md={8} sm={24}>
              <FormItem label="原价">
                {getFieldDecorator('originalPrice')(
                  <InputNumber min={1} max={99} style={{width:'100%'}}/>
                )}
              </FormItem>
            </Col>

            <Col md={8} sm={24}>
              <FormItem label="折后价">
                {getFieldDecorator('price')(
                  <InputNumber min={1} max={99} style={{width:'100%'}}/>
                )}
              </FormItem>
            </Col>

            <Col md={8} sm={24}>
              <Row style={{lineHeight:"32px"}}>
                <Col span={7}>
                  <span style={{color:"rgba(0, 0, 0, 0.85)"}}>库存范围：</span>
                </Col>
                <Col span={8}>
                  <InputNumber min={1} max={10000} style={{width:'100%'}}
                               onChange={(v)=>{this.setState({
                                 stockStart:v
                               })}}
                  />
                </Col>
                <Col span={1} style={{textAlign:"center"}}>
                  -
                </Col>
                <Col span={8}>
                  <InputNumber min={1} max={10000} style={{width:'100%'}}
                               onChange={(v)=>{this.setState({
                                  stockEnd:v
                               })}}
                  />
                </Col>
              </Row>

            </Col>
          </Row>



          <Row>
            <Col style={{float: "right"}}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              {/*<Button style={{marginLeft: 8}} onClick={() => this.outPutData()}>导出数据</Button>*/}
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  render() {
    const { mall, loading } = this.props;
    // console.log("goodsList==>", mall)
    const { selectedRows,size } = this.state;
    const list = mall.goodsList;
    const pagination = {
      current: mall.goodsListMeta.page + 1,
      pageSize: mall.goodsListMeta.limit,
      total: mall.goodsListMeta.count
    };
    const data = { list, pagination };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{marginBottom: '10px'}}>{this.renderForm()}</div>
          <GoodsManageTable
            loading={loading}
            selectedRows={selectedRows}
            columns={this.columns}
            data={data}
            pageSize={size}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleTableChange}
            onShowSizeChange={()=>this.showSizeChange()}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodsManage;
