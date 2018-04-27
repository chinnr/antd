
import React, { PureComponent } from "react";
import {connect} from "dva";
import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  Icon,
  Upload,
} from "antd";
import moment from "moment";
import CourseIntroduce from "./CourseIntroduce";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import {successNotification} from "../../../utils/utils";
import {rootUrl, thumbnailPath} from "../../../utils/constant";
import {routerRedux} from "dva/router";

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(({ course, badge }) => ({ course, badge }))
@Form.create()
export default class CourseForm extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      level: 1,
      stage: 1,
      cover: '',
      courseCover: [],
      gallery: [],
      previewVisible: false,
      previewImage: '',
  };
    this.gallery = [];
    this.description = '';
  }
  isArray = (obj) => {
    return Object.prototype.toString.call(obj)=='[object Array]';
  };
  handleCreate = (e) => {
    e.preventDefault();
    const form = this.props.form;
    const props = this.props;
    const _this = this;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // console.log("gallery is array ? ",_this.isArray(values.gallery));


        if(!_this.isArray(values.gallery)) {
          console.log("gallery is not array!");
          let _gallery = [];
          values.gallery.fileList.map(item => {
            _gallery.push(item.name)
          });
          values.gallery = _gallery;
        }
        if(!typeof values.cover === 'string') {
          values.cover = values.cover.file.response.filename;
        }else {
          console.log("cover is string ? ",typeof values.cover);
        }


        values.id = localStorage.getItem("courseId");
        this.props.dispatch({
          type: "course/updateCourseTemplate",
          payload: values
        }).then(() => {
          successNotification("编辑课程模板成功", function() {
            props.dispatch(routerRedux.push('/course/template-list'));
            // if (type === 'updateBadge') {
            //   localStorage.removeItem('badgeParams');
            //   localStorage.setItem('isEditBadge', 'false');
            // }
          });
          form.resetFields();
        }).catch( err => err )
      }
    });
  };

  onSelect(v, type) {
    this.props.form.setFieldsValue({
      badge:[]
    });
    console.log("onSelect: ", v, type);
    let _this = this;
    this.setState({
      [type] : v
    }, () => {
      this.getAllBadges(0,_this.state.stage, _this.state.level)
    });
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 获取证章列表
  getAllBadges = (p = 0, stage, level) => {
    console.log("获取证章列表 >>> ", this.state.stage, this.state.level);
    this.props
      .dispatch({
        type: "badge/getAllBadges",
        payload: {
          query: { limit: 20, page: p },
          queryOption: {stage: 'stage'+stage, level:'level'+level}
        }
      })
      .catch(err => err);
  };

  getMoreBadges = () => {
    const {badgesMeta: {count, page}} = this.props.badge;
    let maxPage = count/10 + 1;
    if(page <= maxPage) {
      console.log("getMoreBadges >>>", page);
      this.getAllBadges(page+1)
    }
  };

  /**
   * 课程风采图片上传
   * @param info
   */
  handleChange = info => {
    let gallery = info.fileList;
    gallery = gallery.map(file => {
      if (file.response) {
        file.url = rootUrl + thumbnailPath + file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log("图片上传: ",gallery);
    this.setState({ gallery });
  };

  /**
   * 上传封面
   * @param info
   */
  handleUploadIcon = info => {
    let courseCover = info.fileList;
    courseCover = courseCover.map(file => {
      if (file.response) {
        file.url = rootUrl + thumbnailPath + file.response.filename;
        file.uid = file.response.filename;
        file.name = file.response.filename;
        file.status = file.response.status;
      }
      return file;
    });
    console.log("图片上传: ",courseCover);
    this.setState({ courseCover });
  };

  // 获取要修改的团信息字段
  getCourseParams = () => {
    let values = {};
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      values = JSON.parse(localStorage.getItem('courseTempInfo')).record;
    } else {
      // 有 query
      localStorage.setItem(
        'courseTempInfo',
        JSON.stringify(this.props.location.query)
      );
      values = this.props.location.query.record;
    }
    console.log("获取要修改的团信息字段 ==>", values);

    this.getAllBadges(0, values.stage, values.level);
    let _badges = [];
    values.badgeList.map(item => {
      _badges.push(item.bid);
    });

    const _courseCover = [{
      uid: values.cover,
      name: values.cover,
      status: 'done',
      url: rootUrl + thumbnailPath + values.cover,
      thumbUrl: rootUrl + thumbnailPath + values.cover,
    }];

    let _gallery = [];
    const galleryItem = {};
    values.gallery.map(item => {
      galleryItem['uid'] = item;
      galleryItem['name'] = item;
      galleryItem['status'] = 'done';
      galleryItem['url'] = rootUrl + thumbnailPath + item;
      galleryItem['thumbUrl'] = rootUrl + thumbnailPath + item;
    });
    _gallery.push(galleryItem);
    console.log("_gallery==>", _gallery);
    this.setState({
      courseCover: _courseCover,
      gallery:_gallery
    });

    this.props.form.setFieldsValue({
      title: values.title,
      type: values.type,
      score: values.score,
      content: values.content,
      skills: values.skills,
      level: values.level,
      stage: values.stage,
      note: values.note,
      description: values.description,
      badge: _badges,
      cover: values.cover,
      gallery: values.gallery,
    });
    this.description = values.description;
  };

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
   * 取消预览
   */
  handleCancelPreview = () => this.setState({ previewVisible: false });

  componentDidMount() {
    this.props.form.validateFields();
    this.getCourseParams();
  }

  render() {
    const { badges } = this.props.badge;
    const { courseCover, gallery,previewVisible, previewImage } = this.state;
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">点击上传</div>
      </div>
    );
    const propsObj = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      onChange: this.handleChange,
      multiple: true
    };
    const propsObjCover = {
      name: 'file',
      action: rootUrl+'/api/young/post/upload/image',
      onChange: this.handleUploadIcon,
      multiple: false
    };

    return (
      <Form onSubmit={this.handleCreate}>
        <FormItem {...formItemLayout} label="课程主题">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "请输入课程主题!" }]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="课程封面">
          {getFieldDecorator('cover')(
            <Upload {...propsObjCover} fileList={courseCover} listType="picture-card" onPreview={this.handlePreview}>
              {courseCover.length >= 1 ? null : uploadButton}
            </Upload>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程类型">
          {getFieldDecorator("type", {
            initialValue: 0,
            rules: [{ required: true, message: "请选择课程类型!" }]
          })(
            <RadioGroup>
              <Radio value={0}>团集会</Radio>
              <Radio value={1}>活动</Radio>
              <Radio value={2}>兴趣课</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="服务范围">
          {getFieldDecorator("score", {
            initialValue: "",
            rules: [{ required: true, message: "请输入服务范围!" }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程内容">
          {getFieldDecorator("content", {
            rules: [{ required: true, message: "请输入课程内容!" }]
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="培养能力">
          {getFieldDecorator("skills", {
            rules: [{ required: true, message: "请输入课程内容!" }]
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="课程级别">
          {getFieldDecorator("level", {
            initialValue: 1,
            rules: [{ required: true, message: "请选择课程级别!" }]
          })(
            <Select
              placeholder="请选择课程级别"
              onChange={v => this.onSelect(v, "level")}
            >
              <Option value={1}>海狸</Option>
              <Option value={2}>小狼</Option>
              <Option value={3}>探索</Option>
              <Option value={4}>乐扶</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程阶段">
          {getFieldDecorator("stage", {
            initialValue: 1,
            rules: [{ required: true, message: "请选择课程阶段!" }]
          })(
            <Select placeholder="请选择课程阶段" onChange={v => this.onSelect(v, "stage")}>
              <Option value={1}>一阶</Option>
              <Option value={2}>二阶</Option>
              <Option value={3}>三阶</Option>
              <Option value={4}>四阶</Option>
              <Option value={5}>五阶</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="课程证章">
          {getFieldDecorator("badge", {
            initialValue: [],
            rules: [{ required: false, message: "请选择课程对应的证章!" }]
          })(
            <Select
              placeholder="请选择课程对应的证章" mode="multiple"
              onPopupScroll={() => this.getMoreBadges()}
              /*onFocus={() => this.getAllBadges()}*/>
              {badges.map((item, i) => {
                return (
                  <Option
                    key={i}
                    value={item.bid}
                  >
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        {/*<FormItem {...formItemLayout} label="开课方式">
          {getFieldDecorator("method", {
            initialValue: 0,
            rules: [{ required: true, message: "请选择开课方式!" }]
          })(
            <RadioGroup>
              <Radio value={0}>普通课</Radio>
              <Radio value={1}>常驻课</Radio>
              <Radio value={2}>夏令营</Radio>
            </RadioGroup>
          )}
        </FormItem>*/}
        {/*<FormItem {...formItemLayout} label="课时">
          {getFieldDecorator("lesson", {
            initialValue: 1,
            rules: [{ required: true, message: "请选择课时!" }]
          })(
            <Select placeholder="请选择课时">
              {lessons.map((item, i) => {
                return (
                  <Option value={item.lesson} key={i}>{item.value}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>*/}
        {/*<FormItem {...formItemLayout} label="课程人数">
          {getFieldDecorator("capacity", {
            initialValue: 0,
            rules: [{ required: true, message: "请输入课程人数!" }]
          })(
            <InputNumber min={0} max={300} style={{width: '100%'}}/>
          )}
        </FormItem>*/}
        <FormItem {...formItemLayout} label="报名须知">
          {getFieldDecorator("note", {
            rules: [{ required: true, message: "请输入报名须知!" }]
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="课程风采">
          {getFieldDecorator('gallery')(
            <Upload {...propsObj} fileList={gallery} listType="picture-card" onPreview={this.handlePreview}>
              {gallery.length >= 10 ? null : uploadButton}
            </Upload>
          )}
        </FormItem>
        <FormItem style={{ marginTop: 32 }}>
          {getFieldDecorator("description", {
          })(
            <CourseIntroduce form={this.props.form} description={this.description}/>
          )}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button
            type="primary"
            htmlType="submit"
            // disabled={this.hasErrors(getFieldsError())}
          >
            提交
          </Button>
        </FormItem>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form>
    );
  }
}
