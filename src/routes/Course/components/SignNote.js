import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

export default class SignNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialContent: `<h2 style="text-align:center;">最长的电影</h2>
<img src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=eb7abac86e600c33f079d9ce22773632/d788d43f8794a4c2fd079ef70bf41bd5ac6e39c1.jpg">
<p><span style="font-size: 16px;">我们的开始　是很长的电影 放映了三年　我票都还留着 冰上的芭蕾　脑海中还在旋转</span></p>
<p><span style="font-size: 16px;">望着你　慢慢忘记你 朦胧的时间　我们溜了多远  冰刀划的圈　圈起了谁改变 如果再重来　</span></p>
<p><span style="font-size: 16px;">会不会稍嫌狼狈  爱是不是不开口才珍贵  再给我两分钟　让我把记忆结成冰  别融化了眼泪　你妆都花了要我怎么记得 记得你叫我忘了吧　记得你叫我忘了吧 你说你会哭　不是因为在乎</span></p>`
      ,
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
    console.log("handleChange==>",content)
  };

  handleHTMLChange = (html) => {
    console.log("handleHTMLChange==>",html)
  };

  render() {
    return (
      <div>
        <div className="demo" id="demo">
          <BraftEditor
            height={400}
            viewWrapper={'#demo'}
            placeholder={"Hello World!"}
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
        </div>
      </div>
    )

  }
}
