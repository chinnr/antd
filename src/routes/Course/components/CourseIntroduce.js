import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import {rootUrl} from '../../../utils/constant';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
export default class CourseIntroduce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialContent: ``,
      htmlContent: ''
    };
    this.count = 0;
  }

  /**
   * 图片上传
   * @param param
   */
  uploadFn = param => {
    console.log('param==>', param);
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    // const mediaLibrary = window.editor.getMediaLibraryInstance();

    const successFn = response => {
      console.log('图片上传成功:', JSON.parse(xhr.responseText));
      const fileName = JSON.parse(xhr.responseText).filename;
      const imgUrl =
        rootUrl+'/api/young/post/download/image/origin/' +
        fileName;
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
    xhr.open(
      'POST',
      rootUrl+'/api/young/post/upload/image',
      true
    );
    xhr.send(fd);
  };
  handleChange = content => {
    // console.log("handleChange==>",content)
  };

  handleHTMLChange = html => {
    // console.log("handleHTMLChange==>",html)
    this.props.form.setFieldsValue({
      description: html
    });
  };

  // 首行缩进
  textIndent = () => {
    // text-indent: 2em
    const html = this.editorInstance.getContent('html');
    this.editorInstance.insertText("        ",false);
    // console.log("html==>", html);
  };

  componentWillReceiveProps = (nextProps) => {
    // const {description} = this.props;
    if(nextProps.description && this.count < 2){
      console.log("富文本编辑器: ", this.count, nextProps);
      this.editorInstance.setContent(nextProps.description, 'html');
    }
    this.count ++ ;
  };

  render() {
    const {description} = this.props;
    return (
      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <h3>课程详细信息: </h3>
        <div style={{ borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid' }}>
          <BraftEditor
            // controls={[]}
            height={700}
            placeholder={'输入课程详细信息!'}
            ref={instance => (this.editorInstance = instance)}
            language="zh"
            contentFormat="html"
            tabIndents={2}
            pasteMode={'text'}
            initialContent={'课程内容......'}
            onChange={content => this.handleChange(content)}
            onHTMLChange={html => this.handleHTMLChange(html)}
            media={{
              image: true,
              uploadFn: param => this.uploadFn(param)
            }}
            // extendControls={[
            //   {
            //     type: 'split'
            //   },
            //   {
            //     type: 'button',
            //     text: '首行缩进',
            //     className: 'preview-button',
            //     onClick: () => this.textIndent()
            //   }
            // ]}
          />
        </div>
      </div>
    );
  }
}
