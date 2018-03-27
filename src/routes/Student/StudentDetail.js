import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Row, Col,Form, Radio, Select, Modal, Button, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {routerRedux} from "dva/router";
import {successNotification} from "../../utils/utils";
import {rootUrl, thumbnailPath} from "../../utils/constant";

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
  goodsList: mall.goodsList
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
    const { loading, goodsList,mallLoading, studentDetail, myVirtualGoods } = this.props;
    console.log('goodsList==> ', goodsList);

    const duty = studentDetail.isLead ? studentDetail.leadList.join('') : '无';
    const levelObj = {
      level1: '海狸',
      level2: '小狼',
      level3: '探索',
      level4: '乐扶'
    };
    const columns = [
      {
        title: '卡劵类型',
        key: 'cardType',
        dataIndex: 'cardType'
      },
      {
        title: '余额',
        key: 'value',
        dataIndex: 'value'
      }
    ];

    return (
      <PageHeaderLayout title="学员详情">
        <Card title="入团信息" bordered={false} loading={loading}>
          <Row>
            <Col span={20}>
              <Row>
                <Col span={6}>
                  <span>编号:&nbsp;&nbsp;{studentDetail.number}</span>
                </Col>
                <Col span={6}>
                  <span>阶段:&nbsp;&nbsp;{levelObj[studentDetail.level]}</span>
                </Col>
                <Col span={6}>
                  <span>团属:&nbsp;&nbsp;{studentDetail.group}</span>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col span={6}>
                  <span>所在组:&nbsp;&nbsp;{studentDetail.classNameAlias}</span>
                </Col>
                <Col span={6}>
                  <span>职务:&nbsp;&nbsp;{duty}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 10 }}
          title="基本信息"
          bordered={false}
          loading={loading}
        >
          <Row>
            <Col span={20}>
              <Row>
                <Col span={6}>
                  <span>姓名:&nbsp;&nbsp;{studentDetail.realName}</span>
                </Col>
                <Col span={6}>
                  <span>
                    性别:&nbsp;&nbsp;{studentDetail.sex === '1' ? '男' : '女'}
                  </span>
                </Col>
                <Col span={6}>
                  <span>生日:&nbsp;&nbsp;{studentDetail.birth}</span>
                </Col>
                <Col span={6}>
                  <span>民族:&nbsp;&nbsp;{studentDetail.ethnic}</span>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col span={6}>
                  <span>宗教信仰:&nbsp;&nbsp;{studentDetail.religion}</span>
                </Col>
                <Col span={6}>
                  <span>身份证号:&nbsp;&nbsp;{studentDetail.id}</span>
                </Col>
                <Col span={6}>
                  <span>
                    家庭住址:&nbsp;&nbsp;{studentDetail.province}
                    {studentDetail.city}
                    {studentDetail.address}
                  </span>
                </Col>
                <Col span={6}>
                  <span>电话号码:&nbsp;&nbsp;{studentDetail.phone}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 10 }}
          title="监护人信息"
          bordered={false}
          loading={loading}
        >
          <Row>
            <Col span={20}>
              <Row>
                <Col span={6}>
                  <span>监护人:&nbsp;&nbsp;{studentDetail.relativeName1}</span>
                </Col>
                <Col span={6}>
                  <span>
                    关系:&nbsp;&nbsp;{studentDetail.relativeRelation1}
                  </span>
                </Col>
                <Col span={6}>
                  <span>
                    联系电话:&nbsp;&nbsp;{studentDetail.relativePhone1}
                  </span>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col span={6}>
                  <span>监护人:&nbsp;&nbsp;{studentDetail.relativeName2}</span>
                </Col>
                <Col span={6}>
                  <span>
                    关系:&nbsp;&nbsp;{studentDetail.relativeRelation2}
                  </span>
                </Col>
                <Col span={6}>
                  <span>
                    联系电话:&nbsp;&nbsp;{studentDetail.relativePhone2}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 10 }}
          title="卡劵包"
          bordered={false}
          loading={mallLoading}
        >
          <Button type="primary" onClick={() => this.showModal()}>赠送卡券</Button>
          <Table
            columns={columns}
            dataSource={myVirtualGoods}
            rowKey={record => record.createdAt}
          />
          <CreateForm
            visible={visible}
            sourceData={goodsList}
            handleCancel={this.handleCancel}
            handleAdd={this.donateVirtualGoods}
            onPagination={this.onPagination}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default StudentDetail;
