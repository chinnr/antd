import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Icon,
  Popconfirm,
  notification,
  Tooltip
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment/moment';
import { rootUrl, thumbnailPath, uploadPath } from '../../utils/constant';
import styles from './NewBadge.less';
import { routerRedux } from 'dva/router';
import { successNotification } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ team }) => ({ team }))
@Form.create()
export default class NewBadge extends PureComponent {
  constructor() {
    super();
    this.state = {
      normalImg: '',
      grayImg: ''
    };
  }

  // 上传证章图片
  uploadImage = (id, type) => {
    console.log('图片type ==>: ', id, type);
    const _token = 'Bearer ' + localStorage.getItem('token');
    const img = document.getElementById(id).files[0];
    let formData = new FormData();
    formData.append('file', img);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadPath);
    xhr.send(formData);
    xhr.addEventListener('load', () => {
      let _src = JSON.parse(xhr.responseText).filename;
      this.setState({ [type]: _src }, () =>
        console.log(type, this.state[type])
      );
      this.props.form.setFieldsValue({
        [type]: _src
      });
    });
    xhr.addEventListener('error', () => {
      console.log('上传失败：', JSON.parse(xhr.responseText));
    });
  };

  /**
   * 删除上传的图片
   * @returns {*}
   */
  deleteUpload = type => {
    this.setState({ [type]: '' });
    this.props.form.setFieldsValue({
      [type]: ''
    });
  };

  // 创建证章
  submitBadge = (values, type) => {
    this.props
      .dispatch({
        type: 'badge/' + type,
        payload: {
          form: values
        }
      })
      .then(() => {
        let message = '新建成功';
        type === 'updateBadge'
          ? (message = '修改成功')
          : (message = '新建成功!');
        successNotification(message, function() {
          props.dispatch(routerRedux.push('/badge/list'));
          if (type === 'updateBadge') {
            localStorage.removeItem('badgeParams');
            localStorage.setItem('isEditBadge', 'false');
          }
        });
      })
      .catch(err => {});
  };

  // 获取要修改的证章字段
  getBadgeParams = () => {
    let values = {};
    if (this.props.location.query === undefined) {
      // "没有 query, 获取存储的query"
      values = JSON.parse(localStorage.getItem('badgeParams')).record;
    } else {
      // 有 query
      localStorage.setItem(
        'badgeParams',
        JSON.stringify(this.props.location.query)
      );
      values = this.props.location.query.record;
    }
    let keys = Object.keys(values);
    keys.map(item => {
      this.props.form.setFieldsValue({
        [item]: values[item]
      });
    });
    this.setState({
      normalImg: values.normalImg,
      grayImg: values.grayImg
    });
  };

  // 提交新建证章
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (localStorage.getItem('badgeParams')) {
          let _bid = JSON.parse(localStorage.getItem('badgeParams')).record.bid;
          values['bid'] = _bid;
        } else {
          let _uid = localStorage.getItem('uid');
          values['uid'] = _uid;
        }
        console.log('values==>', values);
        localStorage.getItem('badgeParams')
          ? this.submitBadge(values, 'updateBadge')
          : this.submitBadge(values, 'createBadge');
      }
    });
  };

  // 文字提示
  renderToolTipTitle = () => {
    return (
      <div>
        <h3 style={{ color: '#fff' }}>输入格式参考:</h3>
        <p>1. 加强组织性 纪律性和整体观念;</p>
        <p>2. 提高团队合作意识;</p>
      </div>
    );
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  componentDidMount() {
    console.log('isEditBadge ==>', localStorage.getItem('isEditBadge'));
    if (localStorage.getItem('isEditBadge') === 'true') {
      console.log('读取参数');
      this.getBadgeParams();
    }
  }

  render() {
    let _title = '新建证章';
    localStorage.getItem('isEditBadge') === 'true'
      ? (_title = '编辑证章')
      : (_title = '新建证章');
    const breadcrumbList = [
      {
        title: '首页',
        href: '/'
      },
      {
        title: _title,
        href: '/badge/new'
      }
    ];
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const { normalImg, grayImg } = this.state;
    const badgeNameError = isFieldTouched('name') && getFieldError('name');
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
    return (
      <PageHeaderLayout
        title={null}
        content={null}
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              validateStatus={badgeNameError ? 'error' : ''}
              help={badgeNameError || ''}
              label="证章名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入证章名称'
                  }
                ]
              })(<Input placeholder="证章名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="证章级别">
              {getFieldDecorator('level', {
                initialValue: 'level1',
                rules: [
                  {
                    required: true,
                    message: '请输入证章级别'
                  }
                ]
              })(
                <Select placeholder="请选择证章级别">
                  <Option value="level1">海狸</Option>
                  <Option value="level2">小狼</Option>
                  <Option value="level3">探索</Option>
                  <Option value="level4">乐扶</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="证章阶段">
              {getFieldDecorator('stage', {
                initialValue: 'stage1',
                rules: [
                  {
                    required: true,
                    message: '请输入证章阶段'
                  }
                ]
              })(
                <Select placeholder="请选择证章阶段">
                  <Option value="stage1">阶段1</Option>
                  <Option value="stage2">阶段2</Option>
                  <Option value="stage3">阶段3</Option>
                  <Option value="stage4">阶段4</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="证章分类">
              {getFieldDecorator('class', {
                initialValue: 'class1',
                rules: [
                  {
                    required: true,
                    message: '请输入证章分类'
                  }
                ]
              })(
                <Select placeholder="请选择证章分类">
                  <Option value="class1">基础章</Option>
                  <Option value="class2">兴趣章</Option>
                  <Option value="class3">技能章</Option>
                  <Option value="class4">活动章</Option>
                  <Option value="class5">服务章</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="证章简介">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请输入证章简介'
                  }
                ]
              })(<TextArea rows={4} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="证章意义">
              <Tooltip
                trigger={['focus']}
                title={() => this.renderToolTipTitle()}
                placement="topLeft"
                overlayClassName="numeric-input"
              >
                {getFieldDecorator('significance')(<TextArea rows={4} />)}
              </Tooltip>
            </FormItem>
            <FormItem {...formItemLayout} label="正常证章图片">
              {getFieldDecorator('normalImg', {
                rules: [
                  {
                    required: true,
                    message: '正常证章图片不能够为空'
                  }
                ]
              })(
                <div>
                  {normalImg.length === 0 && (
                    <label
                      className={styles.upload_img_label}
                      htmlFor="upload-img-normal"
                    >
                      <Icon type="plus" className={styles.upload_icon} />
                    </label>
                  )}
                  {normalImg.length > 0 && (
                    <div className={styles.upload_list_item}>
                      <img
                        className={styles.upload_list_img}
                        src={rootUrl + thumbnailPath + normalImg}
                      />
                      <div className={styles.delete_upload_mask}>
                        <Popconfirm
                          placement="top"
                          title={'你确定删除该图片?'}
                          onConfirm={() => this.deleteUpload('normalImg')}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Icon
                            type="delete"
                            className={styles.delete_upload}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  )}
                  <input
                    className={styles.upload_img}
                    id="upload-img-normal"
                    type="file"
                    name="img"
                    onChange={() =>
                      this.uploadImage('upload-img-normal', 'normalImg')
                    }
                  />
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="灰色证章图片">
              {getFieldDecorator('grayImg', {
                rules: [
                  {
                    required: true,
                    message: '灰色证章图片不能够为空'
                  }
                ]
              })(
                <div>
                  {grayImg.length === 0 && (
                    <label
                      className={styles.upload_img_label}
                      htmlFor="upload-img-gray"
                    >
                      <Icon type="plus" className={styles.upload_icon} />
                    </label>
                  )}
                  {grayImg.length > 0 && (
                    <div className={styles.upload_list_item}>
                      <img
                        className={styles.upload_list_img}
                        src={rootUrl + thumbnailPath + grayImg}
                      />
                      <div className={styles.delete_upload_mask}>
                        <Popconfirm
                          placement="top"
                          title={'你确定删除该图片?'}
                          onConfirm={() => this.deleteUpload('grayImg')}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Icon
                            type="delete"
                            className={styles.delete_upload}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  )}
                  <input
                    className={styles.upload_img}
                    id="upload-img-gray"
                    type="file"
                    name="img"
                    onChange={() =>
                      this.uploadImage('upload-img-gray', 'grayImg')
                    }
                  />
                </div>
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
              {/*<Button style={{ marginLeft: 8 }}>保存</Button>*/}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
