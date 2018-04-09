import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Divider,Select,Input,Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import {successNotification} from '../../utils/utils';
import styles from './index.less';
import moment from 'moment';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const {Option} = Select;

@Form.create()
@connect(({ mall }) => ({ mall }))
export default class OrderSendOut extends Component {
  id='';
  componentDidMount() {
    const reg = /\/order-send\/(.+)/;
    const id = this.props.location.pathname.match(reg)[1];
    const queryOption = {
      id: id
    };
    console.log('路由参数: ', this.props.location.pathname, id);
    this.getOrderDetail(0, queryOption);
  }

  /**
   * 获取单个订单
   * @param p
   * @param queryOption
   * @param timeSpan
   */
  getOrderDetail = (p = 0, queryOption = {}, timeSpan = {
    "startTime": "2000/01/01",
    "endTime": "2099/12/31"
  }) => {
    const _this = this;
    this.props
      .dispatch({
        type: 'mall/orderList',
        payload: {
          query: {
            limit: 10,
            page: p
          },
          queryOption: queryOption,
          timeSpan: timeSpan
        }
      }).then(res=>{
        _this.id = _this.props.mall.orderList[0].id;
      })
      .catch(err => err);
  };

  /**
   * 提交发货信息
   * */
  handleSubmit=()=>{
    const {form,dispatch} = this.props;
    const _this = this;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          id:parseInt(this.id),
          status:5,
          expressNumber:[values.expressNumber],
          sender:values.sender
        }

        dispatch({
          type:'mall/updateOrderState',
          payload:{
            form:data
          }
        }).then(res=>{
          successNotification("发货成功",()=>{
            return false;
            // _this.getOrderDetail();
          })
        }).catch(err=>err)
        console.log("submit================>>>>>>>>>>>>>>>>>>>>",data);
      }
    })
  }

  render (){
    const { mall: { orderList },form:{getFieldDecorator} } = this.props;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '订单列表',
        href: '/mall/order-list'
      },
      {
        title: '订单发货',
        href: '/mall/order-send'
      }
    ];

    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'gid',
        key: 'gid',
        width:'40%'
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width:'40%'
      },
      {
        title: '数量（件）',
        dataIndex: 'count',
        key: 'count',
        width:'20%'
      },
    ];

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

    let countTotal = 0;
    let goodsData;

    if(orderList.length>0){
      goodsData = orderList[0].gidJson;
      if(goodsData&&goodsData.length>0){
        goodsData.forEach(item=>{
          countTotal+=item.count;
          if(item.donate&&item.donate.length>0){
            item.children = item.donate;
            item.children.forEach(childrenItem=>{
              countTotal+=childrenItem.count;
            })
          }

        })
      }
    }else{
      goodsData=[];
    }


    console.log("订单=============>>>>>>>>>>>>>",orderList);
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <DescriptionList
            size="large"
            title="订单信息"
            style={{ marginBottom: 32 }}
          >
            <Description term="订单编号">{orderList.length > 0 && orderList[0].sku}</Description>
            <Description term="买家姓名">{orderList.length > 0 && orderList[0].consignee}</Description>
            <Description term="联系电话">{orderList.length > 0 && orderList[0].tel}</Description>
            <Description term="收货地址">{orderList.length > 0 && orderList[0].address}</Description>
          </DescriptionList>
          <Divider />
          <div className={styles.title}>发货商品</div>
          <Table
            style={{ marginBottom: 24 }}
            defaultExpandAllRows={true}
            pagination={false}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="gid"
            footer={() => <div style={{margin:'-16px',height:'53px'}}><div style={{float:'left',width:'40%',textAlign:'left',padding:'16px'}}>总计</div><div style={{float:'right',width:'20%',textAlign:'left',padding:'16px'}}>{countTotal}</div></div>}
          />
          <Divider />
          <div className={styles.title}>物流信息</div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem {...formItemLayout} label="物流公司">
              {getFieldDecorator("sender", {
                rules: [
                  {
                    required: true,
                    message: '请选择物流公司'
                  }
                ]
              })(
                <Select placeholder="请选物流公司">
                  <Option value={"顺丰快递"}>顺丰快递</Option>
                  <Option value={"申通快递"}>申通快递</Option>
                  <Option value={"中通快递"}>中通快递</Option>
                  <Option value={"圆通快递"}>圆通快递</Option>
                  <Option value={"韵达快递"}>韵达快递</Option>
                  <Option value={"邮政快递"}>邮政快递</Option>
                  <Option value={"百世汇通"}>百世汇通</Option>
                  <Option value={"国通快递"}>国通快递</Option>
                  <Option value={"宅急送"}>宅急送</Option>
                  <Option value={"天天快递"}>天天快递</Option>
                  <Option value={"同城快递"}>同城快递</Option>
                  <Option value={"德邦物流"}>德邦物流</Option>
                  <Option value={"联邦物流"}>联邦物流</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="运单号">
              {getFieldDecorator('expressNumber',{
                rules: [
                  {
                    required: true,
                    message: '请输入运单号'
                  }
                ]
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
              >
                发货
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  };
}
