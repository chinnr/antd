import React, { PureComponent } from 'react';
import moment from 'moment'
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
import colors from '../../static/colors';
import styles from './index.less';
import {successNotification} from '../../utils/utils';
import options from '../../utils/cascader-address-options';
import { rootUrl, thumbnailPath } from "../../utils/constant";
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const sizeOptions = [
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
  { label: 'XXXL', value: 'XXXL' }
];
const formatDate = 'YYYY/MM/DD hh:mm:ss';

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
@Form.create()

export default class GoodsEdit extends PureComponent {
  constructor() {
    super();
    this.state = {
      imgs:[],
      previewImage:'',
      previewVisible: false,
      type:0,
      goodsTypesVisible: false,
      goodsListVisible: false,
      skuPrefix:'',
      giftList:[],
      goodsType:0,
      description:'',
    }
    this.goodsJson = [];//submit的赠品
    this.giftList = [];//列表渲染的的赠品
    this.goodsJsonGid = [];//去重的赠品gid
    this.skuPrefix = '';
    this.gid='';
  }

  componentDidMount() {
    this.getGoodsParams();
  }

  //获取商品参数
  getGoodsParams = ()=>{
    let gid='';
    const _this = this;
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      gid = JSON.parse(localStorage.getItem("goodsInfo")).record.gid;
      this.gid = gid;
    } else {
      // 有 query
      localStorage.setItem(
        "goodsInfo",
        JSON.stringify(this.props.location.query)
      );
      gid = this.props.location.query.record.gid;
      this.gid = gid;

    }
    this.props.dispatch({
      type:'mall/getGoodsById',
      payload:{
        gid:[gid]
      }
    }).then(res=>{
      console.log("根据ID获取的商品详情=====================>>>>>>>>>>>>>>",res);
      if(typeof res =="undefined"){
        return
      }
      _this.getGoodsById(res[0]);
    })


  }

  //获取商品详情
  getGoodsById = (values)=>{
    const _this = this;

    /*
    * 去重后的gid
    * */
    values.goodsJson.forEach((item)=>{
      _this.goodsJsonGid.push(item.gid);
    });

    let aa = Array.from(new Set(this.goodsJsonGid));
    this.goodsJsonGid = aa;
    console.log("goodsJsonGid=================>>>>>>>>>>>>>>>",this.goodsJsonGid);


    /*
    * 通过去重的gid把赠品中的重复赠品合并及把数量相加
    * */
    let newGoodsList = [];
    this.goodsJsonGid.forEach((gid)=>{
      let newJson = {gid,count:0,name:''};
        values.goodsJson.forEach(item=>{
          if(item.gid==newJson.gid){
            newJson.count+=item.count;
            newJson.name = item.name;
          }
        })
      newGoodsList.push(newJson);
    });
    console.log("newGoodsList=======================>>>>>>>>>>>>>>>>>>>",newGoodsList);

    /*
    *赠品数据加工
    * */
    newGoodsList.forEach((item)=>{
      /*
      * giftList做组件的列表渲染，需要name*/
      let temp = item.gid +'|'+item.name+'|'+item.count;
      _this.giftList.push(temp);

      /*
      * this.goodsJson做提交的字段，不需要name*/
      let tempItem = {count:0,gid:''};
      tempItem.count = item.count;
      tempItem.gid = item.gid;
      this.goodsJson.push(tempItem);
    });


    let sizeAcolor,
      color,
      size,
      expireTime;
    if(values.type == 0){
      sizeAcolor = values.skuSize.split('-');

      color = sizeAcolor[1];

      size = sizeAcolor[0];

      console.log("color================>>>>>>>>>>>>>>",color);
    }else{
      expireTime = moment(new Date(values.expireTime),'YYYY/MM/DD hh:mm:ss');
    }

    console.log("values.img:     ",values.imgs);
    const prefix ='https://api.yichui.net/api/young/post/download/image/thumbnail/';
    const imgs = values.imgs.map(item=>{
      let url;
      if(item.url.indexOf(prefix) == -1)
        url = prefix+item.url;
      else
        url = item.url;
      return {
        uid: Math.random(-100,0),
        name: item.url,
        url,
        status: "done"
      }
    })

    const upTime = moment(new Date(values.upTime),'YYYY/MM/DD hh:mm:ss');

    const downTime = moment(new Date(values.downTime),'YYYY/MM/DD hh:mm:ss');

    const description = values.description;

    const skuPrefix = values.skuPrefix.split("|")[0];

    this.skuPrefix  =skuPrefix;

    let address;
    if(values.province==="all"){
      address = ["全国"];
    }else{
      if(values.city==="all"){
        address = [values.province,"市辖区"]
      }else{
        address = [values.province,values.city]
      }
    }

    this.props.dispatch({
      type:'mall/getTypeName',
      payload:{
        query:{
          limit:10
        },
        queryOption:{
          skuPrefix:skuPrefix
        }
      }
    }).then(res=>{
      this.setState({skuPrefix:res});
    }).catch(err=>err)


    this.setState({giftList:this.giftList});
    this.setState({imgs});
    this.setState({description},()=>{
      this.props.form.setFieldsValue({
        description
      })
    })
    this.setState({type:values.type},()=>{
      if(this.state.type===1){
        this.props.form.setFieldsValue({
          goodsValue:values.goodsValue,
          expireTime,
        })
      }
    });
    this.editorInstance.setContent(description, "html");

    this.props.form.setFieldsValue({
      name: values.name,
      type: values.type,
      imgs:imgs,
      color:color,
      size:size,
      address:address,
      originalPrice:values.originalPrice,
      price:values.price,
      stock:values.stock,
      show:values.show,
      description,
      upTime,
      downTime,
      postPrice:values.postPrice
    });
  }

  //图片上传或者删除
  handleChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log("fileList:         ",fileList);
    this.setState({ imgs: fileList})
  };

  //图片预览
  handlePreview = file => {
    console.log(file.url);
    this.setState({
      previewImage: file.url,
      previewVisible: true
    });
  };

  //取消预览
  handleCancelPreview = () => this.setState({ previewVisible: false });

  //选择商品分类
  onSelectType = (v) => {
    this.setState({type: v});
  };

  //提交
  handleSubmit = e => {
    const _this = this;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        console.log("submitValue============================>>>>>>>>>>>>>>",values);
        let images = [];
        if(values.imgs.fileList){
          values.imgs.fileList.map(item => {
            images.push(item.url)
          });
        }else{
          values.imgs.map(item => {
            images.push(item.url)
          });
        }

        // console.log("提交的imgs：        ",images);
        console.log("提交的values.expireTime：        ",moment(values.expireTime,'YYYY/MM/DD hh:mm:ss'));
        values.gid = this.gid;
        values.imgs = images;
        values.goodsJson = this.goodsJson;
        values.upTime = new Date(values.upTime).toISOString();
        values.downTime = new Date(values.downTime).toISOString();
        if(values.type === 1) {
          values.skuSize = values.goodsValue;
          values.expireTime  = new Date(values.expireTime).toISOString();
        } else {
          values.skuSize = values.size + '-' + values.color;
        }
        values.skuPrefix = this.skuPrefix;
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

        this.props.dispatch({
          type:'mall/updateGoods',
          payload:{
            form:values
          }
        }).then(res=>{
          successNotification('编辑成功',()=>{
            _this.giftList = [];
            _this.goodsJsonGid = [];
            _this.goodsJson = [];
            _this.getGoodsParams();
            return false;
          })
        }).catch(err=>err);

        console.log("lastSubmitValue==========================================>>>>>>>>>>>>>>>",JSON.stringify(values));
      }
    })
  }

  //商品赠品和分类的弹窗
  showModal = (type) => {
    this.setState({
      [type]: true
    })
  };

  //商品赠品和分类弹窗的确认按钮
  handleOk = (type) => {
    if(type === "goodsListVisible") {
      const selectValues = this.props.form.getFieldValue("goodsJson");
      console.log("选择的赠品================>>>>>>>>>>>>>>>>>",this.props.form.getFieldValue("goodsJson"));
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
        giftList: [...this.giftList]
      });
    }
    this.setState({
      [type]: false
    })
  };

  //商品赠品和分类弹窗的关闭按钮
  handleCancel = (type) => {
    this.setState({
      [type]: false
    })
  };

  //选择商品分类
  selectSkuPrefix = (v) => {
    this.setState({skuPrefix: v.target.value.split('|')[1]});
    this.props.form.setFieldsValue({goodsType: v.target.value})
  };

  //商品列表翻页
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

  //赠品列表翻页
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

  //修改赠品数量
  addGiftCount = (v, gid) => {
    const idx = this.goodsJsonGid.indexOf(gid);
    this.goodsJson[idx].count = v;
    console.log('goodsJson:          ',this.goodsJson);
  };

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

  //删除赠品
  deleteGift = (item) => {
    const idx = this.goodsJsonGid.indexOf(item.split('|')[0]);
    this.goodsJson.splice(idx,1);
    this.goodsJsonGid.splice(idx,1);
    this.giftList.splice(idx,1);


    this.setState({
      giftList: [...this.giftList]
    });


    console.log("this.goodsJsonGid:  ", this.goodsJsonGid);
    console.log("this.goodsJson:  ", this.goodsJson);
    console.log("this.giftList:  ", this.giftList);
  };

  //正文图片上传
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


  render (){
    const { mall} = this.props;

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
        title: '商品编辑',
        href: '/mall/goods-edit'
      }
    ];

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
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

    const editorProps = {
      height: 500,
      tabIndents: 2,
      contentFormat: 'html',
      pasteMode: 'text'
    };

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const {
      imgs,
      previewVisible,
      previewImage,
      type,
      skuPrefix,
      giftList,
      description,
    } = this.state;


    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return(
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem {...formItemLayout} label="商品分类">
              {getFieldDecorator("type", {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: '请选择商品分类'
                  }
                ]
              })(
                <Select placeholder="请选商品类型" onChange={(v) => this.onSelectType(v)}>
                  <Option value={0}>普通商品</Option>
                  <Option value={1}>虚拟商品</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品类型"
            >
              {getFieldDecorator('goodsType')(
                <Button onClick={() => this.showModal("goodsTypesVisible")}>选择</Button>
              )}
              <span>&nbsp;&nbsp;{skuPrefix}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名字'
                  }
                ]
              })(<Input placeholder="商品名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator("imgs", {
                rules: [
                  {
                    required: true,
                    message: '请选择商品图片'
                  }
                ]
              })(
                <Upload
                  multiple={true}
                  action={rootUrl + "/api/young/post/upload/image"}
                  fileList={imgs}
                  listType="picture-card"
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {imgs.length >= 5 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            {type===0&&<FormItem {...formItemLayout} label="商品颜色">
              {getFieldDecorator("color", {
                rules: [
                  {
                    required: true,
                    message: '请选择颜色'
                  }
                ]
              })(<RadioGroup options={colors}/>)}
            </FormItem>}

            {type===0&&<FormItem {...formItemLayout} label="商品尺寸">
              {getFieldDecorator("size", {
                rules: [
                  {
                    required: true,
                    message: '请选择尺寸'
                  }
                ]
              })(<RadioGroup options={sizeOptions}/>)}
            </FormItem>}

            {type === 1 &&
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
            {type === 1 &&
            <FormItem {...formItemLayout} label="过期时间">
              {getFieldDecorator('expireTime', {
                rules: [
                  {
                    required: true,
                    message: '过期时间'
                  }
                ]
              })(<DatePicker style={{ width: '100%' }} format='YYYY/MM/DD hh:mm:ss' />)}
            </FormItem>
            }
            <FormItem {...formItemLayout} label="出售区域">
              {getFieldDecorator('address')(
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
                ],
                initialValue: description
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
                  ],
                })(
                  <BraftEditor
                    {...editorProps}
                    initialContent=''
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
            <FormItem {...formItemLayout} label="赠品">
              <Button onClick={() => this.showModal("goodsListVisible")}>选择</Button>
              {giftList.length > 0 && giftList.map((item, i) =>{
                return (
                  <Row key={i}>
                    <Col span={12}>
                      <span>{item.split('|')[1]}</span>
                    </Col>
                    <Col span={12}>
                      <Row>
                        <Col span={8}>
                          <span>数量: </span>
                        </Col>
                        <Col span={14}>
                          <InputNumber min={0} defaultValue={item.split('|')[2]?item.split('|')[2]:0} max={10000000} style={{ width: '100%' }}
                                       onChange={(v) => this.addGiftCount(v, item.split('|')[0])}/>
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
                <DatePicker style={{ width: '100%' }} format='YYYY/MM/DD hh:mm:ss' />
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
              })(<DatePicker style={{ width: '100%' }} format='YYYY/MM/DD hh:mm:ss'/>)}
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


            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
            </FormItem>

          </Form>
        </Card>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancelPreview}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
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
      </PageHeaderLayout>
    )
  }
}
