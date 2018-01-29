import React, { PureComponent } from 'react';
import { Card, Form, Tabs,Icon, Input, Button, Checkbox, InputNumber } from 'antd';
import { connect } from 'dva';
import ReactQuill from 'react-quill';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class CourseIntroduce extends PureComponent {

  modules= {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  formats= [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
  state = {
    text: '文档  https://github.com/zenoamaro/react-quill#custom-toolbar'
  };

  handleEditorChange = () => {

  };


  render() {
    return (
      <div>
        <ReactQuill
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          value={this.state.text}
          onChange={()=>this.handleEditorChange()} />
      </div>
    )
  }
}
export default CourseIntroduce;