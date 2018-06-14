import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Form, Input } from 'antd';
import moment from 'moment';
import CourseIntroduce from './CourseIntroduce';
import ImageUpload2 from './ImageUpload2';
import { successNotification } from '../../../utils/utils';
import { rootUrl } from '../../../utils/constant';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ course, badge }) => ({ course, badge }))
@Form.create()
export default class CourseBriefEdit extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { uploadImage, ondelete, onEditTitle, onEditText, uploadRef, defaultTitle, defaultText, defaultImages } = this.props;
    // console.log("defaultImages >>>> ", defaultImages);
    return (
      <div style={{marginBottom: 10}}>
        <div style={{marginBottom: 10}}>
          <TextArea
            rows={4}
            placeholder={'请输入课程内容'}
            value={defaultTitle}
            onChange={(e) => onEditTitle(e.target.value)} />
        </div>
        <div style={{marginBottom: 10}}>
          <ImageUpload2
            uploadRef={uploadRef}
            mode={"multiple"}
            uploadNum={10}
            defaultImages={defaultImages}
            onUpload={filename => uploadImage(filename)}
            ondelete={filename => ondelete(filename)}
            uploadPath={rootUrl + '/api/young/post/upload/image'}
          />
        </div>
        <TextArea
          rows={4}
          placeholder={'请输入课程内容'}
          value={defaultText}
          onChange={(e) => onEditText(e.target.value)} />
      </div>
    );
  }
}
