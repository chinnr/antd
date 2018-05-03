import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Form,
  Upload,
  Icon,
  Radio,
  Modal,
  DatePicker,
  InputNumber,
  Cascader,
  Select,
  Checkbox,
  Pagination
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { thumbnailPath, rootUrl } from '../../utils/constant';
import options from '../../utils/cascader-address-options';
import styles from './index.less';
import {doExchange, successNotification} from '../../utils/utils';
import colors from '../../static/colors';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

const sizeOptions = [
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
  { label: 'XXXL', value: 'XXXL' }
];
let uuid = 0;

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()
class GoodsAdd extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    showSku: false,
    goodsTypesVisible: false,
    goodsListVisible: false,
    giftList: [], // 赠品列表,
    skuPrefix: '',
    goodsType: 0,
    isPackage:false,
  };

  goodsJson = [];
  goodsJsonGid = [];
  giftList = [];
  Package = false;

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  /**
   * 取消预览
   */
  handleCancelPreview = () => this.setState({ previewVisible: false });

  /**
   * 上传图片的预览
   * @param file
   */
  handlePreview = file => {
    this.setState({
      previewImage: rootUrl + thumbnailPath + file.response.filename,
      previewVisible: true
    });
  };

  /**
   * 提交新建商品
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        console.log('添加商品参数 -->: ', values);
        // return;

        let images = [], skuSizeList = [];
        values.imgs.fileList.map(item => {
          images.push(item.url)
        });
        values.imgs = images;
        values.show = true;
        values.sizeImg = '';
        values.listImg = images[0];
        values.goodsJson = this.goodsJson;
        values.upTime = values.upTime.toISOString();
        values.expireTime  = values.downTime.toISOString();
        values.downTime = values.downTime.toISOString();
        if(this.Package){
          delete values.skuSizeList;
        }else{
          if(values.type === 1) {
            skuSizeList.push(values.goodsValue.toString());
            values.skuSizeList = skuSizeList;
            delete values.skuSizeList;
          } else {
            skuSizeList = [values.color, values.size];
            values.skuSizeList = doExchange(skuSizeList);
          }
        }

        values.skuPrefix = values.skuPrefix.split("|")[0];
        values.skuPure = values.name;
        if(values.address[0] === '全国'){
          values.province = 'all';
          values.city = 'all';
        }else if(values.address[0] !== '全国' && values.address[1] === '市辖区'){
          values.province = values.address[0];
          values.city = 'all';
        }else {
          values.province = values.address[0];
          values.city = values.address[1];
        }
        delete values.color;
        delete values.size;
        delete values.address;
        delete values.goodsType;
        this.addGoods(values);
      }
    });
  };

  /**
   * 商品图片上传
   * @param info
   */
  handleChange = info => {
    let fileList = info.fileList;
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = rootUrl + thumbnailPath + file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log("商品图片上传: ",fileList);
    this.setState({ fileList });
  };

  /**
   * 正文图片上传
   * @param param
   */
  uploadFn = param => {
    // console.log("param==>", param);
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const mediaLibrary = this.editorInstance.getMediaLibraryInstance();

    const successFn = response => {
      // console.log("图片上传成功:", JSON.parse(xhr.responseText));
      const fileName = JSON.parse(xhr.responseText).filename;
      const imgUrl = rootUrl+'/api/young/post/download/image/origin/' + fileName;
      param.success({ url: imgUrl });
    };

    const progressFn = event => {
      param.progress(event.loaded / event.total * 100);
    };

    const errorFn = response => {
      param.error({
        msg: 'unable to upload.'
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', rootUrl+'/api/young/post/upload/image', true);
    xhr.send(fd);
  };

  /**
   * 添加商品规格
   * */
  showSku = (v) => {
    console.log("添加商品规格: ", v.target.value);
    this.setState({showSku:v.target.value})
  };

  /**
   * 添加商品
   * @param values
   */
  addGoods = (values) => {
    let isMuti;
    if(!this.Package){
      delete values.isPackage;
      isMuti = 'addGoods';
    }else{
      if(this.goodsJson.length===0){
        successNotification('请至少选择一个商品', function() {
        });
        return;
      }
      isMuti = 'addSingleGoods';
    }

    console.log(`mall/${isMuti}`);
    const props = this.props;
    const _this = this;
    props.dispatch({
      type: `mall/${isMuti}`,
      payload: values
    }).then(() => {
      successNotification('添加商品成功', function() {
        props.dispatch(routerRedux.push('/mall/goods-list'));
        _this.goodsJson = [];
      });
    }).catch(err=>err)
  };

  /**
   * 获取商品类型列表
   * */
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

  /**
   * 商品列表翻页
   * @param p
   */
  onGoodsListPagination = (p) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsList',
      payload: {
        query: {
          page: p - 1,
          limit: 10,
          sort: ["-createdAt"]
        }
      }
    }).catch(err => err)
  };

  /**
   * 显示弹窗
   * @param type
   */
  showModal = (type) => {
    console.log("showModal", type)
    this.setState({
      [type]: true
    })
  };

  /**
   * 确认添加赠品
   * @param type
   */
  handleOk = (type) => {
    if(type === "goodsListVisible") {
      const selectValues = this.props.form.getFieldValue("goodsJson");
      selectValues.forEach((item)=>{
        const gid = item.split('|')[0];
        if(this.goodsJsonGid.indexOf(gid)===-1){
          this.goodsJsonGid.push(gid);
          this.goodsJson.push({
            gid,
            count:0
          });
          this.giftList.push(item);

        }
      });
      this.setState({
        giftList: this.giftList
      });
    }
    this.setState({
      [type]: false
    })
  };

  /**
   * 关闭弹窗
   * @param type
   */
  handleCancel = (type) => {
    this.setState({
      [type]: false
    })
  };

  /**
   * 选择商品类型
   * @param v
   */
  selectSkuPrefix = (v) => {
    console.log("selectSkuPrefix==>", v.target.value.split('|')[1]);
    this.setState({skuPrefix: v.target.value.split('|')[1]});
    this.props.form.setFieldsValue({goodsType: v.target.value})
  };

  /**
   * 添加赠品
   * @param v
   * @param gid
   */
  addGiftCount = (v, gid) => {
    const idx = this.goodsJsonGid.indexOf(gid);
    this.goodsJson[idx].count = v;
  };

  /*
  * 删除数组某一项
  * */
  handleDelete= (arr, item) => {
    Array.prototype.indexOf = function(val) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function(val) {
      const index = this.indexOf(val);
      // console.log("remove index ", index);
      // console.log("remove val ", val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    arr.remove(item);
    return arr;
  };

  /**
   * 删除赠品
   * */
  deleteGift = (item) => {
    const idx = this.goodsJsonGid.indexOf(item.split('|')[0]);
    this.goodsJson.splice(idx,1);
    this.goodsJsonGid.splice(idx,1);
    this.giftList.splice(idx,1);


    this.setState({
      giftList: [...this.giftList]
    });
  };

  /**
   * 选择商品分类
   * 0:普通商品 1:虚拟商品
   * */
  onSelectType = (v) => {
    // console.log("选择商品分类==>", v);
    this.setState({goodsType: v});
  };

  /*
  * 选择是否为套餐
  * true:是，false:否
  * */
  isPackage = (e)=>{
    const isPackage = e.target.value;
    this.setState({isPackage});
    this.Package = isPackage;
  };

  render() {
    const { mall, loading } = this.props;
    // console.log("mall ===> ", mall);
    const { fileList, previewVisible, previewImage, goodsType, giftList, skuPrefix,isPackage } = this.state;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue } = this.props.form;
    const editorProps = {
      height: 200,
      tabIndents: 2,
      contentFormat: 'html',
      initialContent: '请输入产品描述......',
      pasteMode: 'text'
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const propsObj = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      onChange: this.handleChange,
      multiple: true
    };

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
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: '商品管理',
        href: '/mall/goods-list'
      },
      {
        title: '添加商品',
        href: '/mall/goods-add'
      }
    ];

    const badgeNameError = isFieldTouched('name') && getFieldError('name');

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Modal
            title="选择商品类型"
            visible={this.state.goodsTypesVisible}
            onOk={() => this.handleOk("goodsTypesVisible")}
            onCancel={() => this.handleCancel("goodsTypesVisible")}>
            <Row>
              {getFieldDecorator('skuPrefix', {
                initialValue: null
              })(
                <RadioGroup onChange={(v) => this.selectSkuPrefix(v)}>
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

          <Modal
            title="选择赠品"
            visible={this.state.goodsListVisible}
            onOk={() => this.handleOk("goodsListVisible")}
            onCancel={() => this.handleCancel("goodsListVisible")}>
            <Row>
              {getFieldDecorator('goodsJson', {
                initialValue: null
              })(
                <CheckboxGroup>
                  {mall.goodsList.map((item, i) => {
                    return (
                      <Col span={12} key={i}>
                        <Checkbox value={item.gid+"|"+item.name}>{item.name}</Checkbox>
                      </Col>
                    )
                  })}
                </CheckboxGroup>
              )}
            </Row>
            <Pagination style={{marginTop: 20}} defaultCurrent={1} total={mall.goodsListMeta.count} onChange={(p)=>this.onGoodsListPagination(p)}/>
          </Modal>

          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem
              {...formItemLayout}
              label="商品分类"
            >
              {getFieldDecorator('type', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: '请选择商品分类'
                  }
                ]
              })(
                <Select onChange={(v) => this.onSelectType(v)}>
                  <Option value={0}>普通商品</Option>
                  <Option value={1}>虚拟商品</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品类型"
            >
              {getFieldDecorator('goodsType',{
              rules: [
                {
                  required: true,
                  message: '请选择商品类型'
                }
              ]
            })(
                <Button onClick={() => this.showModal("goodsTypesVisible")}>选择</Button>
            )}
            <span>&nbsp;&nbsp;{skuPrefix}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="是否为套餐">
              {getFieldDecorator('isPackage',{
                initialValue: false,
              })(
                <RadioGroup onChange={e=>this.isPackage(e)}>
                  <Radio value={false}>否</Radio>
                  <Radio value={true}>是</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={badgeNameError ? 'error' : ''}
              help={badgeNameError || ''}
              label="商品名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称'
                  },
                  {
                    max: 8,
                    message: '名称不能够过长'
                  }
                ]
              })(<Input placeholder="商品名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator('imgs', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品图片'
                  }
                 ]
              })(
                <Upload {...propsObj} fileList={fileList} listType="picture-card" onPreview={this.handlePreview}>
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="商品规格">*/}
              {/*{getFieldDecorator('skuSizeList',{*/}
                {/*initialValue: false,*/}
              {/*})(*/}
                {/*<span></span>*/}
              {/*)}*/}
            {/*</FormItem>*/}
            {goodsType === 0 && isPackage===false &&
              <FormItem {...formItemLayout} label="颜色">
                {getFieldDecorator('color', {
                  rules: [
                    {
                      required: true,
                      message: '请选择颜色'
                    }
                  ]
                })(
                  <CheckboxGroup options={colors}/>
                )}
              </FormItem>
            }
            {goodsType === 0 && isPackage===false &&
              <FormItem {...formItemLayout} label="尺寸">
                {getFieldDecorator('size', {
                  rules: [
                    {
                      required: true,
                      message: '请选择尺寸'
                    }
                  ]
                })(<CheckboxGroup options={sizeOptions}/>)}
              </FormItem>
            }

            {goodsType === 1 && isPackage===false &&
            <FormItem {...formItemLayout} label="虚拟商品价值">
              {getFieldDecorator('goodsValue', {
                rules: [
                  {
                    required: true,
                    message: '请输入虚拟商品价值'
                  }
                ]
              })(
                <InputNumber min={0} max={100000}  style={{width: '100%'}}/>
              )}
            </FormItem>
            }
            {goodsType === 1 && isPackage===false &&
            <FormItem {...formItemLayout} label="过期时间(天)">
              {getFieldDecorator('cardExpireTime', {
                rules: [
                  {
                    required: true,
                    message: '过期时间'
                  }
                ]
              })(<InputNumber min={0} max={10000000} style={{width: '100%'}}/>)}
            </FormItem>
            }

            <FormItem {...formItemLayout} label="出售区域">
              {getFieldDecorator('address',{
                rules: [
                  {
                    required: true,
                    message: '请选择出售区域'
                  }
                ]
              })(
                <Cascader options={options} changeOnSelect={true} placeholder="请选择销售区域" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="库存">
              {getFieldDecorator('stock',{
                rules: [
                  {
                    required: true,
                    message: '请输入库存'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="原价">
              {getFieldDecorator('originalPrice',{
                rules: [
                  {
                    required: true,
                    message: '请输入原价'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="折后价">
              {getFieldDecorator('price',{
                rules: [
                  {
                    required: true,
                    message: '请输入折后价'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem label="产品描述">
              <div className={styles.editorWrap}>
                {getFieldDecorator('description',{
                  rules: [
                    {
                      required: true,
                      message: '请输入产品描述'
                    }
                  ]
                })(
                  <BraftEditor
                    {...editorProps}
                    height={800}
                    // style={{height: '800px'}}
                    ref={instance => (this.editorInstance = instance)}
                    media={{
                      image: true,
                      uploadFn: param => this.uploadFn(param)
                    }}
                  />
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="邮费">
              {getFieldDecorator('postPrice',{
                rules: [
                  {
                    required: true,
                    message: '请输入邮费'
                  }
                ]
              })(
                <InputNumber min={0} max={10000000} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品">
              <Button onClick={() => this.showModal("goodsListVisible")}>选择</Button>
              {giftList.length > 0 && giftList.map((item, i) =>{
                return (
                  <Row key={i}>
                    <Col span={12}>
                      <span>{item.split("|")[1]}</span>
                    </Col>
                    <Col span={12}>
                      <Row>
                        <Col span={8}>
                          <span>数量: </span>
                        </Col>
                        <Col span={14}>
                          <InputNumber min={0}
                                       defaultValue={item.split('|')[2]?item.split('|')[2]:0} max={10000000}
                                       style={{ width: '100%' }}
                                       onChange={(v) => this.addGiftCount(v, item.split("|")[0])}/>
                        </Col>
                        <Col span={2}>
                          <Button type="primary" icon="close-circle-o" onClick={() => this.deleteGift(item)}>删除</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
              })}

            </FormItem>
            <FormItem {...formItemLayout} label="上架时间">
              {getFieldDecorator('upTime',{
                rules: [
                  {
                    required: true,
                    message: '请选择上架时间'
                  }
                ]
              })(
                <DatePicker style={{ width: '100%' }} />
              )}
              <span>不需要显示的商品填写 2999-12-30</span>
            </FormItem>
            <FormItem {...formItemLayout} label="下架时间">
              {getFieldDecorator('downTime',{
                rules: [
                  {
                    required: true,
                    message: '请选择下架时间'
                  }
                ]
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否显示">
              {getFieldDecorator('show',{
                initialValue: true,
              })(
                <RadioGroup>
                  <Radio value={false}>显示</Radio>
                  <Radio value={true}>不显示</Radio> {/*  ['XXL-red','XXL-blue']  */}
                </RadioGroup>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="商品列表简短介绍">
              {getFieldDecorator('listDes')(
                <TextArea />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.hasErrors(getFieldsError())}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default GoodsAdd;
