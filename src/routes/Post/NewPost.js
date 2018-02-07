import React, {Component} from 'react';
import {Input, Card,Button, Radio, Icon} from 'antd';
import {connect} from "dva";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './NewPost.less';


// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import {Form} from "antd/lib/index";
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let postGallery;

@connect(({post}) => ({post}))
@Form.create()
export default class NewPost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialContent: '',
      postGallery: [],
      title: "",  // 文章标题
      content: "", // 文章内容
      cid: "", // 文章类型
    }
  }

  /**
   * 正文图片上传
   * @param param
   */
  uploadFn = (param) => {
    console.log("param==>", param)
    const xhr = new XMLHttpRequest;
    const fd = new FormData();
    const mediaLibrary = this.editorInstance.getMediaLibraryInstance();

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

  // 上传封面图片
  uploadCover(e) {
    // const _token = "Bearer "+localStorage.getItem('jwt');
    const img = document.getElementById('upload-img').files[0];
    let formData = new FormData();
    formData.append('file', img);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.yichui.net/api/young/post/upload/image');
    xhr.send(formData);
    xhr.addEventListener('load', () => {
      // let _src = 'https://api.yichui.net/api/duomi/upload/' + JSON.parse(xhr.responseText).filename;
      let _src = JSON.parse(xhr.responseText).filename;
      let srcArr = [];
      srcArr.push(_src);
      postGallery = _src;
      this.setState({postGallery: srcArr}, () => console.log("postGallery", this.state.postGallery));
    });
    xhr.addEventListener('error', () => {
      console.log("上传失败：", JSON.parse(xhr.responseText));
    });
  }

  handleChange = (content) => {
    console.log("handleChange==>",content)
  };

  handleHTMLChange = (html) => {
    console.log("handleHTMLChange==>",html)
  };
  // 处理标题
  handleTitleChange = (e) => {
    console.log("文章标题: ", e.target.value);
    this.setState({
      title: e.target.value
    })
  };

  // 选择类型
  onClassChange(e) {
    console.log(`radio checked:${e.target.value}`);
    this.setState({
      cid: e.target.value
    })
  }

  //createPost
  createPost = (values) => {
    console.log("createPostArgv==>", values)
    this.props.dispatch({
      type: "post/createPost",
      payload: values
    }).catch(err => err)
  };

  // 提交文章
  submitPost = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        console.log("values==>", values);
        this.createPost(values);
      }
    });
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'post/getClasses',
      payload: {
        limit: 10
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {classes} = this.props.post;
    console.log("view props==>", classes);
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <div>
            <h3>文章标题</h3>
            {getFieldDecorator('title', {
              initialValue: ""
            })(
              <Input placeholder="请输入文章标题" onChange={(v)=>this.handleTitleChange(v)}/>
            )}
          </div>
          <div>
            <h3>上传封面图片</h3>
            <label className={styles.upload_img_label} htmlFor="upload-img">
              <Icon className="upload-icon" type="upload"/>
              选择文件
            </label>
            <input className={styles.upload_img} id="upload-img" type="file" name="img"
                   onChange={(file) => this.uploadCover(file)}/>
            {postGallery &&
            <span className={styles.img_name}><Icon type="link"/>{postGallery}</span>
            }
          </div>
          <div style={{marginTop: 10, marginBottom: 10}}>
            <span style={{fontWeight: 'bold', fontSize: 16}}>文章类型: </span>
            {getFieldDecorator('cid', {
              initialValue: classes.length > 0 ? classes[0].id : ""
            })(
              <RadioGroup onChange={(e) => this.onClassChange(e)}>
                {
                  classes.map((item ,i)=> {
                    return(
                      <RadioButton key={item.id} value={item.id}>{item.name}</RadioButton>
                    )
                  })
                }
              </RadioGroup>
            )}
          </div>
        <div className="demo" id="demo" style={{borderWidth: 1, borderStyle:'solid', borderColor:'#979797'}}>
          {getFieldDecorator('content')(
            <BraftEditor
              height={400}
              viewWrapper={'#demo'}
              placeholder={"请输入文章正文"}
              ref={instance => this.editorInstance = instance}
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
          )}
        </div>
          <Button type="primary" onClick={() => this.submitPost()}>提交</Button>
        </Card>
      </PageHeaderLayout>
    )

  }
}
