import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Radio, Select, Modal, Button, InputNumber, Divider, Avatar } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {routerRedux} from "dva/router";
import {successNotification} from "../../utils/utils";
import {rootUrl, thumbnailPath} from "../../utils/constant";
import styles from './StudentDetail.less';

const { Description } = DescriptionList;

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CreateForm = Form.create()(props => {
  const { visible, form, handleAdd, handleCancel, sourceData} = props;
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  let cardNum = 0; // 卡券数量

  const handleNumChange = (v) => {
    console.log("handleNumChange==>", v);
    cardNum = v;
  };

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        const params = {
          gid: values.goods.split('|')[0],
          num: cardNum
        };
        handleAdd(params);
      }
    });
  };

  return (
    <Modal title="卡券列表" maskClosable={true} visible={visible} onOk={handleOk} onCancel={() => handleCancel()}>
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
                    <span>数量: </span>
                    <InputNumber min={0} max={100000} onChange={(v) => handleNumChange(v)}/>
                  </Radio>
                );
              })}
            </RadioGroup>
          )}
        </FormItem>
      </Form>
      {/*<Pagination defaultCurrent={1} total={dataMeta.count} onChange={p => onPagination(p)} />*/}
    </Modal>
  );
});

@connect(({ student, mall, loading }) => ({
  studentDetail: student.studentDetail,
  loading: loading.models.student,
  mallLoading: loading.models.mall,
  myVirtualGoods: mall.myVirtualGoods,
  goodsList: mall.goodsList,
  virtualGoodsCount: mall.virtualGoodsCount,
}))
class StudentDetail extends PureComponent {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
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
          },
          queryOption: {
            type: 1
          }
        }
      })
      .catch(err => err);
  };

   /**
   * 赠送卡券
   */
  donateVirtualGoods = form => {
    this.setState({
      visible: false
    });
    const hash = window.location.hash;
    console.log("reg: ", hash.split("/")[2]);
    console.log("赠送卡券: ", form);
    form["uid"] = hash.split("/")[2];
    this.props
      .dispatch({
        type: 'mall/donateVirtualGoods',
        payload: {
          form: form
        }
      })
      .then(() => {
        successNotification('操作成功', function() {
          return false
        });
      })
      .catch(err => err);
  };

  componentDidMount() {
    this.getGoodsList();
  }

  render() {
    const { visible } = this.state;
    const { loading, goodsList, mallLoading, studentDetail, virtualGoodsCount,myVirtualGoods } = this.props;
    console.log("优惠券：     ",myVirtualGoods);

    const duty = studentDetail.isLead ? studentDetail.leadList.join('') : '无';
    const levelObj = {
      level1: '海狸',
      level2: '小狼',
      level3: '探索',
      level4: '乐扶'
    };
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '学员管理',
        href: '/student'
      },
      {
        title: '学员详情',
        href: '/student-detail'
      }
    ];

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false} loading={loading} style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <Avatar size="large" src={studentDetail.icon} /><span className={styles.realName}>{studentDetail.realName}</span>
          </div>
          <DescriptionList style={{ marginBottom: 32 }}>
            <Description term="童军号">{studentDetail.number}</Description>
            <Description term="阶段">{levelObj[studentDetail.level]}</Description>
            <Description term="所属团">{studentDetail.group}</Description>
            <Description term="所属队伍">{studentDetail.classNameAlias}</Description>
            <Description term="职务">{duty}</Description>

          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="性别">{studentDetail.sex === '1' ? '男' : '女'}</Description>
            <Description term="生日">{studentDetail.birth}</Description>
            <Description term="电话号码">{studentDetail.phone}</Description>
            <Description term="民族">{studentDetail.ethnic}</Description>
            <Description term="宗教信仰">{studentDetail.religion}</Description>
            <Description term="身份证号">{studentDetail.id}</Description>
            <Description term="家庭住址">{studentDetail.province}{studentDetail.city}{studentDetail.address}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="亲属信息">
            <Description term="监护人1">{studentDetail.relativeName1}</Description>
            <Description term="关系">{studentDetail.relativeRelation1}</Description>
            <Description term="联系电话">{studentDetail.relativePhone1}</Description>
            <Description term="监护人2">{studentDetail.relativeName2}</Description>
            <Description term="关系">{studentDetail.relativeRelation2}</Description>
            <Description term="联系电话">{studentDetail.relativePhone2}</Description>
          </DescriptionList>
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          title="卡券信息"
          bordered={false}
          extra={<Button type="primary" onClick={() => this.showModal()} style={{ margin: -16 }}>赠送卡券</Button>}
        >
          <DescriptionList>
            <Description term="剩余课时券">{virtualGoodsCount.keshi}</Description>
            <Description term="剩余体验券">{virtualGoodsCount.tiyan}</Description>
          </DescriptionList>
          <CreateForm
            visible={visible}
            sourceData={goodsList}
            handleCancel={this.handleCancel}
            handleAdd={this.donateVirtualGoods}
            onPagination={this.onPagination}
          />
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          title="优惠券信息"
          bordered={false}
        >
          {myVirtualGoods.length>=1&&myVirtualGoods.map((item,index)=>{
            return(
              <p key={Math.random(0,10000)}>{index+1}，面值：{item.value}  数量：{item.count}</p>
            )
          })}
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default StudentDetail;
