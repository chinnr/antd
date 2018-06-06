import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Form, Input } from 'antd';
import moment from 'moment';
import CourseIntroduce from './CourseIntroduce';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import { successNotification } from '../../../utils/utils';
import { rootUrl } from '../../../utils/constant';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ course, badge }) => ({ course, badge }))
@Form.create()
export default class CourseBrief extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { uploadImage, ondelete, onEditTitle, onEditText, onInputFocus, uploadRef } = this.props;
    return (
      <div style={{marginBottom: 10}}>
        <div style={{marginBottom: 10}}>
          <TextArea
            rows={4}
            placeholder={'请输入课程内容'}
            onFocus={() => onInputFocus('title')}
            onChange={(e) => onEditTitle(e.target.value)} />
        </div>
        <div style={{marginBottom: 10}}>
          <ImageUpload
            uploadRef={uploadRef}
            mode={"multiple"}
            uploadNum={10}
            onUpload={filename => uploadImage(filename)}
            ondelete={filename => ondelete(filename)}
            uploadPath={rootUrl + '/api/young/post/upload/image'}
          />
        </div>
        <TextArea
          rows={4}
          placeholder={'请输入课程内容'}
          onFocus={() => onInputFocus('text')}
          onChange={(e) => onEditText(e.target.value)} />
      </div>
    );
  }
}
