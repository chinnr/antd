import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import {EditorState, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import styles from './editor.less'

export default class CourseIntroduce extends Component {
  state = {
    editorContent: undefined,
    contentState: undefined,
    editorState: '',
    initialContent: `<h2 style="text-align:center;">最长的电影</h2>
<img src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=eb7abac86e600c33f079d9ce22773632/d788d43f8794a4c2fd079ef70bf41bd5ac6e39c1.jpg">
<p><span style="font-size: 16px;">我们的开始　是很长的电影 放映了三年　我票都还留着 冰上的芭蕾　脑海中还在旋转</span></p>
<p><span style="font-size: 16px;">望着你　慢慢忘记你 朦胧的时间　我们溜了多远  冰刀划的圈　圈起了谁改变 如果再重来　</span></p>
<p><span style="font-size: 16px;">会不会稍嫌狼狈  爱是不是不开口才珍贵  再给我两分钟　让我把记忆结成冰  别融化了眼泪　你妆都花了要我怎么记得 记得你叫我忘了吧　记得你叫我忘了吧 你说你会哭　不是因为在乎</span></p>`
  };

  onEditorChange = (editorContent) => {
    console.log("内容1111： ", draftToHtml(editorContent));
    this.setState({
      editorContent,
    });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  imageUploadCallBack = file => new Promise(
    (resolve, reject) => {
      const _token = "Bearer " + localStorage.getItem('jwt');
      const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
      xhr.open('POST', 'https://api.yichui.net/api/duomi/upload?token=' + _token);
      xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
      const data = new FormData(); // eslint-disable-line no-undef
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        let _link = 'https://api.yichui.net/api/duomi/upload/' + JSON.parse(xhr.responseText).filename;
        resolve({data: {link: _link}});
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );

  convertHtmlToDraft() {
    const blocksFromHtml = htmlToDraft(this.state.initialContent);
    const {contentBlocks, entityMap} = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    this.setState({
      editorState,
    });
  }

  componentDidMount() {
    this.convertHtmlToDraft();
  }

  render() {
    const {editorContent, editorState} = this.state;
    return (
      <div>
          <Editor
            editorState={editorState}
            toolbarClassName={styles.toolbar}
            // wrapperClassName={styles.wrapper}
            editorClassName={styles.editor}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
              image: {uploadCallback: this.imageUploadCallBack},
            }}
            onContentStateChange={this.onEditorChange}
            placeholder="正文内容"
            spellCheck
            onFocus={() => {
              console.log('focus')
            }}
            onBlur={() => {
              console.log('onBlur (editorContent) ==> ', draftToHtml(editorContent))
            }}
            onTab={() => {
              console.log('tab');
              return true;
            }}
            localization={{locale: 'zh', translations: {'generic.add': '上传图片'}}}
          />
        <Card title={null} bordered={false}>
          <pre>{draftToHtml(editorContent)}</pre>
        </Card>
      </div>
    );
  }
}
