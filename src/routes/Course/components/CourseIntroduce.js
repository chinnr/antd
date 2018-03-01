import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

export default class CourseIntroduce extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialContent: ``,
      htmlContent: '',
    }
  }

  /**
   * 图片上传
   * @param param
   */
  uploadFn = (param) => {
    console.log("param==>", param)
    const xhr = new XMLHttpRequest
    const fd = new FormData()
    const mediaLibrary = window.editor.getMediaLibraryInstance()

    const successFn = (response) => {
      console.log("图片上传成功:", JSON.parse(xhr.responseText));
      const fileName = JSON.parse(xhr.responseText).filename;
      const imgUrl = "https://api.yichui.net/api/young/post/download/image/origin/"+fileName;
      param.success({url:imgUrl})
    };

    const progressFn = (event) => {
      param.progress(event.loaded / event.total * 100)
    };

    const errorFn = (response) => {
      param.error({
        msg: 'unable to upload.'
      })
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', 'https://api.yichui.net/api/young/post/upload/image', true);
    xhr.send(fd)

  };
  handleChange = (content) => {
    // console.log("handleChange==>",content)
  };

  handleHTMLChange = (html) => {
    // console.log("handleHTMLChange==>",html)
    this.props.form.setFieldsValue({
      description: html
    });
  };

  render() {
    return (
          <BraftEditor
            height={400}
            placeholder={"输入课程描述!"}
            ref={(instance) => window.editor = instance}
            language="zh"
            contentFormat="html"
            initialContent={this.state.initialContent}
            onChange={(content) => this.handleChange(content)}
            onHTMLChange={(html) => this.handleHTMLChange(html)}
            media={{
              image: true,
              uploadFn: (param) => this.uploadFn(param)
            }}
          />
    )

  }
}
